// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const path = require("path");
const EventEmitter = require("events");
const FileType = require("./fileType");
const BrowserOptions = require("./browserOptions");
const globPicker = require("./globPicker");
const util = require("./util");
const configuration = require("./configuration");

class Browser extends EventEmitter {
  constructor(uri, options) {
    super();
    this.uri = uri;
    this.setDefaultValues(options);
    this.selection = null;

    this.picker = vscode.window.createQuickPick();

    this.excludes = configuration.getAbsoluteExcludes(this.uri.fsPath);

    this.picker.ignoreFocusOut = this.options.ignoreFocusOut;
    this.picker.placeholder = "Preparing the list...";

    this.backButton = vscode.QuickInputButtons.Back;
    this.nextButton = {
      iconPath: new vscode.ThemeIcon("arrow-right"),
      tooltip: "Go to next location",
    };
    this.picker.buttons = [this.backButton, this.nextButton];

    let command1 = vscode.commands.registerCommand("filebunny.back", () => {
      this.goBack();
    });
    let command2 = vscode.commands.registerCommand("filebunny.next", () => {
      this.goNext();
    });

    this.disposables = [command1, command2];

    this.picker.onDidAccept(this.accept.bind(this));
    this.picker.onDidHide(this.hide.bind(this));
    this.picker.onDidTriggerButton(this.onDidTriggerButton.bind(this));
  }

  setDefaultValues(options) {
    this.options = options;

    if (options.showFiles === undefined) {
      this.options.showFiles = BrowserOptions.showFiles;
    }

    if (options.showFolders === undefined) {
      this.options.showFolders = BrowserOptions.showFolders;
    }

    if (options.includeTopFolder === undefined) {
      this.options.includeTopFolder = BrowserOptions.includeTopFolder;
    }

    if (options.ignoreFocusOut === undefined) {
      this.options.ignoreFocusOut = BrowserOptions.ignoreFocusOut;
    }
  }

  dispose() {
    util.disableKeyBindings();
    this.disposables.forEach((item) => {
      item.dispose();
    });
    this.picker.dispose();
  }

  hide() {
    this.picker.hide();
    this.dispose();
  }

  show() {
    util.enableKeyBindings();
    this.picker.show();
    this.update();
  }

  async update() {
    this.picker.enabled = false;
    this.picker.busy = true;

    this.picker.title = this.uri.fsPath;
    this.picker.value = "";
    this.picker.placeholder = "Preparing the list...";

    this.picker.items = await globPicker.getFilesAsPickerItems(
      this.uri.fsPath,
      {
        showFiles: this.options.showFiles,
        showFolders: this.options.showFolders,
        includeTopFolder: this.options.includeTopFolder,
        excludes: this.excludes,
      }
    );

    this.picker.placeholder = `Type to filter items`;
    this.picker.busy = false;
    this.picker.enabled = true;
  }

  onDidTriggerButton(button) {
    if (button === this.backButton) {
      this.goBack();
    } else if (button === this.nextButton) {
      this.goNext();
    }
  }

  goBack() {
    let currentFolderPath = this.uri.fsPath;
    let parentFolderPath = path.dirname(currentFolderPath);

    if (
      parentFolderPath !== undefined &&
      util.isRootFolder(currentFolderPath) === false
    ) {
      let parentFolderUri = vscode.Uri.file(parentFolderPath);
      this.uri = parentFolderUri;
      this.update();
    }
  }

  goNext() {
    let { activeItems } = this.picker;

    if (
      activeItems.length > 0 &&
      (activeItems[0].fileType === FileType.Folder ||
        activeItems[0].fileType === FileType.SymbolicLinkFolder)
    ) {
      let item = activeItems[0].name;

      if (item !== undefined) {
        let nextUri = vscode.Uri.joinPath(this.uri, item);

        // don't navigate when current folder is selected
        if (
          this.options.includeTopFolder === false ||
          (this.options.includeTopFolder &&
            path.basename(this.uri.fsPath) !== item)
        ) {
          this.uri = nextUri;
          this.update();
        }
      }
    }
  }

  async accept() {
    let item = this.picker.activeItems[0];

    if (
      item.fileType === FileType.File ||
      item.fileType === FileType.SymbolicLinkFile
    ) {
      this.uri = vscode.Uri.joinPath(this.uri, item.name);
      this.selection = this.uri;
      this.emit("picked");
      this.hide();
    } else if (
      item.fileType === FileType.Folder ||
      item.fileType === FileType.SymbolicLinkFolder
    ) {
      let newUri = vscode.Uri.file(item.path);
      this.selection = newUri;
      this.emit("picked", this.selection);
      this.hide();
    }
  }
}

module.exports = Browser;
