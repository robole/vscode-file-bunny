// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
let assert = require("assert");
const path = require("path");
const fileSystem = require("../../src/fileSystem");

describe("fileSystem", function () {
  describe("exists()", () => {
    let testFile = path.join(__dirname, "..", "..", "test", "test.md");
    let testFileUri = vscode.Uri.file(testFile);

    it("should return a boolean to indicate if a file exists", async () => {
      let fileCheck1 = await fileSystem.exists(testFileUri);
      assert.strictEqual(fileCheck1, true, "Test File was not found");

      let nonexistentFile = vscode.Uri.file(
        path.join(__dirname, "..", "..", "test", "dummy.txt")
      );

      let fileCheck2 = await fileSystem.exists(nonexistentFile);
      assert.strictEqual(
        fileCheck2,
        false,
        "Nonexistent File reported as existing."
      );

      let nonexistentFolder = vscode.Uri.file(
        path.join(__dirname, "..", "..", "test", "dummy")
      );

      let fileCheck3 = await fileSystem.exists(nonexistentFolder);
      assert.strictEqual(
        fileCheck3,
        false,
        "Nonexistent folder reported as existing."
      );
    });
  });
});
