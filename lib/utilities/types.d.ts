export interface Metric extends Field {
    type: "integer" | "datetime" | "number";
    extent: [any, any];
    unfilteredExtent: [any, any];
}
export interface Dimension extends Field {
    type: "string" | "boolean" | "datetime";
    cardinality: number;
    cardinalValues: string[];
    unfilteredCardinality: number;
    unfilteredCardinalValues: string[];
}
export interface ChartOptions {
    metrics: Metric[];
    dimensions: Dimension[];
    chart: Chart;
    colors: string[];
    height: number;
    lineType: LineType;
    areaType: AreaType;
    selectedDimensions: string[];
    selectedMetrics: Metric[];
    pieceType: PieceType;
    summaryType: SummaryType;
    networkType: NetworkType;
    hierarchyType: HierarchyType;
    primaryKey: string[];
    setColor: (color: string[]) => void;
}
export interface DataProps {
    schema: Schema;
    data: Datapoint[];
}
export interface facetProps {
    dimFacet?: {
        dim: string;
        value: string;
    };
    data?: DataProps;
    metadata?: Metadata;
    initialView?: View;
}
export interface dxMetaProps {
    view?: View;
    lineType?: LineType;
    areaType?: AreaType;
    selectedDimensions?: string[];
    selectedMetrics?: string[];
    pieceType?: PieceType;
    summaryType?: SummaryType;
    networkType?: NetworkType;
    hierarchyType?: HierarchyType;
    trendLine?: TrendLineType;
    marginalGraphics?: SummaryType;
    barGrouping?: BarGroupingType;
    colors?: string[];
    chart?: Chart;
    facets?: facetProps[];
}
export interface Metadata {
    dx: dxMetaProps;
    sampled?: boolean;
}
export interface Schema {
    fields: Field[];
    pandas_version?: string;
    primaryKey?: string[];
}
export declare const defaultPrimaryKey = "dx-default-pk";
export interface Field {
    name: string;
    type: string;
}
export interface Datapoint {
    [fieldName: string]: any;
}
export declare type SemioticSettings = {
    [fieldName: string]: {
        Frame: Function;
        controls: string;
        chartGenerator: Function;
        FacetFrame: Function;
    };
};
export interface LineCoordinate {
    value: number;
    x: number;
    label: string;
    color: string;
    originalData: Datapoint;
}
export interface LineData {
    color: string;
    label: string;
    type: "number" | "integer" | "datetime";
    coordinates: LineCoordinate[];
}
export interface Chart {
    metric1: string;
    metric2: string;
    metric3: string;
    metric4: string;
    dim1: string;
    dim2: string;
    dim3: string;
    networkLabel: string;
    timeseriesSort: string;
}
export declare type LineType = "line" | "stackedarea" | "bumparea" | "stackedpercent";
export declare type AreaType = "hexbin" | "heatmap" | "contour";
export declare type BarGroupingType = "Stacked" | "Clustered";
export declare type TrendLineType = "none" | "linear" | "polynomial" | "logarithmic" | "exponential" | "power";
export declare type SummaryType = "none" | "violin" | "ridgeline" | "joy" | "histogram" | "heatmap" | "boxplot";
export declare type PieceType = "bar" | "point" | "swarm" | "clusterbar";
export declare type HierarchyType = "dendrogram" | "treemap" | "partition" | "sunburst";
export declare type NetworkType = "force" | "sankey" | "arc" | "matrix";
export declare type View = "line" | "bar" | "scatter" | "grid" | "network" | "summary" | "hexbin" | "parallel" | "hierarchy" | string;
export declare type PrimitiveImmutable = string | number | boolean | null;
export declare type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
export interface JSONObject {
    [key: string]: JSONType;
}
export interface JSONArray extends Array<JSONType> {
}
/**
 *
 * A custom `data-explorer` component is made up of at least one `viz` component
 * and an optional toolbar. Additional components may be added in the future.
 *
 * The root `data-explorer` uses the following `componentType`'s to determine
 * which props to pass down. If a child component does not have one of these types,
 * it won't be passed any additional props.
 *
 * At the moment, these types are just an implementation detail, but in the future
 * this could be used as a "public api" for creating custom components
 * known to `data-explorer`.
 *
 */
export declare type ComponentType = "viz" | "toolbar";
