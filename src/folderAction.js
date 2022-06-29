// @ts-nocheck
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const homeFolder = require("os").homedir();
const configuration = require("./configuration");
const Browser = require("./browser");
const globPicker = require("./globPicker");
const NewFolderPicker = require("./newFolderPicker");
const DuplicateFolderPicker = require("./duplicateFolderPicker");
const fileSystem = require("./fileSystem");

async function openRecentFolder() {
  await vscode.commands.executeCommand("workbench.action.openRecent");
}

async function openFolder() {
  let defaultFolder = await getStartingLocation();
  let defaultFolderUri = vscode.Uri.file(defaultFolder);

  let browser = new Browser(defaultFolderUri, {
    showFolders: true,
    showFiles: false,
    includeTopFolder: true,
  });
  browser.show();

  browser.on("picked", async function () {
    let { selection } = browser;

    if (selection !== null) {
      try {
        await vscode.commands.executeCommand("vscode.openFolder", selection);
      } catch (err) {
        vscode.window.showErrorMessage(err.message);
      }
    }
  });
}

async function getStartingLocation() {
  let userLocation = configuration.getStartingLocationOpenFolder();

  if (userLocation.trim() === "") {
    return homeFolder;
  }

  let uri = vscode.Uri.file(userLocation);
  let exists = false;

  try {
    exists = await fileSystem.exists(uri);
  } catch (err) {
    console.error(err);
  }

  if (exists === false) {
    return homeFolder;
  }

  return userLocation;
}

async function createFolder() {
  if (vscode.workspace.workspaceFolders === undefined) {
    return;
  }

  let picker = new NewFolderPicker();
  await picker.run();
}

async function duplicateFolder() {
  if (vscode.workspace.workspaceFolders === undefined) {
    return;
  }

  let picker = new DuplicateFolderPicker();
  await picker.run();
}

async function deleteFolder() {
  if (vscode.workspace.workspaceFolders) {
    let selectedFolder = await selectWorkspaceFolder(false);

    if (selectedFolder !== undefined) {
      let newUri = vscode.Uri.file(selectedFolder.path);

      await vscode.workspace.fs.delete(newUri, {
        recursive: true,
        useTrash: true,
      });
    }
  }
}

async function openWorkspaceFolderExternal() {
  if (vscode.workspace.workspaceFolders !== undefined) {
    let workspaceFolder = vscode.workspace.workspaceFolders[0];

    try {
      await vscode.env.openExternal(workspaceFolder.uri);
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }
}

async function openFolderExternal() {
  let selectedFolder = await selectWorkspaceFolder(false);

  if (selectedFolder !== undefined) {
    try {
      let uri = vscode.Uri.file(selectedFolder.path);
      await vscode.env.openExternal(uri);
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  }
}

async function selectWorkspaceFolder(includeTopFolder = true) {
  if (vscode.workspace.workspaceFolders === undefined) {
    return undefined;
  }

  let workspaceFolder = vscode.workspace.workspaceFolders[0];
  let workspaceFolderPath = workspaceFolder.uri.fsPath;
  let absoluteExcludes = configuration.getAbsoluteExcludes(workspaceFolderPath);

  let pickerItems = await globPicker.getFilesRecursivelyAsPickerItems(
    workspaceFolderPath,
    {
      showFiles: false,
      showFolders: true,
      excludes: absoluteExcludes,
      includeTopFolder,
    }
  );

  let selectedFolder = await vscode.window.showQuickPick(pickerItems, {
    ignoreFocusOut: true,
    placeHolder: `Choose folder`,
  });

  return selectedFolder;
}

module.exports = {
  openRecentFolder,
  openFolder,
  createFolder,
  duplicateFolder,
  deleteFolder,
  openWorkspaceFolderExternal,
  openFolderExternal,
};
