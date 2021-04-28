
<h1 align="center">
  <br>
    <img align="center" src="img/logo.png" width="200">
  <br>
	<br>
  File Bunny
  <br>
  <br>
</h1>
<h4 align="center">Perform file operations in a hop and a pick. 🐰⌨️</h4>

<p align="center">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=made%20for&message=VS%20Code&color=0000ff" alt="Made for VSCode">
<img src="https://img.shields.io/visual-studio-marketplace/v/robole.file-bunny?logo=visual-studio-code&color=ffa500" alt="Visual Studio Marketplace Version">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=size&message=38KB&color=008000"
alt="Extension file size in bytes">
<img src="https://img.shields.io/visual-studio-marketplace/r/robole.file-bunny?logo=visual-studio-code&color=yellow" alt="Visual Studio Marketplace Rating">
<img src="https://img.shields.io/static/v1?label=built%20with&message=carrot%20juice%20%26%20javascript&color=orange" alt="Built with carrot juice and javascript"/>
<a href="https://www.buymeacoffee.com/robole"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-$4-orange?logo=buy-me-a-coffee" alt="Buy me a coffee"></a>
</p>

Perform file operations quickly with keyboard driven file selection, and contextually-intelligent commands. No need to jump to the sidebar to move or a delete a file.

## Consolidated lists for quick file selection

For some actions, we can consolidate the list of files into a single list for quick selection. For example, to **move a  file**, a QuickPick dialog lets you choose from all folders (and subfolders) in your workspace.

![move active file demo](img/move-file.gif)

It narrows the list to matched selections as you type, the same as the Command Palette.

You can exclude folders from the list with the `excludes` settings option to keep the list lean.

## Incremental completion to find files quickly

Modal file dialogs suck! It would be more efficient to use the keyboard to find files directly. We can do this intelligently with incremental completion to build a filepath quickly.

This is achieved through a QuickPick dialog populated with the file list, and tabbed autocompletion to append each segment.

Take the command, **`File Bunny: Open a Folder`**.

![open folder demo](img/open-folder.gif)

In this example, I do the following to open my *Beer Advisor* project:

1. Type "and", which highlights  the *Android* folder as the first option. Press <kbd>Tab</kbd> to select it.
2. Type "beer", which highlights the *beer-advisor* folder as the first option. Press <kbd>Tab</kbd> to select it.
3. Accept the current directory (first option) by pressing <kbd>Enter</kbd> to open it.

This process of building paths is quick and mitigates errors drastically. You cannot create an incorrect path.

You can also walk the file system with the arrow keys. Use the left arrow to go back, and right arrow to go forward through the file system if you need to search.

## Actions on the active file

Quite often, you want to do something to a file you're already working on. Why re-find in the file explorer in the sidebar to perform an action?

![delete active file demo](img/delete-file.gif)

Just run a command such as `File Bunny: Delete active file` and poof! It's gone (well, in the trash to be technically correct).

