// @ts-nocheck
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const fileAction = require("./fileAction");
const folderAction = require("./folderAction");

function activate(context) {
  let disposable1 = vscode.commands.registerCommand(
    "filebunny.createFile",
    async () => {
      await fileAction.createFile();
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    "filebunny.moveActiveFile",
    async () => {
      await fileAction.moveActiveFile();
    }
  );

  let disposable3 = vscode.commands.registerCommand(
    "filebunny.duplicateActiveFile",
    async () => {
      await fileAction.duplicateActiveFile();
    }
  );

  let disposable4 = vscode.commands.registerCommand(
    "filebunny.renameActiveFile",
    async () => {
      await fileAction.renameActiveFile();
    }
  );

  let disposable5 = vscode.commands.registerCommand(
    "filebunny.deleteActiveFile",
    async () => {
      await fileAction.deleteActiveFile();
    }
  );

  let disposable6 = vscode.commands.registerCommand(
    "filebunny.duplicateFile",
    async () => {
      await fileAction.duplicateFile();
    }
  );

  let disposable7 = vscode.commands.registerCommand(
    "filebunny.moveFile",
    async () => {
      await fileAction.moveFile();
    }
  );

  let disposable8 = vscode.commands.registerCommand(
    "filebunny.deleteFile",
    async () => {
      await fileAction.deleteFile();
    }
  );

  let disposable9 = vscode.commands.registerCommand(
    "filebunny.openFolder",
    async () => {
      await folderAction.openFolder();
    }
  );

  let disposable10 = vscode.commands.registerCommand(
    "filebunny.openWorkspaceFolderExternal",
    async () => {
      await folderAction.openWorkspaceFolderExternal();
    }
  );

  let disposable11 = vscode.commands.registerCommand(
    "filebunny.goToTopActiveFile",
    () => {
      fileAction.goToTopActiveFile();
    }
  );

  let disposable12 = vscode.commands.registerCommand(
    "filebunny.goToBottomActiveFile",
    () => {
      fileAction.goToBottomActiveFile();
    }
  );

  let disposable13 = vscode.commands.registerCommand(
    "filebunny.copyFileName",
    async () => {
      await fileAction.copyFileName();
    }
  );

  let disposable14 = vscode.commands.registerCommand(
    "filebunny.copyRelativeFilePath",
    async () => {
      await fileAction.copyRelativeFilePath();
    }
  );

  let disposable15 = vscode.commands.registerCommand(
    "filebunny.copyAbsoluteFilePath",
    async () => {
      await fileAction.copyAbsoluteFilePath();
    }
  );

  // premium
  let disposable16 = vscode.commands.registerCommand(
    "filebunny.openFile",
    async () => {
      await fileAction.openFile();
    }
  );

  let disposable17 = vscode.commands.registerCommand(
    "filebunny.openActiveFileExternal",
    async () => {
      await fileAction.openActiveFileExternal();
    }
  );

  let disposable18 = vscode.commands.registerCommand(
    "filebunny.openFileAbove",
    async () => {
      await fileAction.openFileAbove();
    }
  );

  let disposable19 = vscode.commands.registerCommand(
    "filebunny.openFileBelow",
    async () => {
      await fileAction.openFileBelow();
    }
  );

  let disposable20 = vscode.commands.registerCommand(
    "filebunny.openFileToRight",
    async () => {
      await fileAction.openFileToRight();
    }
  );

  let disposable21 = vscode.commands.registerCommand(
    "filebunny.openFileToLeft",
    async () => {
      await fileAction.openFileToLeft();
    }
  );

  let disposable22 = vscode.commands.registerCommand(
    "filebunny.openRecentFolder",
    async () => {
      await fileAction.openRecentFolder();
    }
  );

  let disposable23 = vscode.commands.registerCommand(
    "filebunny.createFolder",
    async () => {
      await folderAction.createFolder();
    }
  );

  let disposable24 = vscode.commands.registerCommand(
    "filebunny.duplicateFolder",
    async () => {
      await folderAction.duplicateFolder();
    }
  );

  let disposable25 = vscode.commands.registerCommand(
    "filebunny.deleteFolder",
    async () => {
      await folderAction.deleteFolder();
    }
  );

  let disposable26 = vscode.commands.registerCommand(
    "filebunny.openFileExternal",
    async () => {
      await fileAction.openFileExternal();
    }
  );

  let disposable27 = vscode.commands.registerCommand(
    "filebunny.openFolderExternal",
    async () => {
      await folderAction.openFolderExternal();
    }
  );

  context.subscriptions = [
    disposable1,
    disposable2,
    disposable3,
    disposable4,
    disposable5,
    disposable6,
    disposable7,
    disposable8,
    disposable9,
    disposable10,
    disposable11,
    disposable12,
    disposable13,
    disposable14,
    disposable15,
    disposable16,
    disposable17,
    disposable18,
    disposable19,
    disposable20,
    disposable21,
    disposable22,
    disposable23,
    disposable24,
    disposable25,
    disposable26,
    disposable27,
  ];
}

module.exports = {
  activate,
};
