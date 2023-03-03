import './App.css'
import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { lightningChart, ColorHEX, AxisScrollStrategies } from '@arction/lcjs'
import { makeFlatTheme } from '@arction/lcjs-themes'

const examples = [
    {
        name: 'Line Chart',
        create: (container, theme) => {
            const chart = lightningChart().ChartXY({ container, theme })
            chart.addLineSeries().addArrayY([1, 5, 4, 7, 2, 4, 2, 4, 5, 4, 9, 8, 6, 6.2])
            chart.forEachAxis((axis) => axis.fit())
            chart.addLegendBox().add(chart)
            return () => {
                chart.dispose()
            }
        },
    },
    {
        name: 'Dashboard',
        create: (container, theme) => {
            const dashboard = lightningChart().Dashboard({ container, theme, numberOfColumns: 2, numberOfRows: 2 })
            const xyChart = dashboard.createChartXY({ columnIndex: 0, rowIndex: 0 }).setTitle('')
            const xySeries = xyChart
                .addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } })
                .setStrokeStyle((stroke) => stroke.setThickness(-1))
            const interval = setInterval(() => {
                xySeries.add({ x: xySeries.getXMax() + 1, y: Math.random() })
            }, 10)
            xyChart
                .getDefaultAxisX()
                .setScrollStrategy(AxisScrollStrategies.progressive)
                .setInterval({ start: -1000, end: 0, stopAxisAfter: false })

            const pie = dashboard.createPieChart({ columnIndex: 1, rowIndex: 0, rowSpan: 1 }).setTitle('')
            ;[
                { name: 'Category 1', value: 20 },
                { name: 'Category 2', value: 5 },
                { name: 'Category 3', value: 10 },
                { name: 'Category 4', value: 65 },
            ].forEach((item) => pie.addSlice(item.name, item.value))

            const spider = dashboard.createSpiderChart({ columnIndex: 0, rowIndex: 1, columnSpan: 2 }).setTitle('')
            spider
                .addSeries()
                .addPoints(
                    { axis: 'Category 1', value: 10 },
                    { axis: 'Category 2', value: 10 },
                    { axis: 'Category 3', value: 20 },
                    { axis: 'Category 4', value: 40 },
                    { axis: 'Category 5', value: 20 },
                )

            spider.addLegendBox().add(dashboard)

            return () => {
                dashboard.dispose()
                clearInterval(interval)
            }
        },
    },
    {
        name: '3D Chart',
        create: (container, theme) => {
            const chart = lightningChart().Chart3D({ container, theme })
            chart.addLineSeries().add([1, 5, 4, 7, 2, 4, 2, 4, 5, 4, 9, 8, 6, 6.2].map((y, i) => ({ x: i, y, z: 0 })))
            chart.addLineSeries().add([3, 2.6, 3, 4, 6.2, 3, 2.2, 3, 4, 3.5, 6, 5, 4, 5].map((y, i) => ({ x: i, y, z: 1 })))
            chart.addLineSeries().add([1, 5, 4, 7, 2, 4, 2, 4, 5, 4, 9, 8, 6, 6.2].map((y, i) => ({ x: i, y, z: 2 })))
            chart.getDefaultAxisX().fit()
            chart.getDefaultAxisY().fit()
            const yInterval = chart.getDefaultAxisY().getInterval()
            chart.getDefaultAxisY().setInterval({ start: yInterval.start, end: yInterval.start + 2 * (yInterval.end - yInterval.start) })
            chart.getDefaultAxisZ().setInterval({ start: -0.5, end: 2.5 })
            chart.addLegendBox().add(chart)
            return () => {
                chart.dispose()
            }
        },
    },
]

