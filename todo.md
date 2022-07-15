# To Do

## Tasks

1. Have a git files (`git ls-files`) version of `File Bunny: Open File`
1. Add recent items to top of file list for `File Bunny: Open Folder`.
1. Add more tests (refactor).
1. `File Bunny: New Project from Template`
1. Add multi-root workspace support?

## Long-standing API issues

- Cannot delete active file if it is image. No way to reference active editor. Awaiting change from this [open issue](https://github.com/microsoft/vscode/issues/15178).
- There is an [open issue for adding support for file icons to the QuickPick API](https://github.com/microsoft/vscode/issues/59826).

## Further ideas

1. Use different fuzzy search algo.
1. broot-like commands available on files. Could use `Terminal.sendText`? See <https://code.visualstudio.com/api/references/vscode-api#Terminal>
1. Navigate to your home folder by typing ~ into the search box, or step up to the parent folder by typing ..
1. Quickly toggle excluded files?
1. Peek files like <https://github.com/abierbaum/vscode-file-peek>
1. Batch actions required?
1. Allow automatic creation of a folder?
1. Use brace expansion <https://www.npmjs.com/package/brace-expansion> ?
1. `File Bunny: Copy Active File as Base64`

## Performance

- Only async methods are used for IO operations. These are [2.3X faster than their sync counterparts](https://jinoantony.com/blog/async-vs-sync-nodejs-a-simple-benchmark). ✅
- Use caching for calls for Browser's reading of folder.
- [Modern mode](https://github.com/nodelib/nodelib/blob/master/packages/fs/fs.scandir/README.md#old-and-modern-mode) is used when reading directories, which is 2X faster. The `stats` option is disabled. An additional call for symbolic links (`fs.stat`) is still present.
