# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.1.0] - 2026-09-12

### Added
- Amber arcade UI theme with dusk illustrations, a new amber `< >` app icon and a redesigned header.
- Syntax-highlighted typing surface: per-character keyword/string/number coloring, line numbers and a breathing amber caret.
- Virtual keyboard powered by react-simple-keyboard: next-key amber highlight, physical key sync, finger-zone guidance, green flash on correct / red shake on wrong input.
- IDE-style smart indentation: space runs auto-fill so indentation never needs to be typed key by key.
- Milestone toasts for combo tiers (10/20/30) and new best records, plus a combo badge on the live stats bar.
- Session result card: highlights and weak-point analysis with personal-best deltas.
- Profile center upgrades: level card, daily streak, 7-day activity trend and a language-distribution donut.
- Frameless window with an integrated custom title bar (minimize / maximize / close) and window permissions via Tauri capabilities.
- Settings persistence in SQLite (theme, editor and AI configuration).

### Changed
- Reworked the whole visual language to an amber/deep-navy theme across all pages.
- Replaced the in-editor stats strip with a right-hand encouragement panel and a six-card core stats bar.
- Course page: sidebar filters (mode / language / difficulty / status), course search, in-progress-first ordering and status tags.
- Welcome page: today's recommendations with per-pack progress, feature cards and a recent-progress entry.

### Fixed
- Fixed a React hooks-order crash that blanked the profile center while loading.

## [1.0.1] - 2026-05-18

### Added
- Add weak-first ordering for challenge segments based on pattern mastery.

### Changed
- Record per-segment mastery during challenge runs so weak-first ordering adapts over time.

### Fixed
- Stop timed challenge countdowns while waiting to enter the next segment.
- Display training pack mastery as an integer percentage.

## [0.1.0] - 2024-05-10

### Added
- Initial release of CodeStep
- Basic typing practice functionality
- Course management system
- Multi-language support (Python, Java, JavaScript)

---

## Template for Future Releases

```markdown
## [x.y.z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Any bug fixes

### Security
- Security fixes
```

[Unreleased]: https://github.com/ynzz-j/code-step/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ynzz-j/code-step/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ynzz-j/code-step/compare/v0.1.0...v1.0.1
[0.1.0]: https://github.com/ynzz-j/code-step/releases/tag/v0.1.0
