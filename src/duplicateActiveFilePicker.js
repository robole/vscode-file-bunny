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

class DuplicateActiveFilePicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, `Duplicate Active File - location`, "Pick a location", []),
      new Step(
        2,
        `Duplicate Active File - name`,
        "Enter a name",
        [],
        [vscode.QuickInputButtons.Back]
      ),
    ];

    super(steps);

    if (util.isWorkspaceOpen() === false) {
      this.close();
      throw new Error(
        "You cannot duplicate a file if there is no open workspace."
      );
    } else {
      this.rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    if (util.hasActiveTab()) {
      this.activeFileUri = util.getActiveTabUri();
      if (this.activeFileUri) {
        this.filename = nodePath.basename(this.activeFileUri.fsPath);
      }
    } else {
      this.close();
      throw new Error("There is no active file");
    }

    this.steps[1].value = this.filename;

    let disposable1 = this.picker.onDidChangeValue(
      this.onDidChangeValue.bind(this)
    );
    this.disposables.push(disposable1);
  }

  async run() {
    if (util.isWorkspaceOpen() === false || util.isWorkspaceOpen() === false) {
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

      this.currentStepNum = 2;
      this.steps[1].title = `Duplicate Active File - name - '${
        this.filename
      }' to '${nodePath.join(selection, this.filename)}'`;
      this.setCurrentStep(this.steps[1]);
    } else if (this.currentStepNum === 2) {
      this.steps[1].value = currentValue;

      await this.duplicateFile();

      this.close();
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
      let newFilePath = nodePath.join(this.steps[0].value, newValue);
      this.setTitle(newFilePath);
    }
  }

  setTitle(filepath) {
    this.picker.title = `Duplicate Active File - name - '${this.filename}' to '${filepath}'`;
  }

  async duplicateFile() {
    let absoluteFilepath = nodePath.join(
      this.rootFolder,
      this.steps[0].value,
      this.steps[1].value
    );

    let newUri = vscode.Uri.file(absoluteFilepath);

    try {
      let exists = await fileSystem.exists(newUri);

      if (exists === false) {
        await vscode.workspace.fs.copy(this.activeFileUri, newUri, {
          overwrite: false,
        });
        await vscode.commands.executeCommand("vscode.open", newUri);
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

module.exports = DuplicateActiveFilePicker;
