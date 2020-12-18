/// <reference types="react" />
import * as Dx from "../utilities/types";
interface NodeObject {
    id: string;
    nodeSize?: number;
    degree: number;
    x: number;
    y: number;
    value: number;
}
interface EdgeObject {
    source: NodeObject;
    target: NodeObject;
    weight: number;
    value: number;
}
interface NetworkOptions {
    chart: Dx.Chart;
    colors: Dx.ChartOptions["colors"];
    networkType: Dx.NetworkType;
}
export declare const semioticNetwork: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: NetworkOptions, colorHashOverride?: {
    key?: string | undefined;
} | undefined, colorDimOverride?: string | undefined) => {
    frameSettings?: undefined;
    colorDim?: undefined;
    colorHash?: undefined;
} | {
    frameSettings: {
        edges: EdgeObject[];
        edgeType: string | false;
        edgeStyle: ((edge: EdgeObject) => {
            fill: Dx.JSONType;
            stroke: Dx.JSONType;
            strokeOpacity: number;
        }) | ((edge: EdgeObject) => {
            fill: Dx.JSONType;
            stroke: string;
        });
        nodeStyle: (node: NodeObject) => {
            fill: Dx.JSONType;
            stroke: Dx.JSONType;
            strokeOpacity: number;
        };
        nodeSizeAccessor: (node: NodeObject) => number;
        networkType: {
            type: Dx.NetworkType;
            iterations: number;
        };
        hoverAnnotation: ({
            type: string;
            style?: undefined;
        } | {
            type: string;
            style: {
                stroke: string;
                strokeOpacity: number;
                strokeWidth: number;
                fill: string;
            };
        })[] | ({
            type: string;
            style?: undefined;
        } | {
            type: string;
            style: {
                fill: string;
                fillOpacity: number;
            };
        })[];
        tooltipContent: (hoveredNode: NodeObject) => JSX.Element;
        nodeLabels: boolean | ((d: NodeObject) => JSX.Element | null);
        margin: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
    };
    colorDim: string;
    colorHash: any;
};
export {};
