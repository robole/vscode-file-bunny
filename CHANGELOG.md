# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/-0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2022-07-15

- Added FAQ #4 to README.md.

## [1.2.2] - 2022-06-29

- Update GitHub Action should use latest major version (v1).

## [1.2.1] - 2022-06-29

### Fixed

- Manually uplaoded to VS Code marketplace to see if "Sponsor" button appears.

## [1.2.0] - 2022-06-29

### Changed

- Changed repo from *<https://github.com/robole/file-bunny>* to *<https://github.com/robole/vscode-file-bunny>*.

## [1.1.2] - 2022-06-29

### Fixed

- Added `export NODE_OPTIONS=--openssl-legacy-provider;` to startup task to run dev server in *tasks.json*, so I can run any version of Node.
- Updated the script `build` in *packge.json*. The dot was causing an issue with the latest version of *vsce*.

## [1.1.1] - 2022-06-29

### Fixed

- Fixed some typos in *README.md*.
- Updated `vsce` to latest major version of 2.9.2.

### Added

- Added `sponsor` to *package.json*.

## [1.1.0] - 2022-06-29

### Added

- Added configuration option `filebunny.initialDirectoryOpenFolder` to specify the initial directory for command `File Bunny: Open Folder`.
- Added GitHub Action to publish to VS Code Marketplace and Open VSX to *./.github*.
- Added *.gitattributes* to ensure that tests work on Windows and Linux

### Changed

- Renamed npm script `webpack:dev` to `dev`.
- Updated *vsce* to latest version. Updated the script `build` to `npx vsce package .` (adding `npx`) in *packge.json*.
- Categorised commands in *README.md*.
- Changed *.eslintrc.json* to extend *eslint-config-node-roboleary* config.
- Published source code.

### Removed

- Removed "Custom keybindings" section from *README.md*.
- Removed mentions of "premium edition" from *README.md*.

## [1.0.0] - 2021-07-03

### Added

- Added command *Duplicate file*.
- Added command *Move file*.
- Added command *Delete file*.
- Added command *Open active file in External Default App* (Premium command).

### Changed

- Changed the workspace folder description from "This Folder" to "Workspace Root" for commands: *create new file*, *move active file*, *duplicate active file*, *create new folder*, *duplicate folder*.
- Include the workspace root folder in the picker for the command *duplicate folder*.
- Renamed the commands that operate on active files:
	- Renamed `moveFile` to `moveActiveFile` for *move active file*.
	- Renamed `duplicateFile` to `duplicateActiveFile` for *duplicate active file*.
	- Renamed `deleteFile` to `deleteActiveFile` for *delete active file*.
- Changed `galleryBanner` color in `package.json` to use lighter colour.

### Fixed

- Fixed file names listed in the picker for command *Open Folder* when you navigate to the root directory.
- Fixed command *Open Folder* to retain focus when you click outside, now it is the same as the other commands.

## [0.5.0] - 2021-07-03

### Added

- Add new sections to README.md: keybindings, custom keybindings, FAQ.

### Changed

- Minor edits to logo

## [0.4.1] - 2021-05-14

### Changed

- Set link for purchasing premium version from ko-fi store.

## [0.4.0] - 2021-05-09

### Added

- `File Bunny: Copy File Name`
- `File Bunny: Copy Relative Path`
- `File Bunny: Copy Absolute Path`
- `File Bunny: Open Recent Folder`
- `File Bunny: Open Workspace Folder Externally`

### Changed

- Changed `Duplicate Active File` to include existing file name in 2nd step.
- Changed `Duplicate Active File` to maintain value in second step when goBack() is executed.
- Changed logo colors and outline shape.
- Commands will not throw an error if there is no workspace open, or no active text editor.
- Major refactor.

## [0.3.0] - 2021-05-05

### Changed

- Changed `Duplicate Active File` and `Move Active File` to show error message when action would overwrite a file.

## [0.2.0] - 2021-05-04

### Added

- `File Bunny: Create New File`: Create a new file for the current workspace.
- `File Bunny: Duplicate Active File`: Copy the active file and place it somewhere in the current workspace.
- `File Bunny: Rename Active File`
- `File Bunny: Go to Top of Active File`: The `Home` key is bound to this command also.
- `File Bunny: Go to End of Active File` The `End` key is bound to this command also.

### Fixed

- Tested on Windows and fixed some filepath issues for existing commands.

## [0.1.0] - 2021-04-28

### Added

- Initial preview release. Open for feedback.
