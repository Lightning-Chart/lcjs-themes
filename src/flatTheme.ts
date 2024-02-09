import {
    Color,
    ColorRGBA,
    DashedLine,
    DateTimeTickStrategy,
    FontSettings,
    NumericTickStrategy,
    PointShape,
    PointStyle3D,
    SolidFill,
    SolidLine,
    StipplePatterns,
    Theme,
    TickStyle,
    TimeTickStrategy,
    emptyFill,
    emptyLine,
    emptyTick,
    transparentFill,
} from '@arction/lcjs'

const colorMissing = ColorRGBA(0, 255, 0)

const StylePalette = <T, R>(array: T[], clbk: (value: T) => R): ((i: number) => R) => {
    const values = array.map(clbk)
    return (i: number) => values[i % values.length]
}

/**
 * Configuration options interface for [[makeFlatTheme]].
 */
export type FlatThemeOptions = {
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
 */
export const makeFlatTheme = (options: FlatThemeOptions): Theme => {
    const whiteFillStyle = new SolidFill({ color: ColorRGBA(255, 255, 255) })
    const blackFillStyle = new SolidFill({ color: ColorRGBA(0, 0, 0) })
    //
    //
    //
    const isDark = options.isDark !== undefined ? options.isDark : true
    const lcjsBackgroundFillStyle = new SolidFill({
        color: options.backgroundColor,
    })
    const highlightColorOffset = isDark ? ColorRGBA(60, 60, 60, 60) : ColorRGBA(-60, -60, -60, 60)
    const highlightColorOffsetAxisOverlay = isDark ? ColorRGBA(255, 255, 255, 40) : ColorRGBA(0, 0, 0, 40)
    const dashboardSplitterStyle = new SolidLine({
        thickness: 4,
        fillStyle: new SolidFill({
            color: options.dashboardSplitterColor || colorMissing,
        }),
    })
    const chartBackgroundFillStyle = lcjsBackgroundFillStyle
    const seriesBackgroundFillStyle = transparentFill
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
    const dataAreaSolidFillPalette = StylePalette(options.dataColors, (color) => new SolidFill({ color: color.setA(100) }))
    const seriesStrokeStylePalette = dataSolidLinePalette
    const seriesFillStylePalette = dataSolidFillPalette
    const areaSeriesFillStylePalette = dataAreaSolidFillPalette
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
    const tickStyle = new TickStyle({
        gridStrokeStyle: new SolidLine({
            thickness: 1,
            fillStyle: new SolidFill({ color: options.gridLineColor }),
        }),
        tickStyle: emptyLine,
        tickLength: 7,
        tickPadding: 0,
        labelFont: fontOther,
        labelPadding: 0,
        labelFillStyle: textFillStyle,
    })
    const numericTickStrategy = new NumericTickStrategy({
        extremeTickStyle: emptyTick,
        majorTickStyle: tickStyle,
        minorTickStyle: tickStyle,
    })
    const dateTimeTickStrategy = new DateTimeTickStrategy({
        greatTickStyle: tickStyle.setTickLength(50).setTickPadding(-14),
        majorTickStyle: tickStyle,
        minorTickStyle: tickStyle,
    })
    const timeTickStrategy = new TimeTickStrategy({
        majorTickStyle: tickStyle,
        minorTickStyle: tickStyle,
    })
    const cursorGridStrokeStyle = new DashedLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
        pattern: StipplePatterns.DashedEqual,
        patternScale: 3,
    })
    const bandFillStyle = zoomRectangleFillStyle
    const bandStrokeStyle = zoomRectangleStrokeStyle
    const constantLineStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: isDark ? whiteFillStyle : blackFillStyle,
    })
    const uiButtonFillStyle = isDark ? whiteFillStyle : blackFillStyle
    const uiButtonFillStyleHidden = new SolidFill({ color: options.isDark ? ColorRGBA(70, 70, 70, 255) : ColorRGBA(170, 170, 170, 255) })
    const uiBackgroundFillStyle = new SolidFill({
        color: options.uiBackgroundColor,
    })
    const uiBackgroundStrokeStyle = new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: options.uiBorderColor }),
    })

    const flatTheme: Theme = {
        isDark,
        effect: undefined,
        effectsText: false,
        effectsDashboardSplitters: false,
        lcjsBackgroundFillStyle,
        lcjsBackgroundStrokeStyle: emptyLine,
        highlightColorOffset,
        highlightColorOffsetAxisOverlay,
        dashboardSplitterStyle,
        chartXYBackgroundFillStyle: chartBackgroundFillStyle,
        chartXYBackgroundStrokeStyle: emptyLine,
        chartXYTitleFont: fontChartTitles,
        chartXYTitleFillStyle: textFillStyle,
        chartXYSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        chartXYSeriesBackgroundStrokeStyle: emptyLine,
        chartXYZoomingRectangleFillStyle: zoomRectangleFillStyle,
        chartXYZoomingRectangleStrokeStyle: zoomRectangleStrokeStyle,
        chartXYFittingRectangleFillStyle: zoomRectangleFillStyle,
        chartXYFittingRectangleStrokeStyle: zoomRectangleStrokeStyle,
        lineSeriesStrokeStyle: seriesStrokeStylePalette,
        pointLineSeriesStrokeStyle: seriesStrokeStylePalette,
        pointLineSeriesFillStyle: seriesFillStylePalette,
        pointSeriesFillStyle: seriesFillStylePalette,
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
        areaRangeSeriesFillStyle: areaSeriesFillStylePalette,
        areaRangeSeriesStrokeStyle: dataBorderStrokePalette,
        areaRangeSeriesFillStyleInverted: areaSeriesFillStylePalette,
        areaRangeSeriesStrokeStyleInverted: dataBorderStrokePalette,
        areaSeriesBipolarHighFillStyle: areaSeriesFillStylePalette,
        areaSeriesBipolarHighStrokeStyle: dataBorderStrokePalette,
        areaSeriesBipolarLowFillStyle: areaSeriesFillStylePalette,
        areaSeriesBipolarLowStrokeStyle: dataBorderStrokePalette,
        areaSeriesPositiveFillStyle: areaSeriesFillStylePalette,
        areaSeriesPositiveStrokeStyle: dataBorderStrokePalette,
        areaSeriesNegativeFillStyle: areaSeriesFillStylePalette,
        areaSeriesNegativeStrokeStyle: dataBorderStrokePalette,
        xAxisTitleFont: fontAxisTitles,
        xAxisTitleFillStyle: textFillStyle,
        xAxisStrokeStyle: axisStrokeStyle,
        xAxisNibStyle: emptyLine,
        xAxisOverlayStyle: axisOverlayStyle,
        xAxisZoomingBandFillStyle: zoomRectangleFillStyle,
        xAxisZoomingBandStrokeStyle: emptyLine,
        xAxisNumericTicks: numericTickStrategy,
        xAxisDateTimeTicks: dateTimeTickStrategy,
        xAxisTimeTicks: timeTickStrategy,
        yAxisTitleFont: fontAxisTitles,
        yAxisTitleFillStyle: textFillStyle,
        yAxisStrokeStyle: axisStrokeStyle,
        yAxisNibStyle: emptyLine,
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
        barChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
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
        },
        barChartValueLabelsAfterBars: {
            position: 'after-bar',
            formatter: (bar, category, value) => bar.chart.valueAxis.formatValue(value),
            labelFillStyle: numericTickStrategy.majorTickStyle.labelFillStyle,
            labelFont: numericTickStrategy.majorTickStyle.labelFont,
            labelMargin: 8,
            labelRotation: 0,
        },
        barChartValueLabelsInsideBars: {
            position: 'inside-bar',
            formatter: (bar, category, value) => bar.chart.valueAxis.formatValue(value),
            labelFillStyle: isDark ? whiteFillStyle : blackFillStyle,
            labelFont: numericTickStrategy.majorTickStyle.labelFont,
            labelMargin: 8,
            labelRotation: 0,
        },
        chart3DBackgroundFillStyle: chartBackgroundFillStyle,
        chart3DBackgroundStrokeStyle: emptyLine,
        chart3DTitleFont: fontChartTitles,
        chart3DTitleFillStyle: textFillStyle,
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
        polarChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        polarChartSeriesBackgroundStrokeStyle: emptyLine,
        polarSectorFillStyle: bandFillStyle,
        polarSectorStrokeStyle: bandStrokeStyle,
        polarAmplitudeAxisTitleFont: fontAxisTitles,
        polarAmplitudeAxisTitleFillStyle: textFillStyle,
        polarAmplitudeAxisStrokeStyle: axisStrokeStyle,
        polarAmplitudeAxisNumericTicks: numericTickStrategy,
        polarAmplitudeAxisDateTimeTicks: dateTimeTickStrategy,
        polarAmplitudeAxisTimeTicks: timeTickStrategy,
        polarRadialAxisTitleFont: fontAxisTitles,
        polarRadialAxisTitleFillStyle: textFillStyle,
        polarRadialAxisStrokeStyle: axisStrokeStyle,
        polarRadialAxisTickStyle: tickStyle,
        polarLineSeriesStrokeStyle: seriesStrokeStylePalette,
        polarPointLineSeriesFillStyle: seriesFillStylePalette,
        polarPointLineSeriesStrokeStyle: seriesStrokeStylePalette,
        polarPointSeriesFillStyle: seriesFillStylePalette,
        polarPolygonSeriesFillStyle: areaSeriesFillStylePalette,
        polarPolygonSeriesStrokeStyle: dataBorderStrokePalette,
        polarAreaSeriesFillStyle: areaSeriesFillStylePalette,
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
        dataGridScrollBarButtonArrowStrokeStyle: emptyLine,
        sparkLineChartStrokeStyle: seriesStrokeStylePalette(0),
        sparkPointChartFillStyle: seriesFillStylePalette(0),
        sparkBarChartFillStyle: seriesFillStylePalette(0),
        sparkBarChartStrokeStyle: dataBorderStrokePalette(0),
        sparkAreaChartFillStyle: areaSeriesFillStylePalette(0),
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
        spiderChartSeriesBackgroundFillStyle: seriesBackgroundFillStyle,
        spiderChartSeriesBackgroundStrokeStyle: emptyLine,
        spiderChartWebStyle: tickStyle.gridStrokeStyle,
        spiderChartScaleLabelFillStyle: textFillStyle,
        spiderChartScaleLabelFont: fontOther,
        spiderChartAxisLabelFillStyle: textFillStyle,
        spiderChartAxisLabelFont: fontAxisTitles,
        spiderChartAxisStrokeStyle: axisStrokeStyle,
        spiderChartAxisNibStrokeStyle: emptyLine,
        spiderSeriesFillStyle: areaSeriesFillStylePalette,
        spiderSeriesStrokeStyle: dataBorderStrokePalette,
        spiderSeriesPointFillStyle: seriesFillStylePalette,
        pieChartBackgroundFillStyle: chartBackgroundFillStyle,
        pieChartBackgroundStrokeStyle: emptyLine,
        pieChartTitleFont: fontAxisTitles,
        pieChartTitleFillStyle: textFillStyle,
        pieChartSliceFillStylePalette: seriesFillStylePalette,
        pieChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        pieChartSliceLabelFont: fontOther,
        pieChartSliceLabelFillStyle: textFillStyle,
        pieChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        funnelChartBackgroundFillStyle: chartBackgroundFillStyle,
        funnelChartBackgroundStrokeStyle: emptyLine,
        funnelChartTitleFont: fontChartTitles,
        funnelChartTitleFillStyle: textFillStyle,
        funnelChartSliceFillStylePalette: seriesFillStylePalette,
        funnelChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        funnelChartSliceLabelFont: fontOther,
        funnelChartSliceLabelFillStyle: textFillStyle,
        funnelChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        pyramidChartBackgroundFillStyle: chartBackgroundFillStyle,
        pyramidChartBackgroundStrokeStyle: emptyLine,
        pyramidChartTitleFont: fontChartTitles,
        pyramidChartTitleFillStyle: textFillStyle,
        pyramidChartSliceFillStylePalette: seriesFillStylePalette,
        pyramidChartSliceStrokeStyle: uiBackgroundStrokeStyle,
        pyramidChartSliceLabelFont: fontOther,
        pyramidChartSliceLabelFillStyle: textFillStyle,
        pyramidChartConnectorStrokeStyle: uiBackgroundStrokeStyle,
        gaugeChartBackgroundFillStyle: chartBackgroundFillStyle,
        gaugeChartBackgroundStrokeStyle: emptyLine,
        gaugeChartTitleFont: fontChartTitles,
        gaugeChartTitleFillStyle: textFillStyle,
        gaugeChartEmptyGaugeFillStyle: isDark ? blackFillStyle : whiteFillStyle,
        gaugeChartEmptyGaugeStrokeStyle: uiBackgroundStrokeStyle,
        gaugeChartGaugeFillStyle: primaryDataFillStyle,
        gaugeChartIntervalLabelsFillStyle: textFillStyle,
        gaugeChartIntervalLabelsFont: fontOther,
        gaugeChartValueLabelFillStyle: textFillStyle,
        gaugeChartValueLabelFont: fontOther,
        uiPanelBackgroundFillStyle: chartBackgroundFillStyle,
        uiPanelBackgroundStrokeStyle: emptyLine,
        onScreenMenuBackgroundColor: ColorRGBA(254, 204, 0, 0.7),
        uiButtonFillStyle,
        uiButtonFillStyleHidden,
        uiButtonStrokeStyle: uiBackgroundStrokeStyle,
        uiButtonSize: 10,
        uiBackgroundFillStyle,
        uiBackgroundStrokeStyle,
        uiTextFillStyle: textFillStyle,
        uiTextFillStyleHidden: new SolidFill({ color: options.isDark ? ColorRGBA(70, 70, 70, 255) : ColorRGBA(170, 170, 170, 255) }),
        uiTextFont: fontOther,
        legendTitleFillStyle: textFillStyle,
        legendTitleFont: fontLegendTitle,
        cursorTickMarkerXBackgroundFillStyle: uiBackgroundFillStyle,
        cursorTickMarkerXBackgroundStrokeStyle: uiBackgroundStrokeStyle,
        cursorTickMarkerXTextFillStyle: textFillStyle,
        cursorTickMarkerXTextFont: fontOther,
        cursorTickMarkerYBackgroundFillStyle: uiBackgroundFillStyle,
        cursorTickMarkerYBackgroundStrokeStyle: uiBackgroundStrokeStyle,
        cursorTickMarkerYTextFillStyle: textFillStyle,
        cursorTickMarkerYTextFont: fontOther,
        cursorPointMarkerSize: { x: 9, y: 9 },
        cursorPointMarkerShape: PointShape.Cross,
        cursorPointMarkerFillStyle: cursorGridStrokeStyle.getFillStyle(),
        cursorResultTableFillStyle: uiBackgroundFillStyle,
        cursorResultTableStrokeStyle: uiBackgroundStrokeStyle,
        cursorResultTableTextFillStyle: textFillStyle,
        cursorResultTableTextFont: fontOther,
        cursorGridStrokeStyleX: cursorGridStrokeStyle,
        cursorGridStrokeStyleY: cursorGridStrokeStyle,
        chartMarkerPointMarkerFillStyle: isDark ? whiteFillStyle : blackFillStyle,
        chartMarkerPointMarkerSize: { x: 20, y: 20 },
        chartMarkerPointMarkerShape: PointShape.Star,
        seriesMarkerPointMarkerFillStyle: isDark ? whiteFillStyle : blackFillStyle,
        seriesMarkerPointMarkerSize: { x: 9, y: 9 },
        seriesMarkerPointMarkerShape: PointShape.Cross,
    }
    return flatTheme
}
