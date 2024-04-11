import { Theme } from '@arction/lcjs'
import { CustomThemeOptions, makeCustomTheme } from './customTheme'

/**
 * Factory function for creating a LightningChart JS Theme with a flat style based on very minimal configuration options.
 *
 * No-code interface for this factory can be found at https://arction.github.io/lcjs-themes/
 *
 * Pre-built versions generated using this factory can be found in this library:
 *
 * - `flatThemeDark` https://github.com/Arction/lcjs-themes/blob/main/src/flatThemeDark.ts
 * - `flatThemeLight` https://github.com/Arction/lcjs-themes/blob/main/src/flatThemeLight.ts
 *
 * @param   options - Configuration options for the created theme.
 * @returns LightningChart JS `Theme` object.
 * @deprecated  Deprecated in v3.2 over `makeCustomTheme`
 */
export const makeFlatTheme = (options: CustomThemeOptions): Theme => {
    return makeCustomTheme({ ...options, gradients: false, effects: false })
}
