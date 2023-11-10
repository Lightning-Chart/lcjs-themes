import './App.css'
import { useEffect, useState, useId, useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { lightningChart, ColorHEX, AxisScrollStrategies } from '@arction/lcjs'
import { makeFlatTheme } from '@arction/lcjs-themes'
import { ReactComponent as ChartXYLogo } from './chartXYExample.svg'
import { ReactComponent as Chart3DLogo } from './chart3DExample.svg'
import { ReactComponent as DashboardLogo } from './dashboardExample.svg'
import { ReactComponent as LCJSLogo } from './lcjs-logo.svg'
import { ReactComponent as PlusLogo } from './plus.svg'
import { ReactComponent as MinusLogo } from './minus.svg'
import { ConfigProvider, Select, message, Switch } from 'antd'
import TextArea from 'antd/es/input/TextArea'

// https://lightningchart.com/js-charts
const lcLicenseKey = undefined

const examples = [
    {
        name: 'Line Chart',
        icon: 'chartXY',
        create: (lc, container, theme) => {
            const chart = lc.ChartXY({ container, theme })
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
        icon: 'dashboard',
        create: (lc, container, theme) => {
            const dashboard = lc.Dashboard({ container, theme, numberOfColumns: 2, numberOfRows: 4, rowSpan: 1 })
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

            const barChart = dashboard
                .createBarChart({ columnIndex: 0, rowIndex: 1 })
                .setTitle('')
                .setData([
                    { category: 'Category A', value: 4 },
                    { category: 'Category B', value: 12 },
                    { category: 'Category C', value: 5 },
                    { category: 'Category D', value: 8 },
                    { category: 'Category E', value: 2 },
                ])

            const pie = dashboard.createPieChart({ columnIndex: 1, rowIndex: 0, rowSpan: 2 }).setTitle('')
            ;[
                { name: 'Category 1', value: 20 },
                { name: 'Category 2', value: 5 },
                { name: 'Category 3', value: 10 },
                { name: 'Category 4', value: 65 },
            ].forEach((item) => pie.addSlice(item.name, item.value))

            const spider = dashboard.createSpiderChart({ columnIndex: 0, rowIndex: 2, columnSpan: 2, rowSpan: 2 }).setTitle('')
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
        icon: 'chart3D',
        create: (lc, container, theme) => {
            const chart = lc.Chart3D({ container, theme })
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
        fontFamily: 'Segoe UI, -apple-system, Verdana, Helvetica',
        backgroundColor: '#181818ff',
        textColor: '#ffffc8ff',
        dataColors: [
            '#ffff5b',
            '#ffcd5b',
            '#ff9b5b',
            '#ffc4bc',
            '#ff94b8',
            '#db94c6',
            '#ebc4e0',
            '#a994c6',
            '#94e2c6',
            '#94ffb0',
            '#b4ffa5',
        ],
        axisColor: '#00000000',
        gridLineColor: '#303030ff',
        uiBackgroundColor: '#161616ff',
        uiBorderColor: '#ffffff',
        dashboardSplitterColor: '#2d2d2dff',
    },
}

const ExampleIcon = (props) => {
    switch (props.icon) {
        case 'chartXY':
            return <ChartXYLogo />
        case 'chart3D':
            return <Chart3DLogo />
        case 'dashboard':
            return <DashboardLogo />
        default:
            return null
    }
}

function App() {
    const [themeProperties, setThemeProperties] = useState(themeType.default)
    const [example, setExample] = useState(examples[0])
    const [messageApi, contextHolder] = message.useMessage()

    const exportCodeSnippetJS = () => {
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
                    : type === 'boolean'
                    ? String(value)
                    : undefined
            snippet += `\t${key}: ${valueStr},\n`
        })
        snippet += `})`
        snippet += `\n// const chart = lightningChart().ChartXY({ theme: myLCJSTheme })`

        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(snippet)
                .then(() => {
                    messageApi.open({
                        type: 'success',
                        content: `Copied code snippet to clip board. You can paste it into your application to use this theme.`,
                    })
                })
                .catch((err) => {
                    messageApi.open({
                        type: 'error',
                        content: `Couldn't write to clip board (${err}). Printing code snippet to console.`,
                    })
                    console.log(snippet)
                })
        } else {
            messageApi.open({
                type: 'error',
                content: `Couldn't write to clip board. Printing code snippet to console.`,
            })
            console.log(snippet)
        }
    }

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
        const lc = lightningChart({ license: lcLicenseKey })
        const cleanupExample = example.create(lc, container, theme)
        return () => {
            cleanupExample()
            lc.dispose()
        }
    }, [themeProperties, example])
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#C58E00',
                },
            }}
        >
            <div className="App">
                {contextHolder}
                <div className="toolbar">
                    <LCJSLogo className="lcjs-logo" />
                    <div className="toolbar-category toolbar-category-example">
                        <p>Examples</p>
                        <div className="toolbar-options toolbar-example-list">
                            {examples.map((e, i) => (
                                <div
                                    key={e.name}
                                    className={`example-icon${example.name === e.name ? ' example-icon-selected' : ''}`}
                                    onClick={() => setExample(e)}
                                >
                                    <ExampleIcon icon={e.icon} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="toolbar-category">
                        <p>Theme properties</p>
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
                    <hr />
                    <div className="toolbar-category">
                        <p>Theme type</p>
                        <div className="toolbar-options">
                            <Select defaultValue={'flat'} options={[{ value: 'flat', label: 'Flat theme' }]} />
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div className="toolbar-category">
                        <div className="toolbar-options">
                            <span className="toolbar-option interactable js-snippet-export-button" onClick={exportCodeSnippetJS}>
                                JavaScript code snippet
                            </span>
                        </div>
                    </div>
                </div>
                <div className="chart-container">
                    <div id="chart"></div>
                </div>
            </div>
        </ConfigProvider>
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

const BooleanSelector = (props) => {
    const id = useId()

    const handleChange = (state) => {
        if (props.onChange) {
            props.onChange(state)
        }
    }

    return (
        <>
            <label htmlFor={id}>{props.label}</label>
            <Switch checkedChildren="I" defaultChecked={props.value || false} onChange={handleChange} style={{ marginRight: '42px' }} />
        </>
    )
}

const ColorSelector = (props) => {
    const colorInputRef = useRef(null)
    const [color, setColor] = useState(validateFormatHEXa(props.color || '#000'))

    const handleColorChange = (event) => {
        if (event.target.value) {
            const newColor = event.target.value
            setColor(newColor)
            if (props.onColorChange) {
                props.onColorChange(newColor)
            }
        }
    }

    const handleClick = () => {
        if (colorInputRef.current) {
            colorInputRef.current.focus()
            colorInputRef.current.value = color.length > 7 ? color.slice(0, -2) : color
            colorInputRef.current.click()
        }
    }

    return (
        <>
            <div className="color-selector-balloon" style={{ backgroundColor: color }} onClick={handleClick}>
                <input ref={colorInputRef} type="color" style={{ visibility: 'hidden' }} onChange={debounce(handleColorChange, 250)} />
            </div>
        </>
    )
}

const BooleanSelectorWithColor = (props) => {
    const id = useId()
    const [color, setColor] = useState(validateFormatHEXa(props.color || '#000'))

    const handleChange = (state) => {
        if (props.onStateChange) {
            props.onStateChange(state)
        }
    }

    const handleColorChange = (color) => {
        const newColor = color
        setColor(newColor)
        if (props.onColorChange) {
            props.onColorChange(newColor)
        }
    }

    return (
        <>
            <label htmlFor={id}>{props.label}</label>
            <div className="color-controls">
                <Switch id={id} checkedChildren="I" defaultChecked={props.value || false} onChange={handleChange} />
                <ColorSelector color={color} onColorChange={handleColorChange} />
            </div>
        </>
    )
}

const ThemePropertyBoolean = (props) => {
    const { name, applyValue } = props

    const handleChange = (state) => {
        applyValue(state)
    }

    return (
        <div className="toolbar-option">
            <BooleanSelector label={name} value={props.value} onChange={handleChange} />
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

    const handleStateChange = (state) => {
        const newColor = `${validateFormatHEXa(color).slice(0, -2)}${state ? 'ff' : '00'}`
        setColor(newColor)
        applyValue(newColor)
    }
    const handleColorChange = (uColor) => {
        const newColor = `${uColor}${!hidden ? 'ff' : '00'}`
        setColor(newColor)
        applyValue(newColor)
    }

    return (
        <div className="toolbar-option">
            <BooleanSelectorWithColor
                label={name}
                value={!hidden}
                color={color.slice(0, -2)}
                onStateChange={handleStateChange}
                onColorChange={handleColorChange}
            />
        </div>
    )
}

const ThemePropertyColorPalette = (props) => {
    const { name, applyValue } = props
    const [colors, setColors] = useState(props.value)
    return (
        <div className="toolbar-option toolbar-option-colorPalette">
            <div className="colorPalette-header">
                <span>{name}</span>
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
                        <PlusLogo />
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
                        <MinusLogo />
                    </span>
                </div>
            </div>
            <div className="colorPalette-colors">
                {colors.map((color, i) => (
                    <ColorSelector
                        className="color-field"
                        key={`color-${i}`}
                        color={color}
                        onColorChange={debounce(function (nColor) {
                            const newColors = colors.slice()
                            newColors[i] = nColor
                            setColors(newColors)
                            applyValue(newColors)
                        }, 250)}
                    />
                ))}
            </div>
        </div>
    )
}

const ThemePropertyFontFamily = (props) => {
    const { name, applyValue } = props
    const [fontFamily, setFontFamily] = useState(props.value)
    const [value, setValue] = useState(fontFamily)
    const [focus, setFocus] = useState(false)
    const id = useId()

    const debouncedCallback = useCallback(
        debounce(function (event) {
            setFontFamily(event.target.value)
            applyValue(event.target.value)
            console.log('change')
        }, 250),
        [debounce, setFontFamily, applyValue],
    )

    const handleValueChange = (event) => {
        setValue(event.target.value)
        debouncedCallback(event)
    }

    const truncatedVal = value.length > 22 ? value.substr(0, 21) + '...' : value

    return (
        <div className="toolbar-option toolbar-option-text">
            <label htmlFor={id}>{name}</label>
            <TextArea
                id={id}
                type="text"
                className="font-field"
                rows={1}
                value={focus ? value : truncatedVal}
                onFocus={(e) => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={handleValueChange}
            />
        </div>
    )
}

export default App
