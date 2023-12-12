# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/-0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.1] - 2023-12-12

## Fixed

- Fixed typo in README in commands section. Accidentally deleted `File Bunny: Open File` title from list! Doh!

## [1.10.0] - 2023-12-12

### Changed

- For `File Bunny: Open File`, `File Bunny: Open File to the Left`, `File Bunny: Open File to the Right`, `File Bunny: Open File Above`, `File Bunny: Open File Below`, `File Bunny: Create New File`, `File Bunny: Move File`, `File Bunny: Duplicate File`, `File Bunny: Delete File`, `File Bunny: Move Active File`, `File Bunny: Duplicate Active File`, `File Bunny: Open Workspace Folder in External Default App`, `File Bunny: Open Folder in External Default App`, `File Bunny: Create New Folder`, `File Bunny: Duplicate Folder`, `File Bunny: Delete Folder` : Give a warning message when no workspace is open because no action will take place. Can consider a different approach for some of these commands in future.
- For `File Bunny: Delete Active File` and `File Bunny: Delete File`: Close the `TextEditor` once the file is deleted.
- Change `MultiStepPicker` and all children to dispose of all disposables when closed. Oddly, when no workspace is open the disposal needs to be done explicitly. When a workspace is open, the `onDidHide` event is taking care of it.

## [1.9.2] - 2023-12-11

### Fixed

- The GitHub Action had wrong variable name for PAT for VS Code Marketplace step.
- Update VSCE_TOKEN secret in repo.

## [1.9.1] - 2023-12-11

### Fixed

- The GitHub Action for publishing the extension to the marketplace is failing for the step for the VS Code Marketplace. It may be that I am in Turkiye and some URL is blocked! Regardless, now it bundles the extension once and use that bundled extension to publish to both marketplaces.

## [1.9.0] - 2023-12-11

### Changed

- Switched bundler from webpack to ESBuild.
- Changed "Run Extension" launch config (*launch.json*) to include `outFiles` property to be able to break properly when debugging.

### Removed

- Remove *webpack.config.js*.

## [1.8.1] - 2023-12-09

### Changed

- The `vsce` package is deprecated. Updated dev dependencies to use `@vscode/vsce` instead.
- Update badge colors to be uniform colors in README.md.

## Fixed

- Fixed a bug when running `File Bunny: Rename Active File` on a file when no workspace is open. See [issue](https://github.com/robole/vscode-file-bunny/issues/14) on GitHub.

## [1.8.0] - 2023-04-20

### Added

- Added badges for downloads and installs to README.

### Changed

- Improved test cases in *extension.test.js*.
- Linted test files.

### Removed

- Removed FAQ about file icons from README. Made into a GitHub issue instead.

## [1.7.0] - 2023-04-20

### Added

- Added funding.yml to show sponsor option on GitHub.

## [1.6.0] - 2023-04-08

### Changed

- Upgraded to Webpack, Webpack CLI, and VSCE to latest major versions to make publishing more reliable.
- Changed license to Apache 2.0.
- Tidied up *Show appreciation* section of README.

## [1.5.0] - 2023-04-06

### Changed

- The command `Move File` opens the file at the end of the action. This behaviour has been removed to be consistent with the other commands.

## [1.4.0] - 2023-04-05

### Added

- Added a title to the dropdown of all commands to clearly identify the command being run. It was added for the following commands:
	- `File Bunny: Open File`
	- `File Bunny: Open File to the Right`
	- `File Bunny: Open File to the Left`
	- `File Bunny: Open File Above`
	- `File Bunny: Open File Below`
	- `File Bunny: Open File in External Default App`

### Changed

- Changed the title to include *step name (field changed)* to clearly identify the value being requested/edited. Now the title is in the form of "<command name> - <step name> - <cumlative value from previous steps>". This was changed for the following commands:
	- `File Bunny: Duplicate Active File`
	- `File Bunny: Duplicate File`
	- `File Bunny: Move File`
	- `File Bunny: Create New File`
	- `File Bunny: Create New Folder`
- Changed wording of some titles and placeholder text to be more consistently phrased.

## [1.3.7] - 2023-03-05

### Fixed

- Fixed typo for `File Bunny: Create New Folder`. The second step of action said "Create a new file:...".

## [1.3.6] - 2022-12-06

### Fixed

- Same focus issue as v1.3.5 but for *browser.js*.

## [1.3.5] - 2022-11-23

### Fixed

- Commands that involved a QuickPick with multiple steps now do not have focus when run. Something underlying in VS Code changed to cause this. It is resolved by removing the disabling and enabling of the QuickPick when work is being to fetch a file list (`this.picker.enabled = false`) to prevent user interaction. This behaviour was changed in all classes that extend *multiStepPicker.js*: *duplicateActiveFilePicker.js*, *duplicateFilePicker.js*,*duplicateFolderPicker.js*, *moveFilePikcer.js*, *newFilePicker.js*, and *newFolderPicker.js*

## [1.3.4] - 2022-11-09

### Fixed

- Fixed [Issue #7](https://github.com/robole/vscode-file-bunny/issues/7#issuecomment-1305974023). The command `filebunny.moveActiveFile` was renaming the file unintentionally. It was substituting spaces with "%20".

## [1.3.3] - 2022-11-03

### Fixed

- Removed references to keybindings for *Home* and *End* from README.

## [1.3.2] - 2022-11-03

### Fixed

- Removed keybindings for *Home* and *End*. These keys already have existing keybindings that may confuse users. See [issue #5](https://github.com/robole/vscode-file-bunny/issues/5) for details.

## [1.3.1] - 2022-07-15

### Fixed

- Fix outstanding linting errors.

## [1.3.0] - 2022-07-15

### Added

- Added FAQ #4 to README.md.

## [1.2.2] - 2022-06-29

### Changed

- Update GitHub Action to use latest major version (v1).

## [1.2.1] - 2022-06-29

### Fixed

- Manually uploaded to VS Code marketplace to see if "Sponsor" button appears.

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
