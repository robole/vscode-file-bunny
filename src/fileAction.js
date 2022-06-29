// @ts-nocheck
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const nodePath = require("path");
const configuration = require("./configuration");
const NewFilePicker = require("./newFilePicker");
const DuplicateFilePicker = require("./duplicateFilePicker");
const MoveFilePicker = require("./moveFilePicker");
const DuplicateActiveFilePicker = require("./duplicateActiveFilePicker");
const globPicker = require("./globPicker");
const fileSystem = require("./fileSystem");
const util = require("./util");

async function createFile() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let picker = new NewFilePicker();
  await picker.run();
}

async function openFile() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("vscode.open", selectedFile);
  }
}

async function openFileExternal() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    try {
      await vscode.env.openExternal(selectedFile);
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }
}

async function openActiveFileExternal() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let activeDocUri = vscode.window.activeTextEditor.document.uri;

  try {
    await vscode.env.openExternal(activeDocUri);
  } catch (err) {
    vscode.window.showErrorMessage(err);
  }
}

async function openFileAbove() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("workbench.action.splitEditorUp");
    await vscode.commands.executeCommand("vscode.open", selectedFile);
    await vscode.commands.executeCommand(
      "workbench.action.closeEditorsToTheLeft"
    );
  }
}

async function openFileBelow() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("workbench.action.splitEditorDown");
    await vscode.commands.executeCommand("vscode.open", selectedFile);
    await vscode.commands.executeCommand(
      "workbench.action.closeEditorsToTheLeft"
    );
  }
}

async function openFileToRight() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("workbench.action.splitEditorRight");
    await vscode.commands.executeCommand("vscode.open", selectedFile);
    await vscode.commands.executeCommand(
      "workbench.action.closeEditorsToTheLeft"
    );
  }
}

async function openFileToLeft() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile();

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("workbench.action.splitEditorLeft");
    await vscode.commands.executeCommand("vscode.open", selectedFile);
    await vscode.commands.executeCommand(
      "workbench.action.closeEditorsToTheLeft"
    );
  }
}

async function selectWorkspaceFile() {
  if (util.isWorkspaceOpen() === false) {
    return undefined;
  }

  let selectedFileUri;

  let workspaceFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let absoluteExcludes = configuration.getAbsoluteExcludes(workspaceFolderPath);

  let pickerItems = await globPicker.getFilesRecursivelyAsPickerItems(
    workspaceFolderPath,
    { showFiles: true, showFolders: false, excludes: absoluteExcludes }
  );

  let selectedFile = await vscode.window.showQuickPick(pickerItems, {
    ignoreFocusOut: true,
    placeHolder: `Open file`,
  });

  if (selectedFile !== undefined) {
    selectedFileUri = vscode.Uri.file(
      nodePath.join(workspaceFolderPath, selectedFile.name)
    );
  }

  return selectedFileUri;
}

async function moveActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let activeDocUri = vscode.window.activeTextEditor.document.uri;
  let activeDocFileName = nodePath.basename(activeDocUri.toString());
  let workspaceFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let absoluteExcludes = configuration.getAbsoluteExcludes(workspaceFolderPath);

  let pickerItems = await globPicker.getFilesRecursivelyAsPickerItems(
    workspaceFolderPath,
    {
      showFiles: false,
      showFolders: true,
      excludes: absoluteExcludes,
      includeTopFolder: true,
      topFolderDescription: "Workspace Root",
    }
  );

  let selectedFolder = await vscode.window.showQuickPick(pickerItems, {
    ignoreFocusOut: true,
    placeHolder: `Pick a location`,
    title: `Move file`,
  });

  if (selectedFolder !== undefined) {
    let newUri = vscode.Uri.file(
      nodePath.join(workspaceFolderPath, selectedFolder.name, activeDocFileName)
    );

    let exists = await fileSystem.exists(newUri);

    if (exists === false) {
      await vscode.workspace.fs.rename(activeDocUri, newUri, {
        overwrite: false,
      });

      // return focus to editor
      await vscode.window.showTextDocument(newUri);
    } else {
      vscode.window.showErrorMessage(
        "File exists here already. No action taken."
      );
    }
  }
}

async function duplicateActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let picker = new DuplicateActiveFilePicker();
  await picker.run();
}

