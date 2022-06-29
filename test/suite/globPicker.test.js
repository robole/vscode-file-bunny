let assert = require("assert");
const path = require("path");
const globPicker = require("../../src/globPicker");
const FileType = require("../../src/fileType");

describe("globPicker", function () {
  describe("getFilesRecursivelyAsPickerItems()", () => {
    let projectRoot = path.join(__dirname, "..", "..");

    it("should return only subfolders for a filepath when options.showFolders is true and options.showFiles is false", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: false,
          showFolders: true,
          excludes: [
            `${projectRoot}/**/.git/**`,
            `${projectRoot}/**/node_modules/**`,
          ],
        }
      );

      assert.strictEqual(
        files.length > 0,
        true,
        "Folders only not working. Zero files returned."
      );

      let anyFiles = false;
      files.forEach((file) => {
        if (
          file.fileType === FileType.File ||
          file.fileType === FileType.SymbolicLinkFile
        ) {
          anyFiles = true;
        }
      });

      assert.strictEqual(
        anyFiles,
        false,
        "Folders only not working. Contains file."
      );
    });

    it("should exclude folders based on the patterns provided in options.excludes for a filepath", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: false,
          showFolders: true,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        }
      );

      assert.strictEqual(
        files.length > 2,
        true,
        "Folders excludes not working. Zero folders returned."
      );

      let nodeModules = false;
      files.forEach((file) => {
        if (file.name === "node_modules") {
          nodeModules = true;
        }
      });

      assert.strictEqual(nodeModules, false, "Folders excludes not working.");
    });

    it("should return folders that begin with a dot for a filepath", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: false,
          showFolders: true,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        }
      );

      let anyDotFolders = false;

      files.forEach((file) => {
        if (file.name.startsWith(".")) {
          anyDotFolders = true;
        }
      });

      assert.strictEqual(anyDotFolders, true, "Dot Folders not working.");
    });

    it("should return only files for a filepath when options.showFiles is true and options.showFolders is false", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: true,
          showFolders: false,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        }
      );

      assert.strictEqual(
        files.length > 20,
        true,
        "Files only not working. < 20 files returned."
      );

      let anyFolders = false;
      files.forEach((file) => {
        if (
          file.fileType === FileType.Folder ||
          file.fileType === FileType.SymbolicLinkFolder
        ) {
          anyFolders = true;
        }
      });

      assert.strictEqual(
        anyFolders,
        false,
        "Files only not working. Contains folder."
      );
    });

    it("should exclude files based on the patterns provided in options.excludes for a filepath", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: true,
          showFolders: false,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
            `${projectRoot}/**/*.js`,
          ],
        }
      );

      assert.strictEqual(
        files.length > 0,
        true,
        "Files excludes not working. Zero files returned."
      );

      let anyJsFiles = false;
      files.forEach((file) => {
        if (file.name.endsWith(".js")) {
          anyJsFiles = true;
        }
      });

      assert.strictEqual(anyJsFiles, false, "Files excludes not working.");
    });

    it("should return files that begin with a dot for a filepath", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: true,
          showFolders: false,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        }
      );

      let anyDotFiles = false;

      files.forEach((file) => {
        if (file.name.startsWith(".")) {
          anyDotFiles = true;
        }
      });

      assert.strictEqual(anyDotFiles, true, "Dot Files not working.");
    });

    it("should return an error when options.showFiles is false and options.showFolders is false", async () => {
      try {
        await globPicker.getFilesRecursivelyAsPickerItems(projectRoot, {
          showFiles: false,
          showFolders: false,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        });
        assert.fail();
      } catch (err) {
        assert.ok(true, "Error was thrown");
      }
    });

    it("should return the top folder (folder of path provided) when options.includeTopFolder is true and showFolders is true", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: false,
          showFolders: true,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
          includeTopFolder: true,
        }
      );

      let included = false;

      files.forEach((file) => {
        if (file.name === globPicker.currentFolderName) {
          included = true;
        }
      });

      assert.strictEqual(
        included,
        true,
        "includeTopFolder not working when options.includeTopFolder is true and showFolders is true."
      );
    });

    it("should return the top folder (folder of path provided) when options.includeTopFolder:true and showFolders is true and showFiles is true ", async () => {
      let files = await globPicker.getFilesRecursivelyAsPickerItems(
        projectRoot,
        {
          showFiles: true,
          showFolders: true,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
          includeTopFolder: true,
        }
      );

      let included = false;

      files.forEach((file) => {
        if (file.name === globPicker.currentFolderName) {
          included = true;
        }
      });

      assert.strictEqual(included, true);
    });
  });

  describe("getFilesAsPickerItems()", () => {
    let projectRoot = path.join(__dirname, "..", "..");

    it("should return only folders for a filepath when options.showFolders is true and options.showFiles is false X", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/.git/**`,
          `${projectRoot}/**/node_modules/**`,
        ],
      });

      assert.strictEqual(
        files.length > 0,
        true,
        "Folders only not working. Zero files returned."
      );

      let anyFiles = false;
      files.forEach((file) => {
        if (
          file.fileType === FileType.File ||
          file.fileType === FileType.SymbolicLinkFile
        ) {
          anyFiles = true;
        }
      });

      assert.strictEqual(
        anyFiles,
        false,
        "Folders only not working. Contains file."
      );
    });

    it("should exclude folders based on the patterns provided in options.excludes for a filepath", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
      });

      assert.strictEqual(
        files.length > 2,
        true,
        "Folders excludes not working. Zero folders returned."
      );

      let nodeModules = false;
      files.forEach((file) => {
        if (file.name === "node_modules") {
          nodeModules = true;
        }
      });

      assert.strictEqual(nodeModules, false, "Folders excludes not working.");
    });

    it("should return folders that begin with a dot for a filepath", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
      });

      let anyDotFolders = false;

      files.forEach((file) => {
        if (file.name.startsWith(".")) {
          anyDotFolders = true;
        }
      });

      assert.strictEqual(anyDotFolders, true, "Dot Folders not working.");
    });

    it("should return only files for a filepath when options.showFiles is true and options.showFolders is false", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: true,
        showFolders: false,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
      });

      assert.strictEqual(
        files.length > 2,
        true,
        "Files only not working. < 2 files returned."
      );

      let anyFolders = false;
      files.forEach((file) => {
        if (
          file.fileType === FileType.Folder ||
          file.fileType === FileType.SymbolicLinkFolder
        ) {
          anyFolders = true;
        }
      });

      assert.strictEqual(
        anyFolders,
        false,
        "Files only not working. Contains folder."
      );
    });

    it("should exclude files based on the patterns provided in options.excludes for a filepath", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: true,
        showFolders: false,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
          `${projectRoot}/**/*.md`,
        ],
      });

      assert.strictEqual(
        files.length > 0,
        true,
        "Files excludes not working. Zero files returned."
      );

      let anyMarkdownFiles = false;
      files.forEach((file) => {
        if (file.name.endsWith(".md")) {
          anyMarkdownFiles = true;
        }
      });

      assert.strictEqual(
        anyMarkdownFiles,
        false,
        "Files excludes not working."
      );
    });

    it("should return files that begin with a dot for a filepath", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: true,
        showFolders: false,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
      });

      let anyDotFiles = false;

      files.forEach((file) => {
        if (file.name.startsWith(".")) {
          anyDotFiles = true;
        }
      });

      assert.strictEqual(anyDotFiles, true, "Dot Files not working.");
    });

    it("should return an error when options.showFiles is false and options.showFolders is false", async () => {
      try {
        await globPicker.getFilesAsPickerItems(projectRoot, {
          showFiles: false,
          showFolders: false,
          excludes: [
            `${projectRoot}/**/node_modules/**`,
            `${projectRoot}/**/.git/**`,
          ],
        });
        assert.fail();
      } catch (err) {
        assert.ok(true, "Error was thrown");
      }
    });

    it("should return the top folder (folder of path provided) when options.includeTopFolder is true and showFolders is true", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
        includeTopFolder: true,
      });

      let included = false;

      files.forEach((file) => {
        let fullPath = `${projectRoot}${path.sep}`;
        if (file.name === globPicker.currentFolderName) {
          included = true;
        }
      });

      assert.strictEqual(included, true, "includeTopFolder not working.");
    });

    it("should not return the top folder (folder of path provided) when options.includeTopFolder is false and showFolders: true", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
        includeTopFolder: false,
      });

      let included = false;

      files.forEach((file) => {
        let fullPath = `${projectRoot}${path.sep}`;
        if (file.path === fullPath) {
          included = true;
        }
      });

      assert.strictEqual(included, false, "includeTopFolder not working.");
    });

    it("should return the top folder (folder of path provided) when options.includeTopFolder:true and showFolders: true and showFiles:true ", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: true,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
        includeTopFolder: true,
      });

      let included = false;

      files.forEach((file) => {
        if (file.name === globPicker.currentFolderName) {
          included = true;
        }
      });

      assert.strictEqual(included, true, "includeTopFolder not working.");
    });

    it("should not return the top folder (folder of path provided) when options.includeTopFolder:false and showFolders: true and showFiles:true ", async () => {
      let files = await globPicker.getFilesAsPickerItems(projectRoot, {
        showFiles: true,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
        includeTopFolder: false,
      });

      let included = false;

      files.forEach((file) => {
        if (file.name === globPicker.currentFolderName) {
          included = true;
        }
      });

      assert.strictEqual(included, false, "includeTopFolder not working.");
    });

    it("should return the files for the root folder ", async () => {
      let root ="/";

      if(process.platform === 'win32'){
        root = "C:\\";
      }
      
      let files = await globPicker.getFilesAsPickerItems(root, {
        showFiles: false,
        showFolders: true,
        excludes: [
          `${projectRoot}/**/node_modules/**`,
          `${projectRoot}/**/.git/**`,
        ],
        includeTopFolder: true,
      });

      assert.strictEqual(files.length > 1, true);
    });
    
  });
});
