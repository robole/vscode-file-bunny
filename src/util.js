// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");

function isWorkspaceOpen() {
  return !(vscode.workspace.workspaceFolders === undefined);
}

function hasActiveTextEditor() {
  return !(vscode.window.activeTextEditor === undefined);
}

function hasActiveTab() {
  return !(vscode.window.tabGroups.activeTabGroup.activeTab === undefined);
}

function getActiveTabUri() {
  let uri;

  const { activeTab } = vscode.window.tabGroups.activeTabGroup;

  if (activeTab.input) {
    uri = activeTab.input.uri;
  }

  return uri;
}

async function closeTab(uri) {
  const tabs = vscode.window.tabGroups.all.map((tg) => tg.tabs).flat();

  const index = tabs.findIndex((tab) => tab.input.uri.path === uri.path);

  if (index !== -1) {
    await vscode.window.tabGroups.close(tabs[index]);
  }
}

async function switchFocusNextTab() {
  await vscode.commands.executeCommand("workbench.action.nextEditorInGroup");
}

function isRootFolder(p) {
  const parentPath = nodePath.join(p, "../");
  if (p === parentPath || parentPath === "./" || /\w:\/$/.test(p)) {
    return true;
  }
  return false;
}

async function enableKeyBindings() {
  vscode.commands.executeCommand("setContext", "inFileBunny", true);
}

async function disableKeyBindings() {
  vscode.commands.executeCommand("setContext", "inFileBunny", false);
}

function convertPath(windowsPath) {
  // handle the edge-case of Window's long file names
  // See: https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#short-vs-long-names
  let path = windowsPath.replace(/^\\\\\?\\/, "");

  // convert the separators, valid since both \ and / can't be in a windows filename
  path = path.replace(/\\/g, "/");

  // compress any // or /// to be just /, which is a safe oper under POSIX
  // and prevents accidental errors caused by manually doing path1+path2
  path = path.replace(/\/\/+/g, "/");

  return path;
}

// Create glob pattern that works on all OS. Inspired by fast-glob (https://github.com/mrmlnc/fast-glob/)
function escapePath(pattern) {
  const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
  let converted = convertPath(pattern);
  return converted.replace(UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
}

function truncateName(name) {
  let newName = name;
  let maxLen = 30;

  if (name.length > maxLen) {
    newName = `...${name.slice(name.length - maxLen, name.length)}`;
  }
  return newName;
}

function createUniqueFileName(fileName, index) {
  let extension = nodePath.extname(fileName);
  let nameOnly = fileName;
  if (extension) {
    let parts = fileName.split(".");
    parts.pop();
    nameOnly = parts.join(".");
  }

  let versionedName = nameOnly.match(/(.*)(\(\d+\)$)/);

  let num = 0;
  let newName = "";

  if (versionedName !== null && versionedName.length === 3) {
    let bracketedVersionNum = versionedName[2];
    [num] = bracketedVersionNum.match(/\d+/);

    num = parseInt(num) + 1;
    newName = `${versionedName[1]}(${num})`;
  } else {
    newName = `${nameOnly}(${index})`;
  }

  if (extension) {
    newName += `${extension}`;
  }

  return newName;
}

module.exports = {
  isWorkspaceOpen,
  isRootFolder,
  closeTab,
  hasActiveTextEditor,
  hasActiveTab,
  getActiveTabUri,
  switchFocusNextTab,
  enableKeyBindings,
  disableKeyBindings,
  escapePath,
  truncateName,
  createUniqueFileName,
};
