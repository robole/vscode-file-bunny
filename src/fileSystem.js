// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const nodePath = require("path");
const configuration = require("./configuration");

async function exists(fileUri) {
  try {
    await vscode.workspace.fs.stat(fileUri);
  } catch (err) {
    if (err.code === "FileNotFound" || err.code === "EntryNotFound") {
      return false;
    }
    throw err;
  }
  return true;
}

async function remove(uri, { recursive = false } = {}) {
  const useTrash = configuration.getUseTrash();

  // 1. If user explicitly disabled trash in settings, permanently delete directly
  if (useTrash === false) {
    await vscode.workspace.fs.delete(uri, { recursive, useTrash: false });
    return true;
  }

  // 2. Default behavior: attempt to move to trash
  try {
    await vscode.workspace.fs.delete(uri, { recursive, useTrash: true });
    return true;
  } catch (error) {
    // 3. Prompt user if filesystem does not support trash (e.g. WSL, Remote SSH, Containers)
    if (error.message && error.message.includes("trash")) {
      const fileName = nodePath.basename(uri.fsPath);
      const DELETE_PERMANENTLY = "Delete Permanently";
      const ALWAYS_DELETE_PERMANENTLY = "Always Delete Permanently";

      const choice = await vscode.window.showWarningMessage(
        `The filesystem does not support moving to trash. Do you want to permanently delete '${fileName}'?`,
        { modal: true },
        DELETE_PERMANENTLY,
        ALWAYS_DELETE_PERMANENTLY
      );

      if (choice === ALWAYS_DELETE_PERMANENTLY) {
        await configuration.setUseTrash(false);
        await vscode.workspace.fs.delete(uri, { recursive, useTrash: false });
        return true;
      }

      if (choice === DELETE_PERMANENTLY) {
        await vscode.workspace.fs.delete(uri, { recursive, useTrash: false });
        return true;
      }

      return false;
    }

    throw error;
  }
}

module.exports = {
  exists,
  remove,
};
