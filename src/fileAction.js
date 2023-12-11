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
    vscode.window.showWarningMessage(
      "You cannot create a file if a workspace is not open."
    );
    return;
  }

  let picker = new NewFilePicker();
  await picker.run();
}

async function openFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showWarningMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File");

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("vscode.open", selectedFile);
  }
}

async function openFileExternal() {
  if (util.isWorkspaceOpen() === false) {
    return;
  }

  let selectedFile = await selectWorkspaceFile(
    "Open File in External Default App"
  );

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
    vscode.window.showWarningMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File Above");

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
    vscode.window.showWarningMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File Below");

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
    vscode.window.showWarningMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File to the Right");

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
    vscode.window.showWarningMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File to the Left");

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("workbench.action.splitEditorLeft");
    await vscode.commands.executeCommand("vscode.open", selectedFile);
    await vscode.commands.executeCommand(
      "workbench.action.closeEditorsToTheLeft"
    );
  }
}

async function selectWorkspaceFile(title = "") {
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
    placeHolder: `Pick a file`,
    title,
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
  let activeDocFileName = nodePath.basename(activeDocUri.path);

  if (util.isWorkspaceOpen() === false) {
    vscode.window.showWarningMessage(
      "You cannot move an active file if a workspace is not open."
    );
    return;
  }

  let startingLocation = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let absoluteExcludes = configuration.getAbsoluteExcludes(startingLocation);
  let topFolderDescription = "Workspace Root";

  let pickerItems = await globPicker.getFilesRecursivelyAsPickerItems(
    startingLocation,
    {
      showFiles: false,
      showFolders: true,
      excludes: absoluteExcludes,
      includeTopFolder: true,
      topFolderDescription,
    }
  );

  let selectedFolder = await vscode.window.showQuickPick(pickerItems, {
    ignoreFocusOut: true,
    placeHolder: `Pick a location`,
    title: `Move Active File`,
  });

  if (selectedFolder !== undefined) {
    let newUri = vscode.Uri.file(
      nodePath.join(startingLocation, selectedFolder.name, activeDocFileName)
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
  let relativePath = getRelativePathOfActiveFile();

  if (relativePath.startsWith("..")) {
    relativePath = uri.fsPath;
  }

  let newName = await vscode.window.showInputBox({
    value: name,
    prompt: `Rename Active File - '${relativePath}'`,
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
  await util.closeTextEditor(uri);

  // give focus to next editor
  await vscode.commands.executeCommand("workbench.action.nextEditorInGroup");
}

async function duplicateFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showWarningMessage(
      "You cannot duplicate a file if a workspace is not open."
    );
    return;
  }

  let picker = new DuplicateFilePicker();
  await picker.run();
}

async function moveFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showWarningMessage(
      "You cannot move a file if a workspace is not open."
    );
    return;
  }

  let picker = new MoveFilePicker();
  await picker.run();
}

async function deleteFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showWarningMessage(
      "You cannot delete a file if a workspace is not open."
    );
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
    await util.closeTextEditor(selectedFileUri);

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

/**
 * Gets the path of the active file relative to the workspace folder. If no workspace is open, the absolute path is returned.
 * @returns {string}
 */
function getRelativePathOfActiveFile() {
  if (util.hasActiveTextEditor() === false) {
    return undefined;
  }

  let { uri } = vscode.window.activeTextEditor.document;
  let dirPath = nodePath.dirname(uri.fsPath);
  let fileName = nodePath.basename(uri.fsPath);
  let relativePath = uri.fsPath;

  if (util.isWorkspaceOpen()) {
    let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    let relativeDir = nodePath.relative(workspaceRoot, dirPath);
    relativePath = nodePath.join(relativeDir, fileName);
  }

  return relativePath;
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
