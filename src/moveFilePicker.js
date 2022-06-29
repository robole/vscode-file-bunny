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

class MoveFilePicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, `Move File`, "Pick a file to move", []),
      new Step(
        2,
        `Move File`,
        "Pick a location",
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
    this.picker.enabled = false;
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
    this.picker.enabled = true;
  }

  async onDidAccept() {
    let pickedItems = this.picker.selectedItems;

    if (this.currentStepNum === 1) {
      let selection = pickedItems[0].name;
      this.steps[0].value = selection;
      this.picker.value = "";

      this.steps[1].title = `Move '${selection}' to`;

      this.goForward();
    } else if (this.currentStepNum === 2) {
      let selection = pickedItems[0].name;
      this.steps[1].value = selection;

      await this.moveFile();
      this.picker.hide();
    }
  }

  goBack() {
    if (this.currentStepNum > 1) {
      let previousIndex = this.currentStepNum - 2;

      this.picker.enabled = false;
      this.setCurrentStep(this.steps[previousIndex]);

      // required to clear filter if text was entered in last step
      setTimeout(() => {
        this.picker.value = this.steps[previousIndex].value;
        this.picker.items = this.steps[previousIndex].items;
      }, 20);
      this.picker.enabled = true;
    }
  }

  onDidChangeValue(newValue) {
    if (this.currentStepNum === 2) {
      let newFilePath = nodePath.join(this.steps[1].value, newValue);
      this.setTitle(this.steps[0].value, newFilePath);
    }
  }

  setTitle(from, to) {
    this.picker.title = `Move '${from}' to '${to}'`;
  }

  async moveFile() {
    let sourceUri = vscode.Uri.file(
      nodePath.join(this.rootFolder, this.steps[0].value)
    );

    let fileName = nodePath.basename(sourceUri.fsPath);

    let destinationUri = vscode.Uri.file(
      nodePath.join(this.rootFolder, this.steps[1].value, fileName)
    );

    try {
      let exists = await fileSystem.exists(destinationUri);

      if (exists === false) {
        await vscode.workspace.fs.rename(sourceUri, destinationUri, {
          overwrite: false,
        });

        // return focus to editor
        await vscode.window.showTextDocument(destinationUri);
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

module.exports = MoveFilePicker;
