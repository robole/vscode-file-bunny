// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const path = require("path");

const FileType = {
  Folder: "Folder",
  SymbolicLinkFolder: "SymbolicLinkFolder",
  File: "File",
  SymbolicLinkFile: "SymbolicLinkFile",
};

module.exports = FileType;