After the file is deleted, focus is switched to the next open file. This way you can carry on editing without needing to switch view. Other extensions don't do this!

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`):

1. `File Bunny: Open Folder`: Open a folder as a project.
1. `File Bunny: Move the Active File`: Move the active file to another location in the current workspace.
1. `File Bunny: Delete the Active File`: Delete the active file. The file is put into the trash (recycle bin).

## Settings

- `Filebunny: Excludes`: Configure glob patterns for excluding files and folders when selecting files.

## Backlog (commands that I would like to add)

| #    | Action                                         | Desired Behaviour                                            | Functionality in VS Code                                     | Extensions that offer this functionality                     |
| ---- | ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Create a new file.                             | Choose a location for the file from a list of all the folders from the workspace, and as a second step, choose a file name. | The command `File: New File` creates an untitled file. You must save it to choose a location and name. This brings up a OS-specific File Dialog. | [advanced-new-file](https://marketplace.visualstudio.com/items?itemName=patbenatar.advanced-new-file). |
| 2    | Open a file from the workspace.                | I would like to choose a file from a complete list of files from the workspace. This is particularly useful when you are unfamilar with a project.<br><br>If a file is not supported by an editor in VS Code such as an **.ai** file, it would be opened externally in the default app e.g. open it in Adobe Illustrator. | The [Quick Open](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation) (<kbd>Ctrl</kbd>+ <kbd>P</kbd>) explorer allows you to search for a file to open. Initially, the list shows only opened files, why you want to see them, I don't know. As you type it will show you a list of matching files. | [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser). |
| 3    | Open a file from the workspace in external app | You may want to open a file in another application.          | No command.                                                  | -                                                            |
| 4    | Move the active file.                          | Be able to move the current file to another location in the workspace. I would like to be able to choose a location from a list of the folders in a QuickPick. | No command.                                                  | [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils). |
| 5    | Rename the active file.                        | Be able to rename the active file with an InputBox.          | No command.                                                  | [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils), [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser) allows you to choose a file to rename. |
| 6    | Duplicate the active file.                     | Duplicate the active file. I would like to be able to choose a location from a list of the folders in a QuickPick. Then, be able to name the file. | No command.                                                  | [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils). |
| 7    | Delete the active file.                        | Delete the active file. Put the file into the trash (recycle bin) by default. | No command.                                                  | [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils), [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser) allows you to choose a file to delete. |
| 8    | Open a folder.                                 | Choose from a QuickPick file explorer. Be able to navigate through the file system with the keyboard to choose a folder. | No command.                                                  | [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser) |
| 9    | Open a folder externally.                      | Open a folder outside of VS Code. You may want to open the project in the OS File Explorer. The default loction is the current workspace. | No command.                                                  | -                                                            |
| 10   | Create a folder                                | Create a new folder in the current workspace. Choose a location from a list of folders in a QuickPick. | No command.                                                  | You can do this with [advanced-new-file.](https://marketplace.visualstudio.com/items?itemName=patbenatar.advanced-new-file) if you add a slash to the end of the filename. |
| 11   | Duplicate a folder                             | Duplicate a folder. This would be convenient for using a project as template.<br><br>I Choose a location from a list of the folders in a QuickPick. Then, be able to name the file. | No command.                                                  | -                                                            |
| 12   | Rename a folder                                | Rename a folder in the current workspace. Choose a location from a list of folders in a QuickPick. | No command.                                                  |                                                              |
| 13   | Delete a folder                                | Delete a folder in the current workspace. Choose a location from a list of folders in a QuickPick. | No command                                                   | [File Browser](https://marketplace.visualstudio.com/items?itemName=bodil.file-browser) |
| 14   | Copy filename to clipboard                     | Copy filename of the active file to clipboard.               | No command.                                                  | [File Utils](https://marketplace.visualstudio.com/items?itemName=sleistner.vscode-fileutils). |
| 15   | Copy a file as base64                          | Copy contents of file encoded as base 64                     | No command.                                                  |                                                              |
| 16   | Go to top of active file                       | Jump to line 1 of active file. Can bind the action to <kbd>Home</kbd> button similar to behaviour in a web browser. | No command.                                                  |                                                              |
| 17   | Go to bottom of active file                    | Jump to last line of active file. Can bind the action to <kbd>End</kbd> button similar to behaviour in a web browser. | No command.                                                  |                                                              |

## Installation

1. Inside VS Code: Type `Ctrl+P`, write `ext install robole.file-bunny` in the text field, and hit `Enter`.
1. From the Command-line: Run the command `code --install-extension robole.file-bunny`.
1. From the [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=robole.file-bunny): Click the _Install_ button.

## Contribute

If you have a suggestion or find a bug, please file an issue.

## Show gratitude

If you are happy with the extension, please star the repo, and leave a review to help others find it. 🌟

You can [buy me a coffee](https://www.buymeacoffee.com/robole) if you would like to support me to complete this. ☕🙏
