import {
    Color,
    ColorRGBA,
    DashedLine,
    DateTimeTickStrategy,
    FillStyle,
    FontSettings,
    GlowEffect,
    GradientExtent,
    GradientShape,
    LinearGradientFill,
    NumericTickStrategy,
    PointShape,
    PointStyle3D,
    RadialGradientFill,
    SolidFill,
    SolidLine,
    StipplePatterns,
    Theme,
    TickStyle,
    TimeTickStrategy,
    emptyFill,
    emptyLine,
    emptyTick,
    interpolateColor,
    transparentFill,
} from '@lightningchart/lcjs'

const colorMissing = ColorRGBA(0, 255, 0)

const StylePalette = <T, R>(array: T[], clbk: (value: T) => R): ((i: number) => R) => {
    const values = array.map(clbk)
    return (i: number) => values[i % values.length]
}

const clampNumber = (num: number, a: number, b: number) => {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    return num > max ? max : num < min ? min : num
}

const adjustColorBrightness = (color: Color, amt: number) => {
    return ColorRGBA(
        clampNumber(color.getR() + amt, 0, 255),
        clampNumber(color.getG() + amt, 0, 255),
        clampNumber(color.getB() + amt, 0, 255),
        color.getA(),
    )
}

/**
 * Configuration options interface for [[makeCustomTheme]].
 */
export type CustomThemeOptions = {
    /**
     * Color of charts background.
     */
    backgroundColor: Color
    /**
     * Color of all text.
     */
    textColor: Color
    /**
     * List of colors for series and other components representing data.
     *
     * When many colors are supplied, making several components within 1 chart will result in different colors being picked.
     */
    dataColors: Color[]
    /**
     * Color of Axis lines.
     */
    axisColor: Color
    /**
     * Color of tick gridlines.
     */
    gridLineColor: Color
    /**
     * Color of UI backgrounds, most notably LegendBox and cursor result tables.
     */
    uiBackgroundColor: Color
    /**
     * Color of UI background borders, most notably LegendBox and cursor result tables.
     */
    uiBorderColor: Color
    /**
     * Font family of all text. Same as CSS `font-family`.
     */
    fontFamily: string

    /**
     * Enable gradients? Defaults to `true`.
     *
     * Only impactful for Dark themes (`isDark` property).
     *
     * `true` -> automatically uses gradients with shifts background colors towards darker and brighter shades.
     *
     * `false` -> all colors are flat.
     */
    gradients?: boolean
    /**
     * Enable effects? Defaults to `true`.
     *
     * `true` -> Adds subtle shadows behind series, legends, etc.
     */
    effects?: boolean

    fontSize?: {
        chartTitle: number
        axisTitle: number
        legendTitle: number
        other: number
    }

    // ----- Feature specific properties (should be kept optional) -----

    /**
     * **Only needed for Dashboard**
     *
     * Color for Dashboard splitter lines.
     */
    dashboardSplitterColor?: Color

    /**
     * **Only needed for non-dark themes**
     *
     * Defaults to `true`.
     *
     * Switches some default assigned colors between values suitable for dark / light themes.
     */
    isDark?: boolean
}

/**
 * Factory function for creating a LightningChart JS Theme based on very minimal configuration options.
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
 */
