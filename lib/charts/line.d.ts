/// <reference types="react" />
import * as Dx from "../utilities/types";
import { numeralFormatting } from "../utilities/utilities";
interface LineOptions {
    chart: Dx.Chart;
    selectedMetrics: string[];
    lineType: Dx.LineType;
    metrics: Dx.Metric[];
    primaryKey: string[];
    colors: string[];
}
export declare const semioticLineChart: (data: Dx.Datapoint[], schema: Dx.Schema, options: LineOptions) => {
    frameSettings: {
        lineType: {
            type: Dx.LineType;
            interpolator: import("d3-shape").CurveFactory;
        };
        lines: Dx.LineData[];
        xScaleType: import("d3-scale").ScaleLinear<number, number> | import("d3-scale").ScaleTime<number, number>;
        canvasLines: boolean;
        renderKey: (line: {
            coordinates: Dx.LineCoordinate[];
            label: string;
            line: string;
        }, index: number) => string;
        lineStyle: (line: Dx.LineCoordinate) => {
            fill: string;
            stroke: string;
            fillOpacity: number;
        };
        pointStyle: (point: Dx.LineData) => {
            fill: string;
            fillOpacity: number;
        };
        axes: ({
            orient: string;
            tickFormat: typeof numeralFormatting;
            ticks?: undefined;
        } | {
            orient: string;
            ticks: number;
            tickFormat: (tickValue: number) => JSX.Element;
        })[];
        hoverAnnotation: boolean;
        xAccessor: string;
        yAccessor: string;
        showLinePoints: boolean;
        margin: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        legend: {
            title: string;
            position: string;
            width: number;
            legendGroups: {
                label: string;
                styleFn: (legendItem: Dx.LineData) => {
                    fill: string;
                };
                items: Dx.LineData[];
            }[];
        };
        tooltipContent: (hoveredDatapoint: Dx.Datapoint) => JSX.Element;
    };
    colorDim: string;
    colorHash: {};
};
export {};
