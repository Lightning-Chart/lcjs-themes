import {
  DateTimeTickStrategy,
  emptyTick,
  NumericTickStrategy,
  TimeTickStrategy,
  VisibleTicks,
  Color,
  ColorRGBA,
  emptyFill,
  emptyLine,
  FontSettings,
  PointStyle3D,
  SolidFill,
  SolidLine,
  Theme,
  transparentFill,
} from "@arction/lcjs";

// TODO
const TODOfill = new SolidFill({ color: ColorRGBA(0, 255, 0) });
const TODOstroke = new SolidLine({ thickness: 2, fillStyle: TODOfill });

const StylePalette = <T, R>(
  array: T[],
  clbk: (value: T) => R
): ((i: number) => R) => {
  const values = array.map(clbk);
  return (i: number) => values[i % values.length];
};

/**
 * Configuration options interface for [[makeLightningChartThemeFlat]].
 */
export type FlatThemeOptions = {
  /**
   * Color of charts background.
   */
  backgroundColor: Color;
  /**
   * Color of all text.
   */
  textColor: Color;
  /**
   * List of colors for series and other components representing data.
   *
   * When many colors are supplied, making several components within 1 chart will result in different colors being picked.
   */
  dataColors: Color[];
  /**
   * Color of Axis lines.
   */
  axisColor: Color;
  /**
   * Color of tick gridlines.
   */
  gridLineColor: Color;
  /**
   * Color of UI backgrounds, most notably LegendBox and cursor result tables.
   */
  uiBackgroundColor: Color;
  /**
   * Color of UI background borders, most notably LegendBox and cursor result tables.
   */
  uiBorderColor: Color;
  /**
   * Font family of all text. Same as CSS `font-family`.
   */
  fontFamily: string;
};

/**
 * Factory function for creating a LightningChart JS Theme with a flat style based on very minimal configuration options.
 * @param   options - Configuration options for the created theme.
 * @returns
 */
