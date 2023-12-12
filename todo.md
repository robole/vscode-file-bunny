# To Do

## Tasks

1. Have a git files (`git ls-files`) version of `File Bunny: Open File`. See branch *open-gitfiles*.
1. Add recent items to top of file list for `File Bunny: Open Folder`.
1. Add more tests (refactor).
1. `File Bunny: New Project from Template`?
1. Add multi-root workspace support?
1. `File Bunny: Move Active File`, `File Bunny: Duplicate Active File`,  and `File Bunny: Delete File` perform no action when a workspace is not open because it is too slow to index all folders of system. It'd be better to have the dialog version of file picker for this.

## Further ideas

1. `File Bunny: Copy Active File as Encoded Data URI` : Similar to https://yoksel.github.io/url-encoder/ . Copy the content of the file as an encoded [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme). This is helpful when you want to use a SVG in CSS.  See [StackOverflow Q](https://stackoverflow.com/questions/19255296/is-there-a-way-to-use-svg-as-content-in-a-pseudo-element-before-or-after).
1. Use different fuzzy search algo?
1. broot-like commands available on files. Could use `Terminal.sendText`? See <https://code.visualstudio.com/api/references/vscode-api#Terminal>
1. Navigate to your home folder by typing ~ into the search box, or step up to the parent folder by typing ..
1. Quickly toggle excluded files?
1. Peek files like <https://github.com/abierbaum/vscode-file-peek>
1. Batch actions required?
1. Allow automatic creation of a folder?
1. Use brace expansion <https://www.npmjs.com/package/brace-expansion> ?

## Performance improvements

- Only async methods are used for IO operations. These are [2.3X faster than their sync counterparts](https://jinoantony.com/blog/async-vs-sync-nodejs-a-simple-benchmark). ✅
- Use caching for calls for Browser's reading of folder.
- [Modern mode](https://github.com/nodelib/nodelib/blob/master/packages/fs/fs.scandir/README.md#old-and-modern-mode) is used when reading directories, which is 2X faster. The `stats` option is disabled. An additional call for symbolic links (`fs.stat`) is still present.