const themeType = {
    name: 'Flat theme',
    properties: {
        isDark: 'boolean',
        fontFamily: 'fontFamily',
        backgroundColor: 'color',
        textColor: 'color',
        dataColors: 'colorPalette',
        axisColor: 'color',
        gridLineColor: 'color',
        uiBackgroundColor: 'color',
        uiBorderColor: 'color',
        dashboardSplitterColor: 'color',
    },
    default: {
        isDark: true,
        fontFamily: 'Verdana',
        backgroundColor: '#141619',
        textColor: '#c5ced7',
        dataColors: ['#e24d42', '#1e00ff', '#0cfd08', '#eeff00'],
        axisColor: '#00000000',
        gridLineColor: '#2c3235',
        uiBackgroundColor: '#141619',
        uiBorderColor: '#ffffff',
        dashboardSplitterColor: '#2c3235',
    },
}

function App() {
    const [themeProperties, setThemeProperties] = useState(themeType.default)
    const [example, setExample] = useState(examples[0])

    useEffect(() => {
        const container = document.getElementById('chart')
        if (!container) {
            return
        }
        const themeConfiguration = Object.fromEntries(
            Object.entries(themeProperties).map(([key, value]) => {
                const type = themeType.properties[key]
                return [
                    key,
                    type === 'color'
                        ? ColorHEX(value)
                        : type === 'colorPalette'
                        ? value.map((color) => ColorHEX(color))
                        : type === 'fontFamily'
                        ? value
                        : type === 'boolean'
                        ? value
                        : undefined,
                ]
            }),
        )

        const theme = makeFlatTheme(themeConfiguration)
        return example.create(container, theme)
    }, [themeProperties, example])
    return (
        <div className="App">
            <div className="toolbar">
                <div className="toolbar-category">
                    <p>{themeType.name} properties</p>
                    <div className="toolbar-options">
                        {Object.entries(themeType.properties).map(([key, value], i) => (
                            <ThemeProperty
                                key={`property-${i}`}
                                type={value}
                                name={key}
                                value={themeProperties[key]}
                                applyValue={(newValue) => {
                                    const newThemeProperties = { ...themeProperties }
                                    newThemeProperties[key] = newValue
                                    setThemeProperties(newThemeProperties)
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="toolbar-category">
                    <p>Examples</p>
                    <div className="toolbar-options">
                        {examples.map((e, i) => (
                            <span
                                key={`example-${i}`}
                                className="toolbar-option interactable"
                                onClick={() => {
                                    setExample(e)
                                }}
                            >
                                {e.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="toolbar-category">
                    <p>Theme type</p>
                    <div className="toolbar-options">
                        <span className="toolbar-option interactable">Flat theme</span>
                    </div>
                </div>
                <div className="toolbar-category">
                    <p>Export</p>
                    <div className="toolbar-options">
                        <span className="toolbar-option interactable" onClick={() => exportCodeSnippetJS(themeProperties)}>
                            JavaScript code snippet
                        </span>
                    </div>
                </div>
            </div>
            <div className="chart-container">
                <div id="chart"></div>
            </div>
        </div>
    )
}

const ThemeProperty = (props) => {
    const { type, name } = props
    return type === 'color' ? (
        ThemePropertyColor(props)
    ) : type === 'colorPalette' ? (
        ThemePropertyColorPalette(props)
    ) : type === 'fontFamily' ? (
        ThemePropertyFontFamily(props)
    ) : type === 'boolean' ? (
        ThemePropertyBoolean(props)
    ) : (
        <span className="toolbar-option">{name}</span>
    )
}

const ThemePropertyBoolean = (props) => {
    const { name, applyValue } = props
    const [enabled, setEnabled] = useState(props.value)
    return (
        <div className="toolbar-option">
            {name}
            <input
                type="checkbox"
                defaultChecked={enabled}
                onChange={(event) => {
                    const checked = event.target.checked
                    setEnabled(checked)
                    applyValue(checked)
                }}
            ></input>
        </div>
    )
}

const validateFormatHEXa = (input) => {
    return input.length === 6 ? `#${input}ff` : input.length === 7 ? `${input}ff` : input
}
const ThemePropertyColor = (props) => {
    const { name, applyValue } = props
    const [color, setColor] = useState(validateFormatHEXa(props.value))
    const hidden = color.slice(-2) === '00'
    return (
        <div className="toolbar-option">
            {name}
            <div className="color-controls">
                <input
                    type="checkbox"
                    defaultChecked={!hidden}
                    onChange={(event) => {
                        const checked = event.target.checked
                        const newColor = `${validateFormatHEXa(color).slice(0, -2)}${checked ? 'ff' : '00'}`
                        setColor(newColor)
                        applyValue(newColor)
                    }}
                ></input>
                <input
                    className="color-field"
                    type="color"
                    defaultValue={color.slice(0, -2)}
                    onChange={debounce(function (event) {
                        const newColor = `${event.target.value}${!hidden ? 'ff' : '00'}`
                        setColor(newColor)
                        applyValue(newColor)
                    }, 250)}
                ></input>
            </div>
        </div>
    )
}

const ThemePropertyColorPalette = (props) => {
    const { name, applyValue } = props
    const [colors, setColors] = useState(props.value)
    return (
        <div className="toolbar-option">
            {name}
            <div>
                <div className="colorPalette-controls">
                    <span
                        className="colorPalette-add-or-subtract interactable"
                        onClick={() => {
                            const newColors = colors.slice()
                            newColors.push('#ffffff')
                            setColors(newColors)
                            applyValue(newColors)
                        }}
                    >
                        +
                    </span>
                    <span
                        className="colorPalette-add-or-subtract interactable"
                        onClick={() => {
                            if (colors.length <= 1) return
                            const newColors = colors.slice()
                            newColors.pop()
                            setColors(newColors)
                            applyValue(newColors)
                        }}
                    >
                        -
                    </span>
                </div>
                <div className="colorPalette-colors">
                    {colors.map((color, i) => (
                        <input
                            key={`color-${i}`}
                            className="color-field"
                            type="color"
                            defaultValue={color}
                            onChange={debounce(function (event) {
                                const newColors = colors.slice()
                                newColors[i] = event.target.value
                                setColors(newColors)
                                applyValue(newColors)
                            }, 250)}
                        ></input>
                    ))}
                </div>
            </div>
        </div>
    )
}

const ThemePropertyFontFamily = (props) => {
    const { name, applyValue } = props
    const [fontFamily, setFontFamily] = useState(props.value)
    return (
        <div className="toolbar-option">
            {name}
            <input
                className="font-field"
                type="text"
                defaultValue={fontFamily}
                onChange={debounce(function (event) {
                    setFontFamily(event.target.value)
                    applyValue(event.target.value)
                }, 250)}
            ></input>
        </div>
    )
}

const exportCodeSnippetJS = (themeProperties) => {
    let snippet = `// import { makeFlatTheme } from '@arction/lcjs-themes'\n// import { ColorHEX } from '@arction/lcjs'\n// Created with LCJS Theme Editor https://github.com/Arction/lcjs-themes\nconst myLCJSTheme = makeFlatTheme({\n`
    Object.entries(themeType.properties).forEach(([key, type]) => {
        const value = themeProperties[key]
        const valueStr =
            type === 'color'
                ? `ColorHEX("${value}")`
                : type === 'colorPalette'
                ? `[${value.map((color) => `ColorHEX("${color}")`).join(', ')}]`
                : type === 'fontFamily'
                ? `"${value}"`
                : undefined
        snippet += `\t${key}: ${valueStr},\n`
    })
    snippet += `})`
    snippet += `\n// const chart = lightningChart().ChartXY({ theme: myLCJSTheme })`

    navigator.clipboard
        .writeText(snippet)
        .then(() => {
            alert(`Copied code snippet to clip board. You can paste it into your application to use this theme.`)
        })
        .catch((err) => {
            alert(`Couldn't write to clip board (${err}). Printing code snippet to console.`)
            console.log(snippet)
        })
}

export default App
