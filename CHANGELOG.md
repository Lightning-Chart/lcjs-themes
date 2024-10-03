# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [5.0.0] - 2025-02-05

### Changed

-   Migrated to `@lightningchart/lcjs` v7.0.

## [4.1.0] - 2024-11-06

-   Added theming for `ParallelCoordinateChart`, a new feature introduced in LightningChart JS v6.1.

## [4.0.2] - 2024-08-06

### Changed

-   Moved to `@lightningchart` NPM organization.
-   Tweaked area series fill style to utilize transparency more.
-   Migrated to `@lightningchart/lcjs` v6.0.0.

### Fixed

-   Fixed ES Module import not working.

## [3.2.1] - 2024-05-07

### Changed

-   Loosened dependency to `@arction/lcjs` to be allow anything between v5.0.0 and v6.0.0.
    -   This was done due experiencing many issues where NPM decided to interpret the dependency too restrictively, resulting in 2 installations of different LCJS versions, which further resulted in run-time errors.
    -   Users should manually ensure correct combination of LCJS and themes versions using the support table: https://github.com/Arction/lcjs-themes?tab=readme-ov-file#support-table

## [3.2.0] - 2024-04-10

### Added

-   `makeCustomTheme`
    -   Same as previous `makeFlatTheme` but allows enabling automatic gradients and effects for dark themes. These give much more depth to the generated themes.
-   `presetThemeDark`, preset example of new non-flat themes created with `makeCustomTheme`

### Deprecated

-   Deprecated `makeFlatTheme` over `makeCustomTheme`.
    -   `makeFlatTheme` still works but exists only for backwards compatibility reasons.

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
