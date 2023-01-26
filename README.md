# Open-source Themes package for LightningChart JS

- Provides tools and ready-made options for customizing LightningChart JS colors and styles
- Helps with kicking off your own custom themes development by checking through the open-source repository
- No need to wait for new LightningChart JS versions to get updates for themes, colorization and styling 

## Usage

```sh
npm i @arction/themes
```

```ts
import { makeLightningChartThemeFlat } from "@arction/themes"
import { ColorHEX, lightningChart, SolidFill } from "@arction/lcjs"

const flatDarkTheme = makeLightningChartThemeFlat({
    backgroundColor: ColorHEX('141619'),
    textColor: ColorHEX('c5ced7'),
    dataColors: [ColorHEX('e24d42')],
    axisColor: ColorHEX('00000000'),
    gridLineColor: ColorHEX('2c3235'),
    uiBackgroundColor: ColorHEX('141619'),
    uiBorderColor: ColorHEX('ffffff'),
    fontFamily: 'Verdana',
})

const chart = lightningChart().ChartXY({ theme: flatDarkTheme })
chart.addLineSeries().addArrayY(new Array(10).fill(0).map(_ => Math.random()))
chart.addLegendBox().add(chart)
```

See [CHANGELOG](https://github.com/Arction/lcjs-themes/blob/main/CHANGELOG.md) for latest additions to package contents.

## Examples

See [examples](https://github.com/Arction/lcjs-themes/blob/main/examples/) on how to use themes in different scenarios:

### HTML/JS

![Custom themed chart with HTML/JS code](./screenshots/html.png)

### React

![Custom themed chart with React](./screenshots/react.png)

### Headless

![Custom themed chart in headless](./screenshots/headless.png)

Learn more about LightningChart JS [on our web site](https://lightningchart.com/js-charts/).

## Contribute

Suggest edits and additions with [GitHub Issues](https://github.com/Arction/lcjs-themes/issues)

Suggest integrating your own code changes with [GitHub Pull Requests](https://github.com/Arction/lcjs-themes/pulls)
