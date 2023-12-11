// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");
const Step = require("./step");
const globPicker = require("./globPicker");
const MultiStepPicker = require("./multiStepPicker");
const configuration = require("./configuration");
const util = require("./util");
const fileSystem = require("./fileSystem");

class DuplicateFolderPicker extends MultiStepPicker {
  constructor() {
    let steps = [
      new Step(1, `Duplicate Folder`, "Pick a folder to duplicate", []),
      new Step(
        2,
        `Duplicate to`,
        "Pick a location for the duplicated folder",
        [],
        [vscode.QuickInputButtons.Back]
      ),
      new Step(
        3,
        `Name duplicated folder`,
        "Name duplicated folder",
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
    if (this.hasMoreSteps() === true) {
      let pickedItem = this.picker.selectedItems[0].name;
      let currentIndex = this.currentStepNum - 1;
      this.steps[currentIndex].value = pickedItem;

      if (this.currentStepNum === 2) {
        // set value for last step to original folder name
        this.absoluteFromPath = nodePath.join(
          this.rootFolder,
          this.steps[0].value
        );
        let fromFolderName = nodePath.basename(this.absoluteFromPath);

        this.steps[2].value = fromFolderName;
      }

      this.picker.value = "";
      this.setCurrentStep(this.steps[currentIndex + 1]);
    } else {
      this.duplicate();
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
      this.setTitle(`Duplicate '${truncatedName}'`);
    }
    if (this.currentStepNum === 2) {
      let truncatedFromFolder = util.truncateName(this.steps[0].value);
      let truncatedToFolder = util.truncateName(
        this.picker.activeItems[0].name
      );

      this.setTitle(
        `Duplicate '${truncatedFromFolder}' to '${truncatedToFolder}'`
      );
    } else if (this.currentStepNum === 3) {
      let truncatedFromFolder = util.truncateName(this.steps[0].value);
      let toFolder = nodePath.join(this.steps[1].value, this.picker.value);
      let truncatedToFolder = util.truncateName(toFolder);

      this.setTitle(
        `Duplicate '${truncatedFromFolder}' to '${truncatedToFolder}'`
      );
    }
  }

  setTitle(value) {
    this.picker.title = value;
  }

  async duplicate() {
    let absoluteFromUri = vscode.Uri.file(this.absoluteFromPath);

    let absoluteToPath = nodePath.join(this.rootFolder, this.steps[1].value);

    if (this.steps[1].value === globPicker.currentFolderName) {
      absoluteToPath = this.rootFolder;
    }

    let selection = this.picker.value;
    let absoluteToUri = vscode.Uri.file(
      nodePath.join(absoluteToPath, selection)
    );
    let duplicatable = await canDuplicate(
      absoluteFromUri.fsPath,
      absoluteToUri.fsPath
    );

    if (duplicatable === false) {
      return;
    }

    try {
      await vscode.workspace.fs.copy(absoluteFromUri, absoluteToUri, {
        overwrite: false,
      });
    } catch (err) {
      vscode.window.showErrorMessage(err.message);
    }

    this.close();
  }
}

async function canDuplicate(fromPath, toPath) {
  if (fromPath === toPath) {
    vscode.window.showErrorMessage(
      "The duplicate folder cannot have the same path as the original folder. Choose an unique name."
    );
    return false;
  }

  let exists = true;

  try {
    exists = await fileSystem.exists(vscode.Uri.file(toPath));

    if (exists) {
      vscode.window.showErrorMessage(
        "The duplicate folder cannot have the same path as the another folder. Choose an unique name."
      );
      return false;
    }
  } catch (err) {
    vscode.window.showErrorMessage(err.message);
  }

  return true;
}

module.exports = DuplicateFolderPicker;
