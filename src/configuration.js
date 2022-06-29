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
  let absoluteExcludes = excludes.map((item) => {
    return `${escapedRoot}/${item}`;
  });
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

module.exports = {
  getExcludes,
  getAbsoluteExcludes,
  getStartingLocationOpenFolder,
  getTemplateDefaultFolder,
};
