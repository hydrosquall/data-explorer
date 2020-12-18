import * as React from "react";
import * as Dx from "../utilities/types";
import { AreaType, Chart, HierarchyType, LineType, NetworkType, PieceType, SummaryType, View, SemioticSettings } from "../utilities/types";
export interface Props {
    data: Dx.DataProps;
    metadata: Dx.Metadata;
    initialView: Dx.View;
    models?: {};
    expanded?: boolean;
    theme?: string;
    height?: number;
    mediaType: "application/vnd.dataresource+json";
    onMetadataChange?: ({ dx }: {
        dx: Dx.dxMetaProps;
    }, mediaType: Props["mediaType"]) => void;
    overrideSettings?: object;
    OverrideVizControls?: React.ComponentType;
    OverrideLegend?: React.ComponentType;
    additionalViews?: SemioticSettings;
    filterData?: Function;
    children?: React.ReactNode;
}
interface State {
    largeDataset: boolean;
    view: View;
    colors: string[];
    metrics: Dx.Field[];
    dimensions: Dx.Dimension[];
    selectedMetrics: string[];
    selectedDimensions: string[];
    networkType: NetworkType;
    hierarchyType: HierarchyType;
    pieceType: PieceType;
    summaryType: SummaryType;
    lineType: LineType;
    areaType: AreaType;
    chart: Chart;
    displayChart: DisplayChart;
    primaryKey: string[];
    data: Dx.Datapoint[];
    trendLine: Dx.TrendLineType;
    marginalGraphics: Dx.SummaryType;
    barGrouping: Dx.BarGroupingType;
    editable: boolean;
    showLegend: boolean;
    facetCharts?: Chart[];
    facets?: Dx.facetProps[];
    schema: Dx.Schema;
    overrideSettings?: object;
    filteredData?: Dx.Datapoint[];
    props: Props;
}
interface DisplayChart {
    [chartKey: string]: React.ReactNode;
}
declare class DataExplorer extends React.PureComponent<Partial<Props>, State> {
    static MIMETYPE: Props["mediaType"];
    static defaultProps: {
        metadata: {
            dx: {};
        };
        height: number;
        mediaType: "application/vnd.dataresource+json";
        initialView: string;
        overrideSettings: {};
        additionalViews: {};
    };
    constructor(props: Props);
    componentDidMount(): void;
    filterData: (filterFn: Function, useBaseData?: boolean | undefined) => void;
    updateChart: (updatedState: Partial<State>) => void;
    setView: (view: View) => void;
    updateMetadata: (overrideProps: object) => void;
    setGrid: () => void;
    setColor: (newColorArray: string[]) => void;
    setLineType: (selectedLineType: LineType) => void;
    setAreaType: (selectedAreaType: AreaType) => void;
    updateDimensions: (selectedDimension: string) => void;
    updateMetrics: (selectedMetric: string) => void;
    generateFacets: (name: string) => (onWhat: "dimension" | "metric" | "vizType", which?: string | undefined) => void;
    render(): JSX.Element;
}
export { DataExplorer as default, DataExplorer };
