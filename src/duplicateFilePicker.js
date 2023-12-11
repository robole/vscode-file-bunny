// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");
const Step = require("./step");
const fileSystem = require("./fileSystem");
const MultiStepPicker = require("./multiStepPicker");
const configuration = require("./configuration");
const globPicker = require("./globPicker");
const util = require("./util");

class DuplicateFilePicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, `Duplicate File - file`, "Pick a file", []),
      new Step(
        2,
        `Duplicate File - location`,
        "Pick a location",
        [],
        [vscode.QuickInputButtons.Back]
      ),
      new Step(
        3,
        `Duplicate File - name`,
        "Enter a name",
        [],
        [vscode.QuickInputButtons.Back]
      ),
    ];

    super(steps);

    if (util.isWorkspaceOpen()) {
      this.rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    let disposable1 = this.picker.onDidChangeValue(
      this.onDidChangeValue.bind(this)
    );
    this.disposables.push(disposable1);
  }

  async run() {
    if (util.isWorkspaceOpen() === false) {
      return;
    }

    this.picker.show();

    this.picker.busy = true;

    let absoluteExcludes = configuration.getAbsoluteExcludes(this.rootFolder);

    let allFolders = await globPicker.getFilesRecursivelyAsPickerItems(
      this.rootFolder,
      {
        showFiles: false,
        showFolders: true,
        excludes: absoluteExcludes,
        includeTopFolder: true,
        topFolderDescription: "Workspace Root",
      }
    );

    this.steps[1].items = allFolders;

    let allFiles = await globPicker.getFilesRecursivelyAsPickerItems(
      this.rootFolder,
      { showFiles: true, showFolders: false, excludes: absoluteExcludes }
    );

    this.steps[0].items = allFiles;

    this.setCurrentStep(this.steps[0]);
    this.picker.busy = false;
  }

  async onDidAccept() {
    let pickedItems = this.picker.selectedItems;

    if (this.currentStepNum === 1) {
      let selection = pickedItems[0].name;
      this.steps[0].value = selection;
      this.picker.value = "";

      this.steps[1].title = `Duplicate File - location - '${this.steps[0].value}' to?`;

      this.goForward();
    } else if (this.currentStepNum === 2) {
      let selection = pickedItems[0].name;
      this.steps[1].value = selection;

      this.steps[2].title = `Duplicate File - name - '${this.steps[0].value}' to '${this.steps[1].value}'`;
      this.steps[2].value = nodePath.basename(this.steps[0].value); // only want filename from step 1

      this.goForward();
    } else if (this.currentStepNum === 3) {
      this.steps[2].value = this.picker.value;

      await this.duplicateFile();
      this.close();
    }
  }

  onDidChangeValue(newValue) {
    if (this.currentStepNum === 3) {
      let newFilePath = nodePath.join(this.steps[1].value, newValue);
      this.setTitle(this.steps[0].value, newFilePath);
    }
  }

  setTitle(from, to) {
    this.picker.title = `Duplicate File - name - '${from}' to '${to}'`;
  }

  async duplicateFile() {
    let sourceUri = vscode.Uri.file(
      nodePath.join(this.rootFolder, this.steps[0].value)
    );

    let destinationUri = vscode.Uri.file(
      nodePath.join(this.rootFolder, this.steps[1].value, this.steps[2].value)
    );

    try {
      let exists = await fileSystem.exists(destinationUri);

      if (exists === false) {
        await vscode.workspace.fs.copy(sourceUri, destinationUri, {
          overwrite: false,
        });
        await vscode.commands.executeCommand("vscode.open", destinationUri);
      } else {
        vscode.window.showErrorMessage(
          "File exists here already. No action taken."
        );
      }
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }
}

module.exports = DuplicateFilePicker;
