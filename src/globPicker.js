// @ts-nocheck
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const nodePath = require("path");
const glob = require("glob");
const fs = require("fs").promises;
const util = require("./util");
const FileType = require("./fileType");
const FileItem = require("./fileItem");
const FileRetrievalOptions = require("./fileRetrievalOptions");

const currentFolderName = ".";
const currentFolderDescription = "This Folder";

async function getFilesAsPickerItems(filepath, options) {
  let escapedFilePath = util.escapePath(filepath);
  let globOptions = createGlobOptions(escapedFilePath, options);

  if (globOptions.showFiles === false && globOptions.showFolders === false) {
    return new Promise((resolve, reject) => {
      reject(
        new Error(
          "No results to return. You specified showFiles:false and showFolders:false."
        )
      );
    });
  }

  let matches = await getFiles(globOptions);
  let root = util.isRootFolder(filepath);

  let promisedItems = matches.map(async (file) => {
    let fileType;
    let stat;

    try{
      stat = await fs.stat(file);
    }
    catch(err){
      // dont want to print, if file is locked is common exception on windows
    }
    
    if (stat && stat.isSymbolicLink()) {
      // no way to tell if link points to folder/file
      fileType = FileType.SymbolicLinkFolder;
    } else if (stat && stat.isDirectory()) {
      fileType = FileType.Folder;
    } else if(stat){
      fileType = FileType.File;
    }
    else{
      // this is usaully a case where a file is locked
      fileType = FileType.Folder;
    }

    let name = nodePath.basename(file);
    let description = "";

    let regex = new RegExp(`${escapedFilePath}/{0,1}$`);

    // top level folder for this path
    if (
      (root === false && regex.test(file)) ||
      (root === true && (file === "/" || /\w:\/$/.test(file)))
    ) {
      name = currentFolderName;
      description = currentFolderDescription;
    }

    let item = new FileItem(name, file, fileType, "", description);
    return item;
  });

  return Promise.all(promisedItems);
}

async function getFilesRecursivelyAsPickerItems(filepath, options) {
  let escapedFilePath = util.escapePath(filepath);
  let globOptions = createRecursiveGlobOptions(escapedFilePath, options);

  if (globOptions.showFiles === false && globOptions.showFolders === false) {
    return new Promise((resolve, reject) => {
      reject(
        new Error(
          "No results to return. You specified showFiles:false and showFolders:false."
        )
      );
    });
  }

  let matches = await getFiles(globOptions);

  let promisedItems = matches.map(async (file) => {
    let fileType;
    let stat = await fs.stat(file);

    if (stat.isSymbolicLink()) {
      // no way to tell if link points to folder/file
      fileType = FileType.SymbolicLinkFolder;
    } else if (stat.isDirectory()) {
      fileType = FileType.Folder;
    } else {
      fileType = FileType.File;
    }

    let workspaceRoot;
    let name = nodePath.basename(file);

    if (vscode.workspace.workspaceFolders) {
      workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
      name = nodePath.relative(workspaceRoot, file);
    }

    let description = "";
    let regex = new RegExp(`${escapedFilePath}/{0,1}$`);

    // top level folder
    if (regex.test(file)) {
      name = currentFolderName;
      description = globOptions.topFolderDescription;
    }

    let item = new FileItem(name, file, fileType, "", description);

    return item;
  });

  return Promise.all(promisedItems);
}

async function getFiles(globOptions) {
  let result = await new Promise((resolve, reject) => {
    glob(
      globOptions.pattern,
      {
        ignore: globOptions.excludes,
        mark: globOptions.mark,
        dot: true,
      },
      (err, matches) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      }
    );
  });
  return result;
}

function setGlobOptionsDefaults(options) {
  let { showFiles } = options;
  if (options.showFiles === undefined) {
    showFiles = FileRetrievalOptions.showFiles;
  }

  let { showFolders } = options;
  if (options.showFolders === undefined) {
    showFolders = FileRetrievalOptions.showFolders;
  }

  let { excludes } = options;
  if (options.excludes === undefined) {
    excludes = [];
  }

  let { includeTopFolder } = options;
  if (options.excludes === undefined) {
    includeTopFolder = false;
  }

  let { topFolderDescription } = options;
  if (options.topFolderDescription === undefined) {
    topFolderDescription = currentFolderDescription;
  }

  let globOptions = {
    showFolders,
    showFiles,
    excludes,
    includeTopFolder,
    topFolderDescription,
  };
  globOptions.mark = false;
  return globOptions;
}

function createGlobOptions(filepath, options) {
  let defaultOptions = setGlobOptionsDefaults(options);
  let globOptions = defaultOptions;

  if(process.platform === 'win32' && util.isRootFolder(filepath)){
    filepath = ""; // node glob will not recognise C:
  }

  if (
    defaultOptions.showFiles === true &&
    defaultOptions.showFolders === false
  ) {
    globOptions.pattern = `${filepath}/*`;
    globOptions.mark = true;
    globOptions.excludes.push(`${filepath}/*/`);
  } else if (
    defaultOptions.showFiles === false &&
    defaultOptions.showFolders === true
  ) {
    globOptions.pattern = `${filepath}{/,/*/}`;
  } else if (
    defaultOptions.showFiles === true &&
    defaultOptions.showFolders === true
  ) {
    globOptions.pattern = `${filepath}{/,/*}`;
  }

  if (defaultOptions.includeTopFolder === false) {
    globOptions.excludes.push(`${filepath}/`);
  }

  return globOptions;
}

function createRecursiveGlobOptions(filepath, options) {
  let defaultOptions = setGlobOptionsDefaults(options);
  let globOptions = defaultOptions;

  if (
    defaultOptions.showFiles === true &&
    defaultOptions.showFolders === false
  ) {
    globOptions.pattern = `${filepath}/**`;
    globOptions.mark = true;
    globOptions.excludes.push(`${filepath}/**/*/`);
    defaultOptions.includeTopFolder = false;
  } else if (
    defaultOptions.showFiles === false &&
    defaultOptions.showFolders === true
  ) {
    globOptions.pattern = `${filepath}/**/`;
  } else if (
    defaultOptions.showFiles === true &&
    defaultOptions.showFolders === true
  ) {
    globOptions.pattern = `${filepath}/**`;
  }

  if (
    defaultOptions.includeTopFolder === undefined ||
    defaultOptions.includeTopFolder === false
  ) {
    globOptions.excludes.push(`${filepath}/`);
  }

  return globOptions;
}

module.exports = {
  currentFolderName,
  currentFolderDescription,
  getFilesAsPickerItems,
  getFilesRecursivelyAsPickerItems,
};
