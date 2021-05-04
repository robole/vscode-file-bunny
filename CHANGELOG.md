# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/-0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
