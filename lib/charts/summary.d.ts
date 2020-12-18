/// <reference types="react" />
import * as Dx from "../utilities/types";
import { numeralFormatting } from "../utilities/utilities";
interface SummaryOptions {
    chart: Dx.Chart;
    colors: Dx.ChartOptions["colors"];
    primaryKey: string[];
    setColor: Dx.ChartOptions["setColor"];
    summaryType: Dx.SummaryType;
    showLegend: boolean;
    dimensions: Dx.Dimension[];
}
export declare const semioticSummaryChart: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: SummaryOptions, colorHashOverride?: any, colorDimOverride?: string | undefined) => {
    frameSettings: {
        afterElements?: JSX.Element | undefined;
        summaryType: {
            type: Dx.SummaryType;
            bins: number;
            amplitude: number;
        };
        type: string | false;
        projection: string;
        data: Dx.Datapoint[];
        oAccessor: string;
        rAccessor: string;
        summaryStyle: (summaryDatapoint: Dx.Datapoint) => {
            fill: any;
            fillOpacity: number;
            stroke: any;
        };
        style: (pieceDatapoint: Dx.Datapoint) => {
            fill: any;
            stroke: string;
        };
        oPadding: number;
        oLabel: boolean | ((columnName: string) => JSX.Element);
        margin: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        axes: {
            orient: string;
            label: string;
            tickFormat: typeof numeralFormatting;
        }[];
        baseMarkProps: {
            forceUpdate: boolean;
        };
        pieceHoverAnnotation: boolean;
        tooltipContent: (hoveredDatapoint: Dx.Datapoint) => JSX.Element;
    };
    colorDim: string;
    colorHash: any;
};
export {};
