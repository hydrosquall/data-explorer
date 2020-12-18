/// <reference types="react" />
import { numeralFormatting } from "../utilities/utilities";
import * as Dx from "../utilities/types";
interface BarOptions {
    selectedDimensions: string[];
    chart: Dx.Chart;
    colors: string[];
    setColor: (color: string[]) => void;
    barGrouping: Dx.BarGroupingType;
    dimensions: Dx.Dimension[];
    metrics: Dx.Metric[];
}
export declare const semioticBarChart: (data: Dx.Datapoint[], schema: Dx.Schema, options: BarOptions, colorHashOverride?: any, colorDimOverride?: string | undefined) => {
    frameSettings: {
        afterElements?: JSX.Element | undefined;
        dynamicColumnWidth?: string | undefined;
        rExtent?: number[] | undefined;
        tooltipContent: ((hoveredDatapoint: {
            [key: string]: any;
        }) => JSX.Element) | ((hoveredDataPoint: {
            [key: string]: any;
            x: number;
            y: number;
        }) => JSX.Element);
        pieceHoverAnnotation?: boolean | undefined;
        type: {
            type: string;
            customMark: ((d: Dx.Datapoint, i: number, xy: {
                width: number;
                height: number;
                styleFn: (args: object) => object;
                rScale: (args: object) => number;
            }) => JSX.Element) | undefined;
        };
        data: any[];
        oAccessor: string | ((datapoint: Dx.Datapoint) => string);
        rAccessor: string;
        style: (datapoint: Dx.Datapoint) => {
            fill: any;
            stroke: any;
        };
        oPadding: number;
        oLabel: boolean | ((columnLabel: object) => JSX.Element);
        hoverAnnotation: boolean;
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
        size: number[];
    };
    colorDim: string;
    colorHash: any;
};
export {};
