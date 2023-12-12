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

// #region Workspace file functions

async function openFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
      "You cannot open a file if a workspace is not open."
    );
    return;
  }

  let selectedFile = await selectWorkspaceFile("Open File");

  if (selectedFile !== undefined) {
    await vscode.commands.executeCommand("vscode.open", selectedFile);
  }
}

async function openFileAbove() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
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
    vscode.window.showErrorMessage(
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
    vscode.window.showErrorMessage(
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
    vscode.window.showErrorMessage(
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

async function createFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
      "You cannot create a file if a workspace is not open."
    );
    return;
  }

  let picker = new NewFilePicker();
  await picker.run();
}

async function moveFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
      "You cannot move a file if a workspace is not open."
    );
    return;
  }

  let picker = new MoveFilePicker();
  await picker.run();
}

async function duplicateFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
      "You cannot duplicate a file if a workspace is not open."
    );
    return;
  }

  let picker = new DuplicateFilePicker();
  await picker.run();
}

async function deleteFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErrorMessage(
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

    try {
      await vscode.workspace.fs.delete(selectedFileUri, { useTrash: true });
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not delete file: ${selectedFileUri.path}. ${error}`
      );
    }
  }
}

// #endregion

// #region Active file functions

async function openActiveFileExternal() {
  if (util.hasActiveTab() === false) {
    return;
  }

  let uri = util.getActiveTabUri();

  try {
    await vscode.env.openExternal(uri);
  } catch (err) {
    vscode.window.showErrorMessage(
      `Could not open the file in default external app: ${uri.fsPath}. ${err.message}.`
    );
  }
}

async function moveActiveFile() {
  if (util.isWorkspaceOpen() === false) {
    vscode.window.showErorMessage(
      "You cannot move an active file if there is no open workspace."
    );
    return;
  }

  if (util.hasActiveTab() === false) {
    return;
  }

  let uri = util.getActiveTabUri();

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
    let filename = nodePath.basename(uri.path);
    let newUri = vscode.Uri.file(
      nodePath.join(startingLocation, selectedFolder.name, filename)
    );

    let exists = await fileSystem.exists(newUri);

    if (exists === false) {
      try {
        await vscode.workspace.fs.rename(uri, newUri, {
          overwrite: false,
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `Could not move file: ${uri.path}. ${error}.`
        );
      }
    } else {
      vscode.window.showWarningMessage(
        "File exists here already. No action taken."
      );
    }
  }
}

async function duplicateActiveFile() {
  try {
    let picker = new DuplicateActiveFilePicker();
    await picker.run();
  } catch (error) {
    vscode.window.showErrorMessage(error.message);
  }
}

async function renameActiveFile() {
  if (util.hasActiveTab() === false) {
    return;
  }

  let uri = util.getActiveTabUri();
  let filename = nodePath.basename(uri.fsPath);
  let relativePath = getRelativePathOfActiveFile();

  let newName = await vscode.window.showInputBox({
    value: filename,
    prompt: `Rename Active File - '${relativePath}'`,
  });

  if (
    newName !== undefined &&
    newName.length > 0 &&
    newName.endsWith("/") === false &&
    newName.endsWith("\\") === false
  ) {
    try {
      let dirPath = nodePath.dirname(uri.fsPath);
      let newUri = vscode.Uri.file(nodePath.join(dirPath, newName));
      await vscode.workspace.fs.rename(uri, newUri);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not rename file: ${uri.path}. ${error}.`
      );
    }
  }
}

async function deleteActiveFile() {
  if (util.hasActiveTab() === false) {
    return;
  }

  let uri = util.getActiveTabUri();

  try {
    await vscode.workspace.fs.delete(uri, { useTrash: true });
    await util.closeTab(uri);
    await util.switchFocusNextTab();
  } catch (error) {
    vscode.window.showErrorMessage(
      `Could not delete file: ${uri.fsPath}. ${error.message}.`
    );
  }
}
// #endregion

// #region Quick navigation functions
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
// #endregion

// #region Quick metadata functions
async function copyFileName() {
  if (util.hasActiveTab() === false) {
    return;
  }

  let uri = util.getActiveTabUri();

  await vscode.env.clipboard.writeText(nodePath.basename(uri.fsPath));
}

async function copyAbsoluteFilePath() {
  await vscode.commands.executeCommand("copyFilePath");
}

async function copyRelativeFilePath() {
  await vscode.commands.executeCommand("copyRelativeFilePath");
}
// #endregion

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

/**
 * Gets the path of the active file relative to the workspace folder. If no workspace is open, the absolute path is returned. If the
 * file is not in the workspace, the absolute path is returned.
 * @returns {string}
 */
function getRelativePathOfActiveFile() {
  if (util.hasActiveTab() === false) {
    return undefined;
  }

  let uri;
  const { activeTab } = vscode.window.tabGroups.activeTabGroup;

  if (activeTab.input) {
    uri = activeTab.input.uri;
  }

  let dirPath = nodePath.dirname(uri.fsPath);
  let filename = nodePath.basename(uri.fsPath);
  let relativePath = uri.fsPath;

  if (util.isWorkspaceOpen()) {
    let workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    let relativeDir = nodePath.relative(workspaceRoot, dirPath);
    relativePath = nodePath.join(relativeDir, filename);

    if (relativePath.startsWith("..")) {
      relativePath = uri.fsPath;
    } else {
      relativePath = `./${relativePath}`;
    }
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