async function renameActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let { uri, fileName } = vscode.window.activeTextEditor.document;
  let name = nodePath.basename(fileName);
  let dir = nodePath.dirname(fileName);

  let newName = await vscode.window.showInputBox({
    value: name,
    prompt: `Rename file: ${getRelativePathOfActiveFile()}`,
  });

  if (
    newName !== undefined &&
    newName.length > 0 &&
    newName.endsWith("/") === false &&
    newName.endsWith("\\") === false
  ) {
    let newUri = vscode.Uri.file(nodePath.join(dir, newName));
    await vscode.workspace.fs.rename(uri, newUri);

    // return focus to editor
    await vscode.window.showTextDocument(newUri);
  }
}

async function deleteActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let { uri } = vscode.window.activeTextEditor.document;
  await vscode.workspace.fs.delete(uri, { useTrash: true });

  // give focus to next editor
  await vscode.commands.executeCommand("workbench.action.nextEditorInGroup");
}

async function duplicateFile() {
  if (util.isWorkspaceOpen() == false) {
    return;
  }

  let picker = new DuplicateFilePicker();
  await picker.run();
}

async function moveFile() {
  if (util.isWorkspaceOpen() == false) {
    return;
  }

  let picker = new MoveFilePicker();
  await picker.run();
}

async function deleteFile() {
  if (util.isWorkspaceOpen() == false) {
    return;
  }

  let workspaceFolderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let absoluteExcludes = configuration.getAbsoluteExcludes(workspaceFolderPath);

  let allFiles = await globPicker.getFilesRecursivelyAsPickerItems(
    workspaceFolderPath,
    {
      showFiles: true,
      showFolders: false,
      excludes: absoluteExcludes,
    }
  );

  let selectedFile = await vscode.window.showQuickPick(allFiles, {
    ignoreFocusOut: true,
    placeHolder: `Pick a file`,
    title: `Delete File`,
  });

  if (selectedFile !== undefined) {
    let selectedFileUri = vscode.Uri.file(
      nodePath.join(workspaceFolderPath, selectedFile.name)
    );

    await vscode.workspace.fs.delete(selectedFileUri, { useTrash: true });

    // give focus to next editor
    await vscode.commands.executeCommand("workbench.action.nextEditorInGroup");
  }
}

async function copyFileName() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let { fileName } = vscode.window.activeTextEditor.document;
  await vscode.env.clipboard.writeText(nodePath.basename(fileName));
}

async function copyAbsoluteFilePath() {
  await vscode.commands.executeCommand("copyFilePath");
}

async function copyRelativeFilePath() {
  await vscode.commands.executeCommand("copyRelativeFilePath");
}

function goToTopActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let editor = vscode.window.activeTextEditor;

  if (editor !== undefined) {
    editor.revealRange(
      new vscode.Range(0, 0, 0, 0),
      vscode.TextEditorRevealType.AtTop
    );

    editor.selection = new vscode.Selection(0, 0, 0, 0);
  }
}

function goToBottomActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return;
  }

  let editor = vscode.window.activeTextEditor;

  if (editor !== undefined) {
    let lastLineNum = editor.document.lineCount - 1;
    editor.revealRange(
      new vscode.Range(lastLineNum, 0, lastLineNum, 0),
      vscode.TextEditorRevealType.Default
    );

    editor.selection = new vscode.Selection(lastLineNum, 0, lastLineNum, 0);
  }
}

function getRelativePathOfActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return undefined;
  }

  let { uri } = vscode.window.activeTextEditor.document;
  let dirPath = nodePath.dirname(uri.fsPath);
  let fileName = nodePath.basename(uri.fsPath);

  let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let relative = nodePath.relative(workspaceRoot, dirPath);
  return nodePath.join(relative, fileName);
}

module.exports = {
  createFile,
  openFile,
  openActiveFileExternal,
  openFileExternal,
  openFileAbove,
  openFileBelow,
  openFileToRight,
  openFileToLeft,
  moveActiveFile,
  duplicateActiveFile,
  duplicateFile,
  moveFile,
  deleteFile,
  renameActiveFile,
  deleteActiveFile,
  copyFileName,
  copyRelativeFilePath,
  copyAbsoluteFilePath,
  goToTopActiveFile,
  goToBottomActiveFile,
};
