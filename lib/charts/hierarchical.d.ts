/// <reference types="react" />
import * as Dx from "../utilities/types";
interface HierarchicalOptions {
    hierarchyType: Dx.HierarchyType;
    chart: Dx.Chart;
    selectedDimensions: Dx.ChartOptions["selectedDimensions"];
    primaryKey: Dx.ChartOptions["primaryKey"];
    colors: Dx.ChartOptions["colors"];
}
export declare const semioticHierarchicalChart: (data: Dx.DataProps["data"], schema: Dx.DataProps["schema"], options: HierarchicalOptions, colorHashOverride?: {
    key?: string | undefined;
} | undefined, colorDimOverride?: string | undefined) => {
    frameSettings?: undefined;
    colorDim?: undefined;
    colorHash?: undefined;
} | {
    frameSettings: {
        edges: {
            id: string;
            values: {
                key: string;
                values: any;
                value: undefined;
            }[];
        };
        edgeStyle: () => {
            fill: string;
            stroke: string;
        };
        nodeStyle: (node: {
            depth: number;
        }) => {
            fill: string;
            stroke: string;
            strokeOpacity: number;
        };
        networkType: {
            type: "partition" | "dendrogram" | "treemap";
            projection: string | false;
            hierarchySum: (node: {
                [index: string]: number;
            }) => number;
            hierarchyChildren: (node: {
                values: Array<{}>;
            }) => {}[];
            padding: number;
            zoom: boolean;
        };
        edgeRenderKey: (edge: object, index: number) => number;
        nodeIDAccessor: (d: any, i: any) => any;
        baseMarkProps: {
            forceUpdate: boolean;
        };
        margin: {
            left: number;
            right: number;
            top: number;
            bottom: number;
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
        })[];
        svgAnnotationRules: (annotation: any) => JSX.Element | null;
        htmlAnnotationRules: (annotation: any) => null | undefined;
        tooltipContent: (hoveredDatapoint: Dx.Datapoint) => JSX.Element;
    };
    colorDim: string;
    colorHash: any;
};
export {};
