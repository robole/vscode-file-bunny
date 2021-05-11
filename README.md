<h1 align="center">
  <br>
    <img align="center" src="img/logo.png" width="200">
  <br>
	<br>
  File Bunny
  <br>
  <br>
</h1>
<h4 align="center">Perform file actions quickly with keyboard-driven file selection. 🐰⌨️</h4>

<p align="center">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=made%20for&message=VS%20Code&color=0000ff" alt="Made for VSCode">
<img src="https://img.shields.io/visual-studio-marketplace/v/robole.file-bunny?logo=visual-studio-code&color=ffa500" alt="Visual Studio Marketplace Version">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=size&message=50KB&color=008000"
alt="Extension file size in bytes">
<img src="https://img.shields.io/visual-studio-marketplace/r/robole.file-bunny?logo=visual-studio-code&color=yellow" alt="Visual Studio Marketplace Rating">
<img src="https://img.shields.io/static/v1?label=built%20with&message=carrot%20juice%20%26%20javascript&color=orange" alt="Built with carrot juice and javascript"/>
<a href="https://ko-fi.com/roboleary"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-$4-orange?logo=buy-me-a-coffee" alt="Buy me a coffee"></a>
</p>

No need to *hop* to the Sidebar to work with files. 😜

## Consolidated lists for quick file selection

For some file actions, we can consolidate the list of files into a single list for quick selection.

Take the command, `File Bunny: Move Active File`. A QuickPick dialog lets you choose a destination from all folders (and subfolders) in your workspace.

![move active file demo](img/move-file.gif)

The list is narrowed down to matched selections as you type, the same as the Command Palette.

You can exclude folders from the list with the `excludes` settings option to keep the list concise.

## Incremental completion to find files quickly

Incremental completion builds a filepath quickly. This is achieved through a QuickPick dialog populated with a file list, and tabbed autocompletion to append each segment.

Take the command, `File Bunny: Open a Folder`.

![open folder demo](img/open-folder.gif)

In this example, I do the following to open my *Beer Advisor* project:

1. Type "and", which highlights  the *Android* folder as the first option. Press <kbd>Tab</kbd> to select it.
2. Type "beer", which highlights the *beer-advisor* folder as the first option. Press <kbd>Tab</kbd> to select it.
3. Accept the current directory (first option) by pressing <kbd>Enter</kbd> to open it.

This process of building paths is quick and mitigates errors drastically. You cannot create an incorrect path.

You can also walk the file system with the arrow keys. Use the left arrow to go back, and right arrow to go forward through the file system if you need to search.

## Actions on the active file

Quite often, you want to do something to a file you're already working on. Why re-find the file in the sidebar to perform an action?

![delete active file demo](img/delete-file.gif)

For example, the command  `File Bunny: Delete Active File` will immediately delete the active file (it ends up in the trash).

After the file is deleted, focus is switched to the next open file. This way you can carry on editing without needing to switch view to return to an active state. Other extensions don't do this!

## Destructive actions are safe

If you delete a file, it is sent to the trash (recycle bin).

If you create, move, or duplicate a file, overwriting another file or folder is not possible.

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`):

1. `File Bunny: Create New File`: Create a new file in the current workspace.
1. `File Bunny: Move Active File`: Move the active file to another location in the current workspace.
1. `File Bunny: Duplicate Active File`: Copy the active file and place it somewhere in the current workspace.
1. `File Bunny: Rename Active File`
1. `File Bunny: Delete Active File`: Delete the active file. The file is put into the trash (recycle bin).
1. `File Bunny: Open Folder`: Choose a folder to open as the workspace.
1. `File Bunny: Open Workspace Folder Externally`: Open the current workspace folder in the Operating S file explorer.
1. `File Bunny: Go to Top of Active File`: The `Home` key is bound to this command also.
1. `File Bunny: Go to End of Active File`: The `End` key is bound to this command also.
1. `File Bunny: Copy File Name`: Copy the file name of the active file to the clipboard.
1. `File Bunny: Copy Relative Path`: Copy the relative file path of the active file to the clipboard.
1. `File Bunny: Copy Absolute Path`: Copy the absolute file path of the active file to the clipboard.

The <strong><a href="https://ko-fi.com/s/17e88aa21f">premium version</a></strong> can be purchased from my store, and has the following additional commands:

1. `File Bunny: Open File in External App`: Choose a file to open from the current workspace in the default app.
1. `File Bunny: Open File`: Choose a file to open from the current workspace.
1. `File Bunny: Open File to the Right`: Choose a file to open from the current workspace, and split it to the right of the active editor.
1. `File Bunny: Open File to the Left`: Choose a file to open from the current workspace, and split it to the left of the active editor.
1. `File Bunny: Open File Above`: Choose a file to open from the current workspace, and split it above the active editor.
1. `File Bunny: Open File Below`: Choose a file to open from the current workspace, and split it below the active editor.
1. `File Bunny: Open Folder Externally`: Open a folder from the current workspace in the OS explorer.
1. `File Bunny: Create New Folder`: Create a new folder in the current workspace.
1. `File Bunny: Duplicate Folder`: Duplicate a folder from the current workspace, and place it somewhere in the current workspace.
1. `File Bunny: Delete Folder`: Delete a folder from the current workspace.

## Settings

- `Filebunny: Excludes`: Configure glob patterns for excluding files and folders from file lists for commands.

## Activation

The extension is loaded once VS Code has fully loaded. To be more specific, it is triggered by the `onStartupFinished` [activation event](https://code.visualstudio.com/api/references/activation-events).

## Installation

1. The extension is listed in the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=robole.file-bunny) and [Open VSX Marketplace](https://open-vsx.org/extension/robole/file-bunny) where you can download or install it directly.
1. Inside VS Code: Type `Ctrl+P`, write `ext install robole.file-bunny` in the text field, and hit `Enter`.
1. From the Command-line: Run the command `code --install-extension robole.file-bunny`.

## Contribute

If you have a suggestion or find a bug, please file an issue.

## Show gratitude

If you are happy with the extension, please star the repo, and leave a review to help others find it. 🌟

You can purchase the <strong><a href="https://ko-fi.com/s/17e88aa21f">premium version</a></strong> from my store.