export const makeCustomTheme = (options: CustomThemeOptions): Theme => {
    options.gradients = options.gradients !== undefined ? options.gradients : true
    options.effects = options.effects !== undefined ? options.effects : true
    const colorWhite = ColorRGBA(255, 255, 255)
    const colorBlack = ColorRGBA(0, 0, 0)
    const whiteFillStyle = new SolidFill({ color: colorWhite })
    const blackFillStyle = new SolidFill({ color: colorBlack })
    //
    //
    //
    const isDark = options.isDark !== undefined ? options.isDark : true
    const labelShadow: Color | undefined = options.isDark ? ColorRGBA(0, 0, 0, 255) : undefined
    let lcjsBackgroundFillStyle: FillStyle
    if (!options.gradients || !options.isDark) {
        lcjsBackgroundFillStyle = new SolidFill({
            color: options.backgroundColor,
        })
    } else {
        // Add some shading between darker and lighter bg.
        lcjsBackgroundFillStyle = new RadialGradientFill({
            position: { x: 0.8, y: 0.8 },
            extent: GradientExtent.farthestCorner,
            shape: GradientShape.ellipse,
            stops: [
                { offset: 0, color: adjustColorBrightness(options.backgroundColor, 30) },
                { offset: 0.5, color: options.backgroundColor },
                { offset: 1.0, color: adjustColorBrightness(options.backgroundColor, -15) },
            ],
        })
    }
    const highlightColorOffset = isDark ? ColorRGBA(60, 60, 60, 60) : ColorRGBA(-60, -60, -60, 60)
    const highlightColorOffsetAxisOverlay = isDark ? ColorRGBA(255, 255, 255, 40) : ColorRGBA(0, 0, 0, 40)
    const dashboardSplitterStyle = new SolidLine({
        thickness: 4,
        fillStyle: new SolidFill({
            color: options.dashboardSplitterColor || colorMissing,
        }),
    })
    let chartBackgroundFillStyle: FillStyle
    if (!options.gradients || !options.isDark) {
        chartBackgroundFillStyle = transparentFill
    } else {
        // Add highlight layer above charts
        chartBackgroundFillStyle = new RadialGradientFill({
            position: { x: 0.5, y: 0.5 },
            extent: GradientExtent.farthestCorner,
            shape: GradientShape.circle,
            stops: [
                { offset: 0, color: ColorRGBA(120, 120, 120, 100) },
                { offset: 1, color: ColorRGBA(0, 0, 0, 50) },
            ],
        })
    }
    const seriesBackgroundFillStyle = new SolidFill({ color: options.backgroundColor })
    const fontChartTitles = new FontSettings({
        size: options.fontSize?.chartTitle ?? 18,
        family: options.fontFamily,
        weight: 'normal',
        style: 'normal',
    })
    const fontAxisTitles = new FontSettings({
        size: options.fontSize?.axisTitle ?? 16,
        family: options.fontFamily,
        weight: 'normal',
        style: 'normal',
    })
    const fontLegendTitle = new FontSettings({
        size: options.fontSize?.legendTitle ?? 14,
        family: options.fontFamily,
        weight: 'normal',
        style: 'normal',
    })
    const fontOther = new FontSettings({
        size: options.fontSize?.other ?? 14,
        family: options.fontFamily,
        weight: 'normal',
        style: 'normal',
    })
    const textFillStyle = new SolidFill({ color: options.textColor })
    const uiTextFillStyleHidden = new SolidFill({ color: options.isDark ? ColorRGBA(70, 70, 70, 255) : ColorRGBA(170, 170, 170, 255) })
    const zoomRectangleFillStyle = new SolidFill({
        color: isDark ? ColorRGBA(255, 255, 255, 20) : ColorRGBA(0, 0, 0, 20),
    })
    const zoomRectangleStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
    })
    const primaryDataFillStyle = new SolidFill({ color: options.dataColors[0] })
    const dataSolidFillPalette = StylePalette(options.dataColors, (color) => new SolidFill({ color }))
    const dataSolidLinePalette = StylePalette(
        options.dataColors,
        (color) => new SolidLine({ fillStyle: new SolidFill({ color }), thickness: 2 }),
    )
    const seriesStrokeStylePalette = dataSolidLinePalette
    const seriesFillStylePalette = dataSolidFillPalette
    const areaSeriesFillStylePaletteSolid = StylePalette(options.dataColors, (color) => new SolidFill({ color: color.setA(100) }))
    const areaSeriesFillStylePaletteGradientUp = StylePalette(
        options.dataColors,
        (color) =>
            new LinearGradientFill({
                angle: 0,
                stops: [
                    { offset: 0, color: color.setA(0) },
                    { offset: 1, color: color.setA(180) },
                ],
            }),
    )
    const dataBorderStrokePalette = dataSolidLinePalette
    const pointSeries3DPointStylePalette = StylePalette(
        options.dataColors,
        (color) =>
            new PointStyle3D.Triangulated({
                shape: 'sphere',
                size: 10,
                fillStyle: new SolidFill({ color }),
            }),
    )
    const pointCloudSeries3DPointStylePalette = StylePalette(
        options.dataColors,
        (color) =>
            new PointStyle3D.Pixelated({
                size: 5,
                fillStyle: new SolidFill({ color }),
            }),
    )
    const dataFillStylePositive = new SolidFill({
        color: ColorRGBA(176, 255, 157),
    })
    const dataFillStyleNegative = new SolidFill({
        color: ColorRGBA(255, 112, 76),
    })
    const wireframeStyle = new SolidLine({
        thickness: 1,
        fillStyle: blackFillStyle,
    })
    const axisStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: options.axisColor }),
    })
    const axisOverlayStyle = new SolidFill({ color: ColorRGBA(0, 0, 0, 1) }) // NOTE: Slight opaqueness is required for this overlay becoming visible when highlighted.
    const tickStyleMajor = new TickStyle({
        gridStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: new SolidFill({ color: options.gridLineColor }),
        }),
        tickStyle: emptyLine,
        tickLength: 7,
        tickPadding: 0,
        labelFont: fontOther,
        labelFillStyle: textFillStyle,
        labelShadow,
    })
    const tickStyleMinor = new TickStyle({
        gridStrokeStyle: emptyLine,
        tickStyle: emptyLine,
        tickLength: 4,
        tickPadding: 3,
        labelFont: fontOther,
        labelFillStyle: emptyFill,
        labelShadow,
    })
    const numericTickStrategy = new NumericTickStrategy({
        extremeTickStyle: emptyTick,
        majorTickStyle: tickStyleMajor,
        minorTickStyle: tickStyleMinor,
    })
    const dateTimeTickStrategy = new DateTimeTickStrategy({
        greatTickStyle: emptyTick,
        majorTickStyle: tickStyleMajor,
        minorTickStyle: tickStyleMinor,
    })
    const timeTickStrategy = new TimeTickStrategy({
        majorTickStyle: tickStyleMajor,
        minorTickStyle: tickStyleMinor,
    })
    const cursorGridStrokeStyle = new DashedLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        pattern: StipplePatterns.DashedEqual,
        patternScale: 3,
    })
    const cursor3DGridStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
    })
    const bandFillStyle = zoomRectangleFillStyle
    const bandStrokeStyle = zoomRectangleStrokeStyle
    const constantLineStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
    })
    const uiButtonFillStyle = isDark ? whiteFillStyle : blackFillStyle
    const uiButtonFillStyleHidden = uiTextFillStyleHidden
    let uiBackgroundFillStyle: FillStyle
    if (!options.gradients || !options.isDark) {
        uiBackgroundFillStyle = new SolidFill({
            color: options.uiBackgroundColor,
        })
    } else {
        uiBackgroundFillStyle = new LinearGradientFill({
            angle: 0,
            stops: [
                { offset: 0, color: options.uiBackgroundColor },
                { offset: 1, color: adjustColorBrightness(options.uiBackgroundColor, 20) },
            ],
        })
    }
    const uiBackgroundStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: options.uiBorderColor }),
    })
    let effect: GlowEffect | undefined
    let effectsText = false
    let effectsDashboardSplitters = false
    if (options.effects && options.isDark) {
        effect = new GlowEffect({
            spread: 1,
            blur: 9,
            offset: { x: 0, y: 0 },
            color: options.backgroundColor.setA(150),
        })
        effectsText = true
        effectsDashboardSplitters = true
    } else if (options.effects && !options.isDark) {
        effect = new GlowEffect({
            spread: 0,
            blur: 6,
            offset: { x: 2, y: -2 },
            color: ColorRGBA(0, 0, 0, 30),
        })
        effectsDashboardSplitters = true
    }
    const pointSeriesStroke = new SolidLine({ thickness: 1, fillStyle: options.isDark ? whiteFillStyle : blackFillStyle })

    const flatTheme: Theme = {
        isDark,
        effect,
        effectsText,
        effectsDashboardSplitters,
        lcjsBackgroundFillStyle,
        lcjsBackgroundStrokeStyle: emptyLine,
        highlightColorOffset,
        highlightColorOffsetAxisOverlay,
        dashboardSplitterStyle,
        panelPadding: 7,
        chartXYBackgroundFillStyle: chartBackgroundFillStyle,
        chartXYBackgroundStrokeStyle: emptyLine,
        chartXYTitleFont: fontChartTitles,
        chartXYTitleFillStyle: textFillStyle,
        chartXYTitleShadow: labelShadow,
        chartXYSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        chartXYSeriesBackgroundStrokeStyle: emptyLine,
        chartXYZoomingRectangleFillStyle: zoomRectangleFillStyle,
        chartXYZoomingRectangleStrokeStyle: zoomRectangleStrokeStyle,
        chartXYTitleMargin: 5,
        lineSeriesStrokeStyle: seriesStrokeStylePalette,
        pointLineSeriesStrokeStyle: seriesStrokeStylePalette,
        pointLineSeriesFillStyle: seriesFillStylePalette,
        pointSeriesFillStyle: seriesFillStylePalette,
        pointSeriesStrokeStyle: pointSeriesStroke,
        ellipseSeriesFillStyle: seriesFillStylePalette,
        ellipseSeriesStrokeStyle: seriesStrokeStylePalette,
        polygonSeriesFillStyle: seriesFillStylePalette,
        polygonSeriesStrokeStyle: seriesStrokeStylePalette,
        rectangleSeriesFillStyle: seriesFillStylePalette,
        rectangleSeriesStrokeStyle: emptyLine,
        segmentSeriesStrokeStyle: seriesStrokeStylePalette,
        boxSeriesBodyFillStyle: seriesFillStylePalette(0),
        boxSeriesBodyStrokeStyle: emptyLine,
        boxSeriesStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        }),
        boxSeriesMedianStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: isDark ? blackFillStyle : whiteFillStyle,
        }),
        ohlcCandleThicknessPixels: 5,
        ohlcCandleBodyFillStylePositive: dataFillStylePositive,
        ohlcCandleBodyFillStyleNegative: dataFillStyleNegative,
        ohlcCandleTailStrokeStylePositive: new SolidLine({
            thickness: 1,
            fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        }),
        ohlcCandleTailStrokeStyleNegative: new SolidLine({
            thickness: 1,
            fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        }),
        ohlcBarThicknessPixels: 10,
        ohlcBarStrokeStylePositive: new SolidLine({
            thickness: 2,
            fillStyle: dataFillStylePositive,
        }),
        ohlcBarStrokeStyleNegative: new SolidLine({
            thickness: 2,
            fillStyle: dataFillStyleNegative,
        }),
        heatmapGridSeriesFillStyle: seriesFillStylePalette,
        heatmapGridSeriesWireframeStyle: wireframeStyle,
        heatmapScrollingGridSeriesFillStyle: seriesFillStylePalette,
        heatmapScrollingGridSeriesWireframeStyle: wireframeStyle,
        areaRangeSeriesFillStyle: areaSeriesFillStylePaletteSolid,
        areaRangeSeriesStrokeStyle: dataBorderStrokePalette,
        areaRangeSeriesFillStyleInverted: areaSeriesFillStylePaletteSolid,
        areaRangeSeriesStrokeStyleInverted: dataBorderStrokePalette,
        areaSeriesBipolarHighFillStyle: areaSeriesFillStylePaletteSolid,
        areaSeriesBipolarHighStrokeStyle: dataBorderStrokePalette,
        areaSeriesBipolarLowFillStyle: areaSeriesFillStylePaletteSolid,
        areaSeriesBipolarLowStrokeStyle: dataBorderStrokePalette,
        areaSeriesPositiveFillStyle: areaSeriesFillStylePaletteGradientUp,
        areaSeriesPositiveStrokeStyle: dataBorderStrokePalette,
        areaSeriesNegativeFillStyle: areaSeriesFillStylePaletteSolid,
        areaSeriesNegativeStrokeStyle: dataBorderStrokePalette,
        xAxisTitleFont: fontAxisTitles,
        xAxisTitleFillStyle: textFillStyle,
        xAxisStrokeStyle: axisStrokeStyle,
        xAxisOverlayStyle: axisOverlayStyle,
        xAxisZoomingBandFillStyle: zoomRectangleFillStyle,
        xAxisZoomingBandStrokeStyle: emptyLine,
        xAxisNumericTicks: numericTickStrategy,
        xAxisDateTimeTicks: dateTimeTickStrategy,
        xAxisTimeTicks: timeTickStrategy,
        yAxisTitleFont: fontAxisTitles,
        yAxisTitleFillStyle: textFillStyle,
        yAxisStrokeStyle: axisStrokeStyle,
        yAxisOverlayStyle: axisOverlayStyle,
        yAxisZoomingBandFillStyle: zoomRectangleFillStyle,
        yAxisZoomingBandStrokeStyle: emptyLine,
        yAxisNumericTicks: numericTickStrategy,
        yAxisDateTimeTicks: dateTimeTickStrategy,
        yAxisTimeTicks: timeTickStrategy,
        bandFillStyle,
        bandStrokeStyle,
        constantLineStrokeStyle,
        barChartBackgroundFillStyle: chartBackgroundFillStyle,
        barChartBackgroundStrokeStyle: emptyLine,
        barChartTitleFont: fontChartTitles,
        barChartTitleFillStyle: textFillStyle,
        barChartTitleShadow: labelShadow,
        barChartSeriesBackgroundFillStyle: transparentFill,
        barChartSeriesBackgroundStrokeStyle: emptyLine,
        barChartBarFillStyle: seriesFillStylePalette,
        barChartBarStrokeStyle: emptyLine,
        barChartValueAxisTitleFont: fontAxisTitles,
        barChartValueAxisTitleFillStyle: textFillStyle,
        barChartValueAxisStrokeStyle: axisStrokeStyle,
        barChartValueAxisTicks: numericTickStrategy
            .setMajorTickStyle((major) => major.setGridStrokeStyle(emptyLine))
            .setMinorTickStyle((minor) => minor.setGridStrokeStyle(emptyLine)),
        barChartCategoryAxisTitleFont: fontAxisTitles,
        barChartCategoryAxisTitleFillStyle: textFillStyle,
        barChartCategoryAxisStrokeStyle: axisStrokeStyle,
        barChartCategoryLabels: {
            formatter: (category, categoryValuesTotal) => category,
            labelFillStyle: numericTickStrategy.majorTickStyle.labelFillStyle,
            labelFont: numericTickStrategy.majorTickStyle.labelFont,
            labelMargin: 8,
            tickStyle: numericTickStrategy.majorTickStyle.tickStyle,
            tickLength: 0,
            labelRotation: 0,
            labelShadow,
        },
        barChartValueLabelsAfterBars: {
            position: 'after-bar',
            formatter: (info) => info.chart.valueAxis.formatValue(info.value),
            labelFillStyle: numericTickStrategy.majorTickStyle.labelFillStyle,
            labelFont: numericTickStrategy.majorTickStyle.labelFont,
            labelMargin: 8,
            labelRotation: 0,
            displayStackedSum: true,
            displayStackedIndividuals: false,
            labelShadow,
        },
        barChartValueLabelsInsideBars: {
            position: 'inside-bar',
            formatter: (info) => info.chart.valueAxis.formatValue(info.value),
            labelFillStyle: isDark ? whiteFillStyle : blackFillStyle,
            labelFont: numericTickStrategy.majorTickStyle.labelFont,
            labelMargin: 8,
            labelRotation: 0,
            displayStackedSum: true,
            displayStackedIndividuals: false,
            labelShadow,
        },
        barChartCornerRadius: 10,
        chart3DBackgroundFillStyle: chartBackgroundFillStyle,
        chart3DBackgroundStrokeStyle: emptyLine,
        chart3DTitleFont: fontChartTitles,
        chart3DTitleFillStyle: textFillStyle,
        chart3DTitleShadow: labelShadow,
        chart3DSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        chart3DSeriesBackgroundStrokeStyle: emptyLine,
        chart3DBoundingBoxStrokeStyle: emptyLine,
        xAxis3DTitleFont: fontAxisTitles,
        xAxis3DTitleFillStyle: textFillStyle,
        xAxis3DStrokeStyle: axisStrokeStyle,
        xAxis3DNumericTicks: numericTickStrategy,
        xAxis3DDateTimeTicks: dateTimeTickStrategy,
        xAxis3DTimeTicks: timeTickStrategy,
        yAxis3DTitleFont: fontAxisTitles,
        yAxis3DTitleFillStyle: textFillStyle,
        yAxis3DStrokeStyle: axisStrokeStyle,
        yAxis3DNumericTicks: numericTickStrategy,
        yAxis3DDateTimeTicks: dateTimeTickStrategy,
        yAxis3DTimeTicks: timeTickStrategy,
        zAxis3DTitleFont: fontAxisTitles,
        zAxis3DTitleFillStyle: textFillStyle,
        zAxis3DStrokeStyle: axisStrokeStyle,
        zAxis3DNumericTicks: numericTickStrategy,
        zAxis3DDateTimeTicks: dateTimeTickStrategy,
        zAxis3DTimeTicks: timeTickStrategy,
        lineSeries3DStrokeStyle: seriesStrokeStylePalette,
        pointLineSeries3DStrokeStyle: seriesStrokeStylePalette,
        pointLineSeries3DPointStyle: pointSeries3DPointStylePalette,
        pointSeries3DPointStyle: pointSeries3DPointStylePalette,
        pointCloudSeries3DPointStyle: pointCloudSeries3DPointStylePalette,
        surfaceGridSeries3DFillStyle: seriesFillStylePalette,
        surfaceGridSeries3DWireframeStyle: wireframeStyle,
        surfaceScrollingGridSeries3DFillStyle: seriesFillStylePalette,
        surfaceScrollingGridSeries3DWireframeStyle: wireframeStyle,
        boxSeries3DFillStyle: seriesFillStylePalette,
        polarChartBackgroundFillStyle: chartBackgroundFillStyle,
        polarChartBackgroundStrokeStyle: emptyLine,
        polarChartTitleFont: fontChartTitles,
        polarChartTitleFillStyle: textFillStyle,
        polarChartTitleShadow: labelShadow,
        polarChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        polarChartSeriesBackgroundStrokeStyle: emptyLine,
        polarSectorFillStyle: bandFillStyle,
        polarSectorStrokeStyle: bandStrokeStyle,
        polarAmplitudeAxisTitleFont: fontAxisTitles,
        polarAmplitudeAxisTitleFillStyle: textFillStyle,
        polarAmplitudeAxisTitleShadow: labelShadow,
        polarAmplitudeAxisStrokeStyle: axisStrokeStyle,
        polarAmplitudeAxisNumericTicks: numericTickStrategy,
        polarAmplitudeAxisDateTimeTicks: dateTimeTickStrategy,
        polarAmplitudeAxisTimeTicks: timeTickStrategy,
        polarRadialAxisTitleFont: fontAxisTitles,
        polarRadialAxisTitleFillStyle: textFillStyle,
        polarRadialAxisStrokeStyle: axisStrokeStyle,
        polarRadialAxisTickStyle: tickStyleMajor,
        polarRadialAxisMarginAfterTicks: 0,
        polarLineSeriesStrokeStyle: seriesStrokeStylePalette,
        polarPointLineSeriesFillStyle: seriesFillStylePalette,
        polarPointLineSeriesStrokeStyle: seriesStrokeStylePalette,
        polarPointSeriesFillStyle: seriesFillStylePalette,
        polarPointSeriesStrokeStyle: pointSeriesStroke,
        polarPolygonSeriesFillStyle: areaSeriesFillStylePaletteSolid,
        polarPolygonSeriesStrokeStyle: dataBorderStrokePalette,
        polarAreaSeriesFillStyle: areaSeriesFillStylePaletteSolid,
        polarAreaSeriesStrokeStyle: dataBorderStrokePalette,
        polarHeatmapSeriesFillStyle: seriesFillStylePalette,
        zoomBandChartDefocusOverlayFillStyle: new SolidFill({
            color: options.isDark ? ColorRGBA(0, 0, 0, 180) : ColorRGBA(255, 255, 255, 180),
        }),
        zoomBandChartSplitterStrokeStyle: new SolidLine({
            thickness: 2,
            fillStyle: options.isDark ? whiteFillStyle : blackFillStyle,
        }),
        zoomBandChartKnobSize: { x: 11, y: 19 },
        zoomBandChartKnobFillStyle: options.isDark ? whiteFillStyle : blackFillStyle,
        mapChartBackgroundFillStyle: chartBackgroundFillStyle,
        mapChartBackgroundStrokeStyle: emptyLine,
        mapChartTitleFont: fontChartTitles,
        mapChartTitleFillStyle: textFillStyle,
        mapChartTitleShadow: labelShadow,
        mapChartFillStyle: primaryDataFillStyle,
        mapChartStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: blackFillStyle,
        }),
        mapChartOutlierRegionFillStyle: emptyFill,
        mapChartOutlierRegionStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        }),
        mapChartSeparateRegionFillStyle: uiBackgroundFillStyle,
        mapChartSeparateRegionStrokeStyle: uiBackgroundStrokeStyle,
        dataGridBackgroundFillStyle: chartBackgroundFillStyle,
        dataGridBackgroundStrokeStyle: emptyLine,
        dataGridTitleFont: fontChartTitles,
        dataGridTitleFillStyle: textFillStyle,
        dataGridTitleShadow: labelShadow,
        dataGridTextShadow: labelShadow,
        dataGridTextFont: fontOther,
        dataGridTextFillStyle: textFillStyle,
        dataGridCellBackgroundFillStyle: seriesBackgroundFillStyle,
        dataGridBorderStrokeStyle: uiBackgroundStrokeStyle,
        dataGridScrollBarBackgroundFillStyle: new SolidFill({
            color: ColorRGBA(30, 30, 30),
        }),
        dataGridScrollBarBackgroundStrokeStyle: emptyLine,
        dataGridScrollBarFillStyle: new SolidFill({ color: ColorRGBA(30, 30, 30) }),
        dataGridScrollBarStrokeStyle: uiBackgroundStrokeStyle,
        dataGridScrollBarButtonFillStyle: new SolidFill({
            color: ColorRGBA(30, 30, 30),
        }),
        dataGridScrollBarButtonStrokeStyle: uiBackgroundStrokeStyle,
        dataGridScrollBarButtonArrowFillStyle: uiButtonFillStyle,
        dataGridScrollBarThickness: 20,
        dataGridCellPadding: 5,
        textSeriesShadow: labelShadow,
        sparkLineChartStrokeStyle: seriesStrokeStylePalette(0),
        sparkPointChartFillStyle: seriesFillStylePalette(0),
        sparkBarChartFillStyle: seriesFillStylePalette(0),
        sparkBarChartStrokeStyle: dataBorderStrokePalette(0),
        sparkAreaChartFillStyle: areaSeriesFillStylePaletteGradientUp(0),
        sparkAreaChartStrokeStyle: dataBorderStrokePalette(0),
        sparkPieChartFillStyle: seriesFillStylePalette,
        sparkPieChartStrokeStyle: uiBackgroundStrokeStyle,
        sparkChartBandFillStyle: bandFillStyle,
        sparkChartBandStrokeStyle: bandStrokeStyle,
        sparkChartConstantLineStrokeStyle: constantLineStrokeStyle,
        spiderChartBackgroundFillStyle: chartBackgroundFillStyle,
        spiderChartBackgroundStrokeStyle: emptyLine,
        spiderChartTitleFont: fontChartTitles,
        spiderChartTitleFillStyle: textFillStyle,
        spiderChartTitleShadow: labelShadow,
        spiderChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        spiderChartSeriesBackgroundStrokeStyle: emptyLine,
        spiderChartWebStyle: tickStyleMajor.gridStrokeStyle,
        spiderChartScaleLabelFillStyle: textFillStyle,
        spiderChartScaleLabelFont: fontOther,
        spiderChartAxisLabelFillStyle: textFillStyle,
        spiderChartAxisLabelFont: fontAxisTitles,
        spiderChartAxisStrokeStyle: axisStrokeStyle,
        spiderChartAxisNibStrokeStyle: emptyLine,
        spiderSeriesFillStyle: areaSeriesFillStylePaletteSolid,
        spiderSeriesStrokeStyle: dataBorderStrokePalette,
        spiderSeriesPointFillStyle: seriesFillStylePalette,
        spiderChartScaleLabelShadow: labelShadow,
        pieChartBackgroundFillStyle: chartBackgroundFillStyle,
        pieChartBackgroundStrokeStyle: emptyLine,
        pieChartTitleFont: fontAxisTitles,
        pieChartTitleFillStyle: textFillStyle,
        pieChartTitleShadow: labelShadow,
        pieChartSliceFillStylePalette: seriesFillStylePalette,
        pieChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        pieChartSliceLabelFont: fontOther,
        pieChartSliceLabelFillStyle: textFillStyle,
        pieChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        pieChartSliceLabelShadow: labelShadow,
        funnelChartBackgroundFillStyle: chartBackgroundFillStyle,
        funnelChartBackgroundStrokeStyle: emptyLine,
        funnelChartTitleFont: fontChartTitles,
        funnelChartTitleFillStyle: textFillStyle,
        funnelChartTitleShadow: labelShadow,
        funnelChartSliceFillStylePalette: seriesFillStylePalette,
        funnelChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        funnelChartSliceLabelFont: fontOther,
        funnelChartSliceLabelFillStyle: textFillStyle,
        funnelChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        funnelChartSliceLabelShadow: labelShadow,
        pyramidChartBackgroundFillStyle: chartBackgroundFillStyle,
        pyramidChartBackgroundStrokeStyle: emptyLine,
        pyramidChartTitleFont: fontChartTitles,
        pyramidChartTitleFillStyle: textFillStyle,
        pyramidChartTitleShadow: labelShadow,
        pyramidChartSliceFillStylePalette: seriesFillStylePalette,
        pyramidChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        pyramidChartSliceLabelFont: fontOther,
        pyramidChartSliceLabelFillStyle: textFillStyle,
        pyramidChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        pyramidChartSliceLabelShadow: labelShadow,
        gaugeChartValueLabelFont: fontOther.setSize(60),
        gaugeChartUnitLabelFont: fontOther.setSize(40),
        gaugeChartTickFont: fontOther.setSize(30),
        gaugeChartBarThickness: 40,
        gaugeChartValueIndicatorThickness: 10,
        gaugeChartRoundedEdges: true,
        gaugeChartNeedleLength: 40,
        gaugeChartStartAngle: 225,
        gaugeChartEndAngle: -45,
        gaugeChartNeedleAlignment: 0,
        gaugeChartGapBetweenBarAndValueIndicators: 10,
        gaugeChartTickFillStyle: textFillStyle,
        gaugeChartBarGradient: true,
        gaugeChartBarStrokeStyle: emptyLine,
        gaugeChartUnitLabelFillStyle: textFillStyle,
        gaugeChartValueLabelFillStyle: textFillStyle,
        gaugeChartBarColor: options.dataColors[0],
        gaugeChartGlowColor: ColorRGBA(255, 255, 255, 64),
        gaugeChartNeedleFillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255) }),
        gaugeChartNeedleThickness: 10,
        gaugeChartNeedleStrokeStyle: new SolidLine({
            thickness: 2,
            fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 0) }),
        }),
        gaugeChartBackgroundFillStyle: chartBackgroundFillStyle,
        gaugeChartBackgroundStrokeStyle: emptyLine,
        gaugeChartTitleFont: fontChartTitles,
        gaugeChartTitleFillStyle: textFillStyle,
        gaugeChartTitleShadow: labelShadow,
        treeMapChartBackgroundFillStyle: chartBackgroundFillStyle,
        treeMapChartBackgroundStrokeStyle: emptyLine,
        treeMapChartParentColor: isDark ? ColorRGBA(24, 30, 33) : ColorRGBA(217, 217, 217),
        treeMapChartNodeColors: options.dataColors.map((color) => color.setA(125)),
        treeMapChartNodeStrokeStyle: new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 0) }) }),
        treeMapChartTitleFillStyle: textFillStyle,
        treeMapChartTitleShadow: labelShadow,
        treeMapChartTitleFont: fontChartTitles,
        treeMapChartPathLabelFillStyle: textFillStyle,
        treeMapChartPathLabelFont: fontOther,
        treeMapChartLabelHeaderFillStyle: textFillStyle,
        treeMapChartLabelHeaderFont: fontOther.setWeight('bold'),
        treeMapChartLabelFillStyle: textFillStyle,
        treeMapChartLabelFont: fontOther,
        treeMapChartCornerRadius: 8,
        uiPanelBackgroundFillStyle: chartBackgroundFillStyle,
        uiPanelBackgroundStrokeStyle: emptyLine,
        onScreenMenuBackgroundColor: ColorRGBA(254, 204, 0, 0.7),
        parallelCoordinateChartBackgroundFillStyle: chartBackgroundFillStyle,
        parallelCoordinateChartBackgroundStrokeStyle: emptyLine,
        parallelCoordinateChartTitleFont: fontChartTitles,
        parallelCoordinateChartTitleFillStyle: textFillStyle,
        parallelCoordinateChartTitleShadow: labelShadow,
        parallelCoordinateChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        parallelCoordinateChartSeriesBackgroundStrokeStyle: emptyLine,
        parallelCoordinateChartSeriesColor: StylePalette(options.dataColors, (color) => color),
        parallelCoordinateChartSeriesColorUnselected: isDark ? ColorRGBA(255, 255, 255, 40) : ColorRGBA(0, 0, 0, 40),
        parallelCoordinateChartSeriesLineThickness: 2,
        parallelCoordinateAxisTitleFont: fontAxisTitles,
        parallelCoordinateAxisTitleFillStyle: textFillStyle,
        parallelCoordinateAxisNumericTicks: numericTickStrategy,
        parallelCoordinateAxisDateTimeTicks: dateTimeTickStrategy,
        parallelCoordinateAxisTimeTicks: timeTickStrategy,
        parallelCoordinateAxisStrokeStyle: axisStrokeStyle,
        parallelCoordinateAxisRangeSelectorFillStyle: uiBackgroundFillStyle,
        parallelCoordinateAxisRangeSelectorStrokeStyle: uiBackgroundStrokeStyle,
        parallelCoordinateChartPointedSeriesLineStyle: seriesStrokeStylePalette(0),
        parallelCoordinateAxisBackgroundFillStyle: new LinearGradientFill({
            angle: 90,
            stops: [
                { offset: 0.0, color: options.isDark ? ColorRGBA(0, 0, 0, 0) : ColorRGBA(255, 255, 255, 0) },
                { offset: 1.0, color: options.isDark ? ColorRGBA(0, 0, 0, 255) : ColorRGBA(255, 255, 255, 180) },
            ],
        }),
        uiButtonFillStyle,
        uiButtonFillStyleHidden,
        uiButtonStrokeStyle: options.isDark
            ? emptyLine
            : new SolidLine({
                  thickness: 1,
                  fillStyle: new SolidFill({ color: colorBlack }),
              }),
        uiButtonSize: 10,
        uiBackgroundFillStyle,
        uiBackgroundStrokeStyle,
        uiTextFillStyle: textFillStyle,
        uiTextFillStyleHidden,
        uiTextFont: fontOther,
        uiTextPadding: 5,
        legendTitleFillStyle: textFillStyle,
        legendTitleFont: fontLegendTitle,
        legendBorderRadius: 8,
        legendPadding: 5,
        legendLUTLabelMargin: 7,
        legendLUTUnitLabelMargin: 7,
        legendLUTLengthHorizontal: 160,
        legendLUTThicknessHorizontal: 15,
        legendLUTLengthVertical: 140,
        legendLUTThicknessVertical: 25,
        cursorTickMarkerXBackgroundFillStyle: uiBackgroundFillStyle,
        cursorTickMarkerXBackgroundStrokeStyle: uiBackgroundStrokeStyle,
        cursorTickMarkerXTextFillStyle: textFillStyle,
        cursorTickMarkerXTextFont: fontOther,
        cursorTickMarkerYBackgroundFillStyle: uiBackgroundFillStyle,
        cursorTickMarkerYBackgroundStrokeStyle: uiBackgroundStrokeStyle,
        cursorTickMarkerYTextFillStyle: textFillStyle,
        cursorTickMarkerYTextFont: fontOther,
        cursorPointMarkerSize: { x: 9, y: 9 },
        cursorPointMarkerShape: PointShape.Circle,
        cursorResultTableFillStyle: uiBackgroundFillStyle,
        cursorResultTableStrokeStyle: uiBackgroundStrokeStyle,
        cursorResultTableTextFillStyle: textFillStyle,
        cursorResultTableTextFont: fontOther,
        cursorResultTableHeaderBackgroundFillStyle: undefined,
        cursorResultTableBorderRadius: 5,
        cursorPointMarkerFillStyle: emptyFill, // NOTE: Overridden by dynamic cursor behavior
        cursorPointMarkerStrokeStyle: emptyLine,
        cursorDynamicBehavior: {
            pointMarkerFill: (dataColor) =>
                new SolidFill({ color: interpolateColor(dataColor, options.isDark ? colorBlack : colorWhite, 0.2, 230) }),
            pointMarkerStroke: (dataColor) =>
                new SolidLine({
                    thickness: 2,
                    fillStyle: new SolidFill({
                        color: interpolateColor(dataColor, options.isDark ? colorWhite : colorBlack, options.isDark ? 0.8 : 0.6, 204),
                    }),
                }),
            pointMarkerSize: (dataPointSize) => {
                return { x: dataPointSize + 3, y: dataPointSize + 3 }
            },
        },
        cursorGridStrokeStyleX: cursorGridStrokeStyle,
        cursorGridStrokeStyleY: cursorGridStrokeStyle,
        cursor3DGridStrokeStyleX: cursor3DGridStrokeStyle,
        cursor3DGridStrokeStyleY: cursor3DGridStrokeStyle,
        cursor3DGridStrokeStyleZ: cursor3DGridStrokeStyle,
        cursor3DTickStrokeStyleX: tickStyleMajor.tickStyle,
        cursor3DTickStrokeStyleY: tickStyleMajor.tickStyle,
        cursor3DTickStrokeStyleZ: tickStyleMajor.tickStyle,
        cursor3DTickLabelFillStyleX: textFillStyle,
        cursor3DTickLabelFillStyleY: textFillStyle,
        cursor3DTickLabelFillStyleZ: textFillStyle,
        cursor3DTickLabelFontX: fontOther,
        cursor3DTickLabelFontY: fontOther,
        cursor3DTickLabelFontZ: fontOther,
        cursor3DTickLabelBackgroundFillStyleX: uiBackgroundFillStyle,
        cursor3DTickLabelBackgroundFillStyleY: uiBackgroundFillStyle,
        cursor3DTickLabelBackgroundFillStyleZ: uiBackgroundFillStyle,
        cursor3DTickLabelBackgroundStrokeStyleX: uiBackgroundStrokeStyle,
        cursor3DTickLabelBackgroundStrokeStyleY: uiBackgroundStrokeStyle,
        cursor3DTickLabelBackgroundStrokeStyleZ: uiBackgroundStrokeStyle,
        cursor3DTickLabelPaddingX: { left: 4, right: 4, top: 4, bottom: 4 },
        cursor3DTickLabelPaddingY: { left: 4, right: 4, top: 4, bottom: 4 },
        cursor3DTickLabelPaddingZ: { left: 4, right: 4, top: 4, bottom: 4 },
    }
    return flatTheme
}
