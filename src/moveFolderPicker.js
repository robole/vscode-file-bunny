// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");
const Step = require("./step");
const globPicker = require("./globPicker");
const MultiStepPicker = require("./multiStepPicker");
const configuration = require("./configuration");
const util = require("./util");

class MoveFolderPicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, `Move Folder`, "Pick a folder to move", []),
      new Step(
        2,
        `Move to`,
        "Pick a location for the moved folder",
        [],
        [vscode.QuickInputButtons.Back]
      ),
    ];

    super(steps);

    if (vscode.workspace.workspaceFolders !== undefined) {
      this.rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    let disposable1 = this.picker.onDidChangeValue(
      this.onDidChangeValue.bind(this)
    );
    this.disposables.push(disposable1);

    let disposable2 = this.picker.onDidChangeActive(
      this.onDidChangeActive.bind(this)
    );
    this.disposables.push(disposable2);
  }

  async run() {
    if (vscode.workspace.workspaceFolders === undefined) {
      return;
    }
    this.picker.show();

    this.picker.busy = true;

    let absoluteExcludes = configuration.getAbsoluteExcludes(this.rootFolder);

    let folderList = await globPicker.getFilesRecursivelyAsPickerItems(
      this.rootFolder,
      {
        showFiles: false,
        showFolders: true,
        excludes: absoluteExcludes,
        includeTopFolder: true,
        topFolderDescription: "Workspace Root",
      }
    );
    this.steps[0].items = folderList;
    this.steps[1].items = folderList;

    this.setCurrentStep(this.steps[0]);
    this.picker.busy = false;
  }

  async onDidAccept() {
    if (this.currentStepNum === 1) {
      let pickedItem = this.picker.selectedItems[0].name;

      let currentIndex = this.currentStepNum - 1;
      this.steps[currentIndex].value = pickedItem;

      this.absoluteFromPath = nodePath.join(
        this.rootFolder,
        this.steps[0].value
      );

      this.picker.value = "";
      this.setCurrentStep(this.steps[currentIndex + 1]);
    } else if (this.currentStepNum === 2) {
      let pickedItem = this.picker.selectedItems[0].name;

      let currentIndex = this.currentStepNum - 1;
      this.steps[currentIndex].value = pickedItem;
      this.move();
    }
  }

  goBack() {
    if (this.currentStepNum > 1) {
      let previousIndex = this.currentStepNum - 2;
      let currentIndex = this.currentStepNum - 1;

      this.picker.enabled = false;
      this.steps[currentIndex].value = "";
      this.setCurrentStep(this.steps[previousIndex]);

      // required to clear filter if text was entered in last step
      setTimeout(() => {
        this.picker.value = this.steps[previousIndex].value;
        this.picker.items = this.steps[previousIndex].items;
      }, 20);
      this.picker.enabled = true;
    }
  }

  onDidChangeValue() {
    this.onDidChangeActive(); // same behaviour desirable for any input change
  }

  onDidChangeActive() {
    if (this.currentStepNum === 1) {
      let folderName = this.picker.activeItems[0].name;
      let truncatedName = util.truncateName(folderName);
      this.setTitle(`Move '${truncatedName}'`);
    } else if (this.currentStepNum === 2) {
      let truncatedFromFolder = util.truncateName(this.steps[0].value);
      let truncatedToFolder = util.truncateName(
        this.picker.activeItems[0].name
      );

      this.setTitle(`Move '${truncatedFromFolder}' to '${truncatedToFolder}'`);
    }
  }

  setTitle(value) {
    this.picker.title = value;
  }

  async move() {
    let absoluteFromUri = vscode.Uri.file(this.absoluteFromPath);

    let absoluteToPath;
    let toFolder = nodePath.basename(this.absoluteFromPath);

    if (this.steps[1].value === globPicker.currentFolderName) {
      absoluteToPath = nodePath.join(this.rootFolder, toFolder);
    } else {
      absoluteToPath = nodePath.join(
        this.rootFolder,
        this.steps[1].value,
        toFolder
      );
    }

    let absoluteToUri = vscode.Uri.file(absoluteToPath);

    try {
      await vscode.workspace.fs.copy(absoluteFromUri, absoluteToUri, {
        overwrite: false,
      });
      await vscode.workspace.fs.delete(absoluteFromUri, {
        recursive: true,
        boolean: true,
      });
    } catch (err) {
      vscode.window.showErrorMessage(err.message);
    }

    this.close();
  }
}

module.exports = MoveFolderPicker;
