import logo from './logo.svg'
import './App.css'
import { useEffect } from 'react'
import { lightningChart, ColorHEX } from '@arction/lcjs'
import { makeCustomTheme } from '@arction/lcjs-themes'

function App() {
    const flatDarkTheme = makeCustomTheme({
        backgroundColor: ColorHEX('141619'),
        textColor: ColorHEX('c5ced7'),
        dataColors: [ColorHEX('e24d42')],
        axisColor: ColorHEX('00000000'),
        gridLineColor: ColorHEX('2c3235'),
        uiBackgroundColor: ColorHEX('141619'),
        uiBorderColor: ColorHEX('ffffff'),
        fontFamily: 'Verdana',
    })

    useEffect(() => {
        const chartContainer = document.getElementById('chart')
        const chart = lightningChart().ChartXY({ container: chartContainer, theme: flatDarkTheme }).setTitle('LightningChart JS Themes')
        chart.addLineSeries().addArrayY(new Array(100).fill(0).map((_) => Math.random()))
        return () => {
            chart.dispose()
        }
    }, [])
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <div id="chart"></div>
            </header>
        </div>
    )
}

export default App
