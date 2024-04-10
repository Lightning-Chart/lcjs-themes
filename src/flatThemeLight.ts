import { makeCustomTheme } from './customTheme'
import { ColorHEX } from '@arction/lcjs'

/**
 * Adaptation of `Themes.light` from `@arction/lcjs` using `makeCustomTheme` factory.
 *
 * ```ts
 *  // Example use
 *  import { flatThemeLight } from '@arction/lcjs-themes'
 *
 *  const chart = lightningChart().ChartXY({ theme: flatThemeLight })
 * ```
 *
 * Make your own adjustments by:
 * - Referencing source code at https://github.com/Arction/lcjs-themes/blob/main/src/flatThemeLight.ts
 * - Using the online editor: https://arction.github.io/lcjs-themes/
 *
 * @public
 */
export const flatThemeLight = makeCustomTheme({
    isDark: false,
    gradients: false,
    effects: false,
    fontFamily: 'Segoe UI, -apple-system, Verdana, Helvetica',
    backgroundColor: ColorHEX('#ffffffff'),
    textColor: ColorHEX('#212b31ff'),
    dataColors: [
        ColorHEX('#1cb58c'),
        ColorHEX('#ff8400'),
        ColorHEX('#f02727'),
        ColorHEX('#5679fb'),
        ColorHEX('#02b5d5'),
        ColorHEX('#0dd49e'),
        ColorHEX('#16a703'),
        ColorHEX('#ea67e8'),
        ColorHEX('#3eb7b3'),
        ColorHEX('#8c5d03'),
        ColorHEX('#9b9eba'),
    ],
    axisColor: ColorHEX('#00000000'),
    gridLineColor: ColorHEX('#dcdcdcff'),
    uiBackgroundColor: ColorHEX('#ffffffff'),
    uiBorderColor: ColorHEX('#a8a8c7ff'),
    dashboardSplitterColor: ColorHEX('#dbe3e9ff'),
})
