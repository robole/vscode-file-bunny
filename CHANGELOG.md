# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/-0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2021-07-04

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
