const FileType = require("./fileType");

class FileItem {
  constructor(name, path, fileType, detail = "", description = "") {
    this.name = name;
    this.path = path;
    this.fileType = fileType;
    this.alwaysShow = true;
    this.detail = detail;
    this.description = description;
    this.setLabelWithName();
  }

  setLabelWithName() {
    switch (this.fileType) {
      case FileType.Folder:
        this.label = `$(folder) ${this.name}`;
        break;
      case FileType.SymbolicLinkFolder:
        this.label = `$(file-symlink-directory) ${this.name}`;
        break;
      case FileType.SymbolicLinkFile:
        this.label = `$(file-symlink-file) ${this.name}`;
        break;
      default:
        this.label = `$(file) ${this.name}`;
        break;
    }
  }

  equals(otherItem) {
    if (this.path === otherItem.path) {
      return true;
    }

    return false;
  }
}

module.exports = FileItem;
