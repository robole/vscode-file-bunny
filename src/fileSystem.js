// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");

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

module.exports = {
  exists,
};
