/// <reference types="react" />
import * as Dx from "../utilities/types";
interface VizControlParams {
    view: Dx.View;
    chart: Dx.Chart;
    metrics: Dx.Field[];
    dimensions: Dx.Dimension[];
    updateChart: (options: any) => void;
    selectedDimensions: string[];
    selectedMetrics: string[];
    hierarchyType: Dx.HierarchyType;
    summaryType: Dx.SummaryType;
    networkType: string;
    setLineType: (lineType: Dx.LineType) => void;
    updateMetrics: (name: string) => void;
    generateFacets: (metricName: string) => (onWhat: "dimension" | "metric" | "vizType", which?: string) => void;
    updateDimensions: (name: string) => void;
    lineType: Dx.LineType;
    areaType: Dx.AreaType;
    setAreaType: (label: Dx.AreaType) => void;
    data: Dx.Datapoint[];
    trendLine: Dx.TrendLineType;
    marginalGraphics: Dx.SummaryType;
    barGrouping: Dx.BarGroupingType;
}
declare const _default: ({ view, chart, metrics, dimensions, updateChart, selectedDimensions, selectedMetrics, hierarchyType, trendLine, marginalGraphics, barGrouping, summaryType, networkType, setLineType, updateMetrics, updateDimensions, lineType, areaType, setAreaType, data, generateFacets }: VizControlParams) => JSX.Element;
export default _default;
