# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Web demo mode: the app now runs as a pure static site in the browser. Course loading falls back to a curated set of four rhythm-friendly typing courses (JS array / JS function / Python list / Python dict, 51 snippets) baked in via `scripts/build-web-courses.mjs`; progress persists in localStorage and the learning center renders from it.
- Language official icons via a devicon font subset (woff + 7 glyphs only, MIT), with an inline database glyph fallback for generic SQL.
- Micro-interactions: typing spark particles at the caret, three-tier combo flame breathing with embers at 30 combo, odometer tween on WPM/accuracy, session-result choreography (trophy drop-in, light sweep, confetti on new record), and route transitions.
- Ambient layer: drifting fireflies / twinkling stars composited over dusk illustrations on the welcome hero, result card, profile art panel and encouragement card.
- Keycap colorways for the virtual keyboard (deep space / cream / cyber), persisted per device.
- Smart indentation (IDE-style): space runs auto-fill so indentation never needs typing key by key.
- Syntax-highlighted typing surface with line numbers and a breathing amber caret.
- Persistent course restart: "重新开始" entry on completed courses, durable `restartCourse` action that clears SQLite/localStorage progress.

### Changed
- Course page and home page now read real progress from the database (merged with in-session progress) — previously cards always showed 0% after a fresh app start.
- Bundled Caveat handwriting font (OFL) for consistent annotations; unified amber focus rings; raised `text-muted` contrast to WCAG AA; menu glyph on the virtual keyboard drawn as SVG.
- Illustrations and reward icons converted to WebP and the sound pack to OGG (~15 MB of assets reduced to ~2 MB); removed `dist/`, mock data, prototypes and stray logs from the repository.

### Fixed
- Two React hooks-order crashes (blank profile center and a crash when entering a course after loading) — both classes are now covered by an ErrorBoundary and regression-tested logic modules.

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