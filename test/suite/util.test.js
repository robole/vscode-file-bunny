// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
let assert = require("assert");
const util = require("../../src/util");

describe("util", () => {
  describe("escapePath()", () => {
    it("should return escaped path", () => {
      const expected = "C:/Program Files \\(x86\\)";

      const actual = util.escapePath("C:\\Program Files (x86)");

      assert.strictEqual(actual, expected);
    });
  });

  describe("isRootFolder()", () => {
    it("should return true if the folder has no parent folder in Windows", () => {
      if (process.platform === "win32") {
        const winRoot = util.isRootFolder("C:\\");
        assert.strictEqual(winRoot, true);
      }
    });

    it("should return true if the folder is C:/ in Windows", () => {
      if (process.platform === "win32") {
        const winRoot = util.isRootFolder("C:/");
        assert.strictEqual(winRoot, true);
      }
    });

    it("should return true if the folder has no parent folder in Linux", () => {
      if (process.platform !== "win32") {
        const linuxRoot = util.isRootFolder("/");
        assert.strictEqual(linuxRoot, true);
      }
    });

    it("should return false if the folder has no parent folder in Windows", () => {
      if (process.platform === "win32") {
        const winNotRoot = util.isRootFolder("C:\\Program Files (x86)");
        assert.strictEqual(winNotRoot, false);
      }
    });

    it("should return false if the folder has no parent folder in Linux", () => {
      if (process.platform !== "win32") {
        const linuxNotRoot = util.isRootFolder("/home");
        assert.strictEqual(linuxNotRoot, false);
      }
    });
  });

  describe("createUniqueFileName()", () => {
    it("should return an unique enumerated file name", () => {
      assert.strictEqual(
        util.createUniqueFileName("checkInput.ts", 2),
        "checkInput(2).ts",
        "Does not contain versioned number already"
      );

      assert.strictEqual(
        util.createUniqueFileName("checkInput(3).ts", 1),
        "checkInput(4).ts",
        "Contains versioned number already"
      );

      assert.strictEqual(
        util.createUniqueFileName("checkInput", 1),
        "checkInput(1)",
        "No extension and does not contain versioned number already"
      );

      assert.strictEqual(
        util.createUniqueFileName("check(8)Input", 2),
        "check(8)Input(2)",
        "No extension, has another bracketed number set in text, and contains versioned number already"
      );

      assert.strictEqual(
        util.createUniqueFileName("/home/check.test.js", 1),
        "/home/check.test(1).js",
        "Create"
      );
    });
  });
});
