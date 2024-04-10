# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [3.2.0] - 2024-10-04

### Added

- `makeCustomTheme`
    - Same as previous `makeFlatTheme` but allows enabling automatic gradients and effects for dark themes. These give much more depth to the generated themes.
- `presetThemeDark`, preset example of new non-flat themes created with `makeCustomTheme`

### Deprecated

- Deprecated `makeFlatTheme` over `makeCustomTheme`.
    - `makeFlatTheme` still works but exists only for backwards compatibility reasons.

## [3.1.0] - 2024-02-09

### Added

-   Support for `@arction/lcjs@5.1.x`
    -   BarChart crashed
-   Optional `fontSize` property to `FlatThemeOptions`
    -   Can be used to override default font sizes by chart title, axis title, legend title and all other fonts.

## [3.0.0] - 2023-11-08

### Added

-   Support for `@arction/lcjs@5.0.x`

## [2.1.0] - 2023-08-08

### Added

-   Flat Theme properties for Bar Chart introduced in `@arction/lcjs@4.2.0`

## [2.0.0] - 2023-05-23

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
