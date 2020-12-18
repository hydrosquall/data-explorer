import * as Dx from "../utilities/types";
interface XYPlotOptions {
    areaType: Dx.AreaType;
    chart: Dx.ChartOptions["chart"];
    colors: Dx.ChartOptions["colors"];
    dimensions: Dx.ChartOptions["dimensions"];
    height: Dx.ChartOptions["height"];
    primaryKey: Dx.ChartOptions["primaryKey"];
    setColor: Dx.ChartOptions["setColor"];
    trendLine: Dx.TrendLineType;
    marginalGraphics: Dx.SummaryType;
}
export declare const semioticHexbin: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: XYPlotOptions, colorHashOverride?: {
    key?: string | undefined;
} | undefined, colorDimOverride?: string | undefined) => {
    frameSettings: {
        [key: string]: any;
    };
    colorDim: string;
    colorHash: any;
};
export declare const semioticScatterplot: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: XYPlotOptions, colorHashOverride?: {
    key?: string | undefined;
} | undefined, colorDimOverride?: string | undefined) => {
    frameSettings: {
        [key: string]: any;
    };
    colorDim: string;
    colorHash: any;
};
export declare const semioticXYPlot: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: XYPlotOptions, type?: string, colorHashOverride?: {
    key?: string | undefined;
} | undefined, colorDimOverride?: string | undefined) => {
    frameSettings: {
        [key: string]: any;
    };
    colorDim: string;
    colorHash: any;
};
export {};
