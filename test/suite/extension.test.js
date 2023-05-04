// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const assert = require("assert");

describe("extension", () => {
  const extensionShortName = "file-bunny";
  const publisherName = "robole";
  const extensionID = `${publisherName}.${extensionShortName}`;

  let extension;

  before(() => {
    extension = vscode.extensions.getExtension(extensionID);
  });

  it("should activate the extension on startup", async () => {
    // we delay 1 second to give the extension time to load
    setTimeout(async () => {
      assert.strictEqual(extension.isActive, true);
    });
  });

  it("should register all package.json commands in the extension", async () => {
    // we delay 1 second to give the extension time to load
    setTimeout(async () => {
      // get active commands for this extension
      const allCommands = await vscode.commands.getCommands(true);
      const extensionActiveCommands = allCommands.filter((c) =>
        c.startsWith(`${extensionShortName}.`)
      );

      // commands declared in package.json
      const packageCommands = extension.packageJSON.contributes.commands.map(
        (c) => c.command
      );

      packageCommands.forEach((command) => {
        const result = extensionActiveCommands.some((c) => c === command);
        assert.strictEqual(
          result,
          true,
          `${command} command is in package.json but not registered in extension.`
        );
      });
    }, 1000);
  });
});
