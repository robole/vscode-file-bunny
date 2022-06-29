// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const vscode = require("vscode");
const assert = require("assert");

describe("extension", () => {
  const extensionShortName = "file-bunny";
  const extensionID = `robole.${extensionShortName}`;

  let extension;

  before(() => {
    extension = vscode.extensions.getExtension(extensionID);
  });

  it("All commands in the package.json should be registered in extension", (done) => {
    const packageCommands = extension.packageJSON.contributes.commands.map(
      (c) => c.command
    );

    // get all extension commands excluding internal commands.
    vscode.commands.getCommands(true).then((allCommands) => {
      const activeCommands = allCommands.filter((c) =>
        c.startsWith(`${extensionShortName}.`)
      );

      activeCommands.forEach((command) => {
        const result = packageCommands.some((c) => c === command);
        assert.ok(result);
      });

      done();
    });
  });
});
