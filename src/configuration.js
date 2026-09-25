// @ts-nocheck
// eslint-disable-next-line node/no-missing-require, import/no-unresolved
const vscode = require("vscode");
const util = require("./util");

const configName = "filebunny";

function getExcludes() {
  let config = vscode.workspace.getConfiguration(configName);
  return config.get("excludes");
}

function getAbsoluteExcludes(root) {
  let config = vscode.workspace.getConfiguration(configName);
  let excludes = config.get("excludes");

  let escapedRoot = util.escapePath(root);
  let absoluteExcludes = excludes.map((item) => `${escapedRoot}/${item}`);
  return absoluteExcludes;
}

function getStartingLocationOpenFolder() {
  let config = vscode.workspace.getConfiguration(configName);
  return config.get("startingLocationOpenFolder");
}

function getTemplateDefaultFolder() {
  let config = vscode.workspace.getConfiguration(configName);
  return config.get("templateDefaultFolder");
}

function getUseTrash() {
  let config = vscode.workspace.getConfiguration(configName);
  return config.get("useTrash");
}

async function setUseTrash(value) {
  let config = vscode.workspace.getConfiguration(configName);
  await config.update("useTrash", value, vscode.ConfigurationTarget.Global);
}

module.exports = {
  getExcludes,
  getAbsoluteExcludes,
  getStartingLocationOpenFolder,
  getTemplateDefaultFolder,
  getUseTrash,
  setUseTrash,
};
