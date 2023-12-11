// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");
const Step = require("./step");
const util = require("./util");
const fileSystem = require("./fileSystem");
const globPicker = require("./globPicker");
const MultiStepPicker = require("./multiStepPicker");
const configuration = require("./configuration");

class NewFilePicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, "Create New File - location", "Pick a location"),
      new Step(
        2,
        "Create New File - name",
        "Enter a name",
        [],
        [vscode.QuickInputButtons.Back]
      ),
    ];

    super(steps);

    this.rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;

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
    this.steps[0].items = allFolders;

    this.setCurrentStep(this.steps[0]);

    this.picker.busy = false;
  }

  async onDidAccept() {
    let currentValue = this.picker.value;
    let pickedItems = this.picker.selectedItems;

    if (this.currentStepNum === 1) {
      let selection = pickedItems[0].name;
      this.steps[0].value = selection;
      this.picker.value = "";

      this.setCurrentStep(this.steps[1]);
      this.setTitle(selection);
    } else if (this.currentStepNum === 2) {
      // final step
      this.steps[1].value = currentValue;

      let absoluteFilepath = nodePath.join(
        this.rootFolder,
        this.steps[0].value,
        this.steps[1].value
      );

      try {
        let uri = vscode.Uri.file(absoluteFilepath);

        let exists = await fileSystem.exists(uri);
        if (exists) {
          vscode.window.showErrorMessage("File exists already");
          return;
        }

        await vscode.workspace.fs.writeFile(uri, new Uint8Array());
        await vscode.commands.executeCommand("vscode.open", uri);
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }

      this.close();
    }
  }

  onDidChangeValue(newValue) {
    if (this.currentStepNum === 2) {
      let newFilePath = nodePath.join(this.steps[0].value, newValue);
      this.setTitle(newFilePath);
    }
  }

  setTitle(filepath) {
    this.picker.title = `Create New File - name - "${filepath}"`;
  }
}

module.exports = NewFilePicker;
