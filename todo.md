<!-- markdownlint-disable-file -->
# To Do

This is the list of commands and keybindings for related bits:

- [file management](https://code.visualstudio.com/docs/getstarted/keybindings#_file-management).
- [navigation](https://code.visualstudio.com/docs/getstarted/keybindings#_navigation)

- USE *robabc* as PUBLISHER when providing new version of premium edition.

## Tasks

1. Add recent items to top of file list.
1. Publish under `robabc` to give customers access to v1?
1. Add more tests?
1. broot-like commands available on files. Could use `Terminal.sendText`? See https://code.visualstudio.com/api/references/vscode-api#Terminal
1. Use caching to get last location used, rather than using default location configuration option? Review config items related to this.
1. `File Bunny: Copy Active File as Base64`
1. `File Bunny: Open Folder As Template` or `File Bunny: Create New Project from Template`
1. Add multi-root workspace support.

## Long-standing Issues

- [ ] Cannot delete active file if it is image. No way to reference active editor. Awaiting change from this [open issue](https://github.com/microsoft/vscode/issues/15178).

## Further ideas

1. Navigate to your home folder by typing ~ into the search box, or step up to the parent folder by typing ..
1. Quickly toggle excluded files?
1. Peek files like <https://github.com/abierbaum/vscode-file-peek>
1. Batch actions required?
1. Allow automatic creation of a folder?
1. Use brace expansion <https://www.npmjs.com/package/brace-expansion> ?

## Performance

- Only async methods are used for IO operations. These are [2.3X faster than their sync counterparts](https://jinoantony.com/blog/async-vs-sync-nodejs-a-simple-benchmark).
- Use caching for calls for Browser's reading of folder.
- [Modern mode](https://github.com/nodelib/nodelib/blob/master/packages/fs/fs.scandir/README.md#old-and-modern-mode) is used when reading directories, which is 2X faster. The `stats` option is disabled. An additional call for symbolic links (`fs.stat`) is still present.
