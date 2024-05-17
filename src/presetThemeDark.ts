import { makeCustomTheme } from './customTheme'
import { ColorHEX } from '@lightningchart/lcjs'

/**
 * A dark theme created using `makeCustomTheme` factory.
 *
 * ```ts
 *  // Example use
 *  import { presetThemeDark } from '@lightningchart/lcjs-themes'
 *
 *  const chart = lightningChart().ChartXY({ theme: presetThemeDark })
 * ```
 *
 * Make your own adjustments by:
 * - Referencing source code at https://github.com/Arction/lcjs-themes/blob/main/src/presetThemeDark.ts
 * - Using the online editor: https://arction.github.io/lcjs-themes/
 *
 * @public
 */
export const presetThemeDark = makeCustomTheme({
    isDark: true,
    gradients: true,
    effects: true,
    fontFamily: 'Segoe UI, -apple-system, Verdana, Helvetica',
    backgroundColor: ColorHEX('#181818ff'),
    textColor: ColorHEX('#ffffc8ff'),
    dataColors: [
        ColorHEX('#ffff5b'),
        ColorHEX('#ffcd5b'),
        ColorHEX('#ff9b5b'),
        ColorHEX('#ffc4bc'),
        ColorHEX('#ff94b8'),
        ColorHEX('#db94c6'),
        ColorHEX('#ebc4e0'),
        ColorHEX('#a994c6'),
        ColorHEX('#94e2c6'),
        ColorHEX('#94ffb0'),
        ColorHEX('#b4ffa5'),
    ],
    axisColor: ColorHEX('#00000000'),
    gridLineColor: ColorHEX('#303030ff'),
    uiBackgroundColor: ColorHEX('#161616ff'),
    uiBorderColor: ColorHEX('#ffffff'),
    dashboardSplitterColor: ColorHEX('#2d2d2dff'),
})