const makeLightningChartThemeFlat = (options: FlatThemeOptions): Theme => {
  const whiteFillStyle = new SolidFill({ color: ColorRGBA(255, 255, 255) });
  //
  //
  //
  const isDark = true;
  const lcjsBackgroundFillStyle = new SolidFill({
    color: options.backgroundColor,
  });
  const highlightColorOffset = ColorRGBA(60, 60, 60, 60);
  const highlightColorOffsetAxisOverlay = ColorRGBA(255, 255, 255, 40);
  // TODO
  const dashboardSplitterStyle = TODOstroke;
  const chartBackgroundFillStyle = lcjsBackgroundFillStyle;
  const seriesBackgroundFillStyle = transparentFill;
  const fontChartTitles = new FontSettings({
    size: 18,
    family: options.fontFamily,
    weight: "normal",
    style: "normal",
  });
  const fontAxisTitles = new FontSettings({
    size: 16,
    family: options.fontFamily,
    weight: "normal",
    style: "normal",
  });
  const fontLegendTitle = new FontSettings({
    size: 14,
    family: options.fontFamily,
    weight: "normal",
    style: "normal",
  });
  const fontOther = new FontSettings({
    size: 14,
    family: options.fontFamily,
    weight: "normal",
    style: "normal",
  });
  const textFillStyle = new SolidFill({ color: options.textColor });
  const zoomRectangleFillStyle = new SolidFill({
    color: ColorRGBA(255, 255, 255, 20),
  });
  const zoomRectangleStrokeStyle = new SolidLine({
    thickness: 1,
    fillStyle: whiteFillStyle,
  });
  const primaryDataFillStyle = new SolidFill({ color: options.dataColors[0] });
  const dataSolidFillPalette = StylePalette(
    options.dataColors,
    (color) => new SolidFill({ color })
  );
  const dataSolidLinePalette = StylePalette(
    options.dataColors,
    (color) =>
      new SolidLine({ fillStyle: new SolidFill({ color }), thickness: 2 })
  );
  const dataAreaSolidFillPalette = StylePalette(
    options.dataColors,
    (color) => new SolidFill({ color: color.setA(100) })
  );
  const seriesStrokeStylePalette = dataSolidLinePalette;
  const seriesFillStylePalette = dataSolidFillPalette;
  const areaSeriesFillStylePalette = dataAreaSolidFillPalette;
  const dataBorderStrokePalette = dataSolidLinePalette;
  const pointSeries3DPointStylePalette = StylePalette(
    options.dataColors,
    (color) =>
      new PointStyle3D.Triangulated({
        shape: "sphere",
        size: 10,
        fillStyle: new SolidFill({ color }),
      })
  );
  const pointCloudSeries3DPointStylePalette = StylePalette(
    options.dataColors,
    (color) =>
      new PointStyle3D.Pixelated({
        size: 5,
        fillStyle: new SolidFill({ color }),
      })
  );
  const dataFillStylePositive = new SolidFill({
    color: ColorRGBA(176, 255, 157),
  });
  const dataFillStyleNegative = new SolidFill({
    color: ColorRGBA(255, 112, 76),
  });
  const wireframeStyle = TODOstroke;
  const axisStrokeStyle = new SolidLine({
    thickness: 1,
    fillStyle: new SolidFill({ color: options.axisColor }),
  });
  const axisOverlayStyle = new SolidFill({ color: ColorRGBA(0, 0, 0, 1) }); // NOTE: Slight opaqueness is required for this overlay becoming visible when highlighted.
  const tickStyle = new VisibleTicks({
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
  });
  const numericTickStrategy = new NumericTickStrategy({
    extremeTickStyle: emptyTick,
    majorTickStyle: tickStyle,
    minorTickStyle: tickStyle,
  });
  const dateTimeTickStrategy = new DateTimeTickStrategy({
    greatTickStyle: tickStyle.setTickLength(50).setTickPadding(-14),
    majorTickStyle: tickStyle,
    minorTickStyle: tickStyle,
  });
  const timeTickStrategy = new TimeTickStrategy({
    majorTickStyle: tickStyle,
    minorTickStyle: tickStyle,
  });
  // TODO
  const bandFillStyle = TODOfill;
  // TODO
  const bandStrokeStyle = TODOstroke;
  // TODO
  const constantLineStrokeStyle = TODOstroke;
  const uiButtonFillStyle = whiteFillStyle;
  const uiBackgroundFillStyle = new SolidFill({
    color: options.uiBackgroundColor,
  });
  const uiBackgroundStrokeStyle = new SolidLine({
    thickness: 1,
    fillStyle: new SolidFill({ color: options.uiBorderColor }),
  });
  const cursorGridStrokeStyle = new SolidLine({
    thickness: 1,
    fillStyle: whiteFillStyle,
  });

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
    // TODO
    boxSeriesStrokeStyle: TODOstroke,
    boxSeriesMedianStrokeStyle: new SolidLine({
      thickness: 1,
      fillStyle: new SolidFill({ color: ColorRGBA(0, 0, 0) }),
    }),
    ohlcCandleBodyFillStylePositive: dataFillStylePositive,
    ohlcCandleBodyFillStyleNegative: dataFillStyleNegative,
    ohlcCandleBodyStrokeStylePositive: emptyLine,
    ohlcCandleBodyStrokeStyleNegative: emptyLine,
    // TODO
    ohlcCandleStrokeStyle: TODOstroke,
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
    mapChartBackgroundFillStyle: chartBackgroundFillStyle,
    mapChartBackgroundStrokeStyle: emptyLine,
    mapChartTitleFont: fontChartTitles,
    mapChartTitleFillStyle: textFillStyle,
    mapChartFillStyle: primaryDataFillStyle,
    // TODO
    mapChartStrokeStyle: new SolidLine({ thickness: 1, fillStyle: TODOfill }),
    mapChartOutlierRegionFillStyle: emptyFill,
    // TODO
    mapChartOutlierRegionStrokeStyle: new SolidLine({
      thickness: 1,
      fillStyle: TODOfill,
    }),
    // TODO
    mapChartSeparateRegionFillStyle: uiBackgroundFillStyle,
    // TODO
    mapChartSeparateRegionStrokeStyle: uiBackgroundStrokeStyle,
    dataGridBackgroundFillStyle: chartBackgroundFillStyle,
    dataGridBackgroundStrokeStyle: emptyLine,
    dataGridTitleFont: fontChartTitles,
    dataGridTitleFillStyle: textFillStyle,
    dataGridTextFont: fontOther,
    dataGridTextFillStyle: primaryDataFillStyle,
    // TODO
    dataGridCellBackgroundFillStyle: TODOfill,
    // TODO
    dataGridBorderStrokeStyle: new SolidLine({
      thickness: 1,
      fillStyle: TODOfill,
    }),
    // TODO
    dataGridScrollBarBackgroundFillStyle: TODOfill,
    dataGridScrollBarBackgroundStrokeStyle: emptyLine,
    // TODO
    dataGridScrollBarFillStyle: TODOfill,
    // TODO
    dataGridScrollBarStrokeStyle: uiBackgroundStrokeStyle,
    // TODO
    dataGridScrollBarButtonFillStyle: TODOfill,
    // TODO
    dataGridScrollBarButtonStrokeStyle: uiBackgroundStrokeStyle,
    // TODO
    dataGridScrollBarButtonArrowFillStyle: uiButtonFillStyle,
    // TODO
    dataGridScrollBarButtonArrowStrokeStyle: uiBackgroundStrokeStyle,
    sparkLineChartStrokeStyle: seriesStrokeStylePalette(0),
    sparkPointChartFillStyle: seriesFillStylePalette(0),
    sparkBarChartFillStyle: seriesFillStylePalette(0),
    sparkBarChartStrokeStyle: dataBorderStrokePalette(0),
    sparkAreaChartFillStyle: areaSeriesFillStylePalette(0),
    sparkAreaChartStrokeStyle: dataBorderStrokePalette(0),
    sparkPieChartFillStyle: seriesFillStylePalette,
    // TODO
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
    // TODO
    spiderChartWebStyle: new SolidLine({ thickness: 2, fillStyle: TODOfill }),
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
    // TODO
    pieChartSliceStrokeStyle: uiBackgroundStrokeStyle,
    pieChartSliceLabelFont: fontOther,
    pieChartSliceLabelFillStyle: textFillStyle,
    // TODO
    pieChartConnectorStrokeStyle: TODOstroke,
    funnelChartBackgroundFillStyle: chartBackgroundFillStyle,
    funnelChartBackgroundStrokeStyle: emptyLine,
    funnelChartTitleFont: fontChartTitles,
    funnelChartTitleFillStyle: textFillStyle,
    funnelChartSliceFillStylePalette: seriesFillStylePalette,
    // TODO
    funnelChartSliceStrokeStyle: uiBackgroundStrokeStyle,
    funnelChartSliceLabelFont: fontOther,
    funnelChartSliceLabelFillStyle: textFillStyle,
    // TODO
    funnelChartConnectorStrokeStyle: TODOstroke,
    pyramidChartBackgroundFillStyle: chartBackgroundFillStyle,
    pyramidChartBackgroundStrokeStyle: emptyLine,
    pyramidChartTitleFont: fontChartTitles,
    pyramidChartTitleFillStyle: textFillStyle,
    pyramidChartSliceFillStylePalette: seriesFillStylePalette,
    // TODO
    pyramidChartSliceStrokeStyle: uiBackgroundStrokeStyle,
    pyramidChartSliceLabelFont: fontOther,
    pyramidChartSliceLabelFillStyle: textFillStyle,
    // TODO
    pyramidChartConnectorStrokeStyle: TODOstroke,
    gaugeChartBackgroundFillStyle: chartBackgroundFillStyle,
    gaugeChartBackgroundStrokeStyle: emptyLine,
    gaugeChartTitleFont: fontChartTitles,
    gaugeChartTitleFillStyle: textFillStyle,
    // TODO
    gaugeChartEmptyGaugeFillStyle: TODOfill,
    // TODO
    gaugeChartEmptyGaugeStrokeStyle: uiBackgroundStrokeStyle,
    gaugeChartGaugeFillStyle: primaryDataFillStyle,
    gaugeChartIntervalLabelsFillStyle: textFillStyle,
    gaugeChartIntervalLabelsFont: fontOther,
    gaugeChartValueLabelFillStyle: textFillStyle,
    gaugeChartValueLabelFont: fontOther,
    uiPanelBackgroundFillStyle: chartBackgroundFillStyle,
    uiPanelBackgroundStrokeStyle: emptyLine,
    // TODO
    onScreenMenuBackgroundColor: ColorRGBA(254, 204, 0, 0.7),
    uiButtonFillStyle,
    uiButtonStrokeStyle: uiBackgroundStrokeStyle,
    uiButtonSize: 10,
    uiBackgroundFillStyle,
    uiBackgroundStrokeStyle,
    uiTextFillStyle: textFillStyle,
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
    cursorPointMarkerFillStyle: emptyFill,
    cursorPointMarkerStrokeStyle: emptyLine,
    cursorResultTableFillStyle: uiBackgroundFillStyle,
    cursorResultTableStrokeStyle: uiBackgroundStrokeStyle,
    cursorResultTableTextFillStyle: textFillStyle,
    cursorResultTableTextFont: fontOther,
    cursorGridStrokeStyleX: cursorGridStrokeStyle,
    cursorGridStrokeStyleY: cursorGridStrokeStyle,
    // TODO
    chartMarkerPointMarkerFillStyle: TODOfill,
    chartMarkerPointMarkerStrokeStyle: emptyLine,
  };
  return flatTheme;
};

export { makeLightningChartThemeFlat };
