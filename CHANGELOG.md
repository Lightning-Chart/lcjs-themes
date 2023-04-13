# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.0.0] - TBD

### Changed

-   Cursor gridlines changed from solid to dashed. Requires `@arction/lcjs@^4.1.0`

## [1.1.0] - 2023-03-03

### Added

-   `FlatThemeOptions.isDark`
    -   Allows making light themes.
-   `flatThemeDark`
-   `flatThemeLight`

### Changed

-   `makeFlatTheme` spider chart web style color is now taken from grid-lines rather than ui border.

## [1.0.0] - 2023-02-06

### Added

-   `makeFlatTheme`
    -   Function that takes a handful of colors as input and produces a flat LightningChart JS Theme.
    -   At this time, mainly tested with dark color themes and most frequently used LightningChart features.

### Changed

### Removed

### Fixed

### Deprecated
