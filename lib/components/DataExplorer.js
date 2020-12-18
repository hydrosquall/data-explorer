var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
import DataResourceTransformGrid from "../charts/grid";
import { semioticSettings } from "../charts/settings";
import { colors } from "../utilities/settings";
import VizControls from "./VizControls";
import HTMLLegend from "./HTMLLegend";
import FacetControls from "./FacetControls";
import { Viz } from "./Viz";
import { Toolbar } from "./Toolbar";
import styled from "styled-components";
import * as Dx from "../utilities/types";
import { FacetController } from "semiotic";
import { extent } from "d3-array";
const mediaType = "application/vnd.dataresource+json";
const generateChartKey = ({ view, lineType, areaType, selectedDimensions, selectedMetrics, pieceType, summaryType, networkType, hierarchyType, trendLine, marginalGraphics, barGrouping, chart }) => `${view}-${lineType}-${areaType}-${selectedDimensions.join(",")}-${selectedMetrics.join(",")}-${pieceType}-${summaryType}-${networkType}-${hierarchyType}-${trendLine}-${marginalGraphics}-${barGrouping}-${JSON.stringify(chart)}`;
/*
  contour is an option for scatterplot
  pie is a transform on bar
*/
const defaultResponsiveSize = [440, 300];
const MetadataWarningWrapper = styled.div `
  & {
    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
`;
const MetadataWarningContent = styled.div `
  & {
    background: #cce;
    padding: 10px;
    padding-left: 20px;
  }
`;
const MetadataWarning = ({ metadata }) => {
    const warning = metadata && metadata.sampled ? (React.createElement("span", null,
        React.createElement("b", null, "NOTE:"),
        " This data is sampled")) : null;
    return (React.createElement(MetadataWarningWrapper, null, warning ? (React.createElement(MetadataWarningContent, null, warning)) : null));
};
const FlexWrapper = styled.div `
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;
const FacetWrapper = styled.div `
  display: flex;
  flex-flow: wrap;
  min-width: 0;

  .responsive-container {
    flex: 1 0 calc(50% - 10px);
    margin: 5px;
  }
`;
const SemioticWrapper = styled.div `
  width: 100%;
  .html-legend-item {
    color: var(--theme-app-fg);
  }

  .tick > path {
    stroke: lightgray;
  }

  .axis-labels,
  .ordinal-labels {
    fill: var(--theme-app-fg);
    font-size: 14px;
  }

  path.connector,
  path.connector-end {
    stroke: var(--theme-app-fg);
  }

  path.connector-end {
    fill: var(--theme-app-fg);
  }

  text.annotation-note-label,
  text.legend-title,
  .legend-item text {
    fill: var(--theme-app-fg);
    stroke: none;
  }

  .xyframe-area > path {
    stroke: var(--theme-app-fg);
  }

  .axis-baseline {
    stroke-opacity: 0.25;
    stroke: var(--theme-app-fg);
  }
  circle.frame-hover {
    fill: none;
    stroke: gray;
  }
  .rect {
    stroke: green;
    stroke-width: 5px;
    stroke-opacity: 0.5;
  }
  rect.selection {
    opacity: 0.5;
  }
`;
const processInitialData = (props, existingView, existingDX, filteredData) => {
    const { metadata, initialView, overrideSettings } = props;
    // Handle case of metadata being empty yet dx not set
    const dx = existingDX || metadata.dx || { chart: {}, facets: undefined };
    const { chart = {}, facets } = dx, nonChartDXSettings = __rest(dx, ["chart", "facets"]);
    let { fields = [], primaryKey = [] } = props.data.schema;
    // Provide a default primaryKey if none provided
    if (primaryKey.length === 0) {
        primaryKey = [Dx.defaultPrimaryKey];
        fields = [...fields, { name: Dx.defaultPrimaryKey, type: "integer" }];
    }
    const dimensions = fields
        .filter(field => field.type === "string" ||
        field.type === "boolean" ||
        field.type === "datetime")
        .map(field => (Object.assign({ cardinality: 0, cardinalValues: [], unfilteredCardinality: 0, unfilteredCardinalValues: [] }, field)));
    // Should datetime data types be transformed into js dates before getting to this resource?
    const baseData = filteredData || props.data.data;
    const data = baseData.map((datapoint, datapointIndex) => {
        const mappedDatapoint = Object.assign({}, datapoint);
        fields.forEach(field => {
            if (field.name === Dx.defaultPrimaryKey) {
                mappedDatapoint[Dx.defaultPrimaryKey] = datapointIndex;
            }
            if (field.type === "datetime") {
                mappedDatapoint[field.name] = new Date(mappedDatapoint[field.name]);
            }
        });
        return mappedDatapoint;
    });
    let largeDataset = true;
    let selectedDimensions = [];
    const metrics = fields
        .filter(field => field.type === "integer" ||
        field.type === "number" ||
        field.type === "datetime")
        .filter(field => !primaryKey.find(pkey => pkey === field.name)).map(d => (Object.assign({}, d)));
    if (data.length < 5000) {
        largeDataset = false;
    }
    if (data.length < 100000) {
        metrics.forEach(m => {
            if (!m.extent) {
                m.extent = extent(data.map(d => d[m.name]));
            }
            if (!m.unfilteredExtent) {
                if (m.type === "datetime") {
                    m.unfilteredExtent = filteredData ? extent(props.data.data.map(d => new Date(d[m.name]))) : m.extent;
                }
                else {
                    m.unfilteredExtent = filteredData ? extent(props.data.data.map(d => d[m.name])) : m.extent;
                }
            }
        });
        dimensions.forEach(dim => {
            if (dim.cardinality === 0) {
                const cardinalityHash = {};
                cardinalityHash[dim.name] = {};
                data.forEach(datapoint => {
                    const dimValue = datapoint[dim.name];
                    cardinalityHash[dim.name][dimValue] = true;
                });
                const dimKeys = Object.keys(cardinalityHash[dim.name]);
                dim.cardinality = dimKeys.length;
                dim.cardinalValues = dimKeys;
            }
            if (dim.unfilteredCardinality === 0) {
                if (!filteredData) {
                    dim.unfilteredCardinality = dim.cardinality;
                    dim.unfilteredCardinalValues = dim.cardinalValues;
                }
                const cardinalityHash = {};
                cardinalityHash[dim.name] = {};
                props.data.data.forEach(datapoint => {
                    const dimValue = datapoint[dim.name];
                    cardinalityHash[dim.name][dimValue] = true;
                });
                const dimKeys = Object.keys(cardinalityHash[dim.name]);
                dim.unfilteredCardinality = dimKeys.length;
                dim.unfilteredCardinalValues = dimKeys;
            }
        });
        selectedDimensions = dimensions
            .sort((a, b) => a.cardinality - b.cardinality)
            .filter((data, index) => index === 0)
            .map(dim => dim.name);
    }
    const finalChartSettings = Object.assign({ metric1: (metrics[0] && metrics[0].name) || "none", metric2: (metrics[1] && metrics[1].name) || "none", metric3: "none", metric4: "none", dim1: (dimensions[0] && dimensions[0].name) || "none", dim2: (dimensions[1] && dimensions[1].name) || "none", dim3: "none", timeseriesSort: "array-order", networkLabel: "none" }, chart);
    const displayChart = {};
    let newState = {
        largeDataset,
        view: existingView || initialView,
        lineType: "line",
        areaType: "hexbin",
        trendLine: "none",
        marginalGraphics: "none",
        barGrouping: "Clustered",
        selectedDimensions,
        selectedMetrics: [],
        pieceType: "bar",
        summaryType: "violin",
        networkType: "force",
        hierarchyType: "dendrogram",
        dimensions,
        metrics,
        colors,
        // ui: {},
        chart: finalChartSettings,
        overrideSettings,
        displayChart,
        primaryKey,
        data,
        editable: true,
        showLegend: true,
        facets,
        schema: props.data.schema,
        props
    };
    if (!filteredData) {
        newState = Object.assign(Object.assign({}, newState), nonChartDXSettings);
    }
    else {
        newState = Object.assign(Object.assign(Object.assign({}, newState), nonChartDXSettings), { metrics,
            dimensions,
            data });
    }
    return newState;
};
class DataExplorer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.filterData = (filterFn, useBaseData) => {
            const _a = this.state, { data, props, view, metrics, dimensions } = _a, remainingState = __rest(_a, ["data", "props", "view", "metrics", "dimensions"]);
            if (!filterFn) {
                this.updateChart(processInitialData(props, view, remainingState));
                return;
            }
            const { filteredData = data } = this.state;
            let newFilteredData = [];
            if (useBaseData) {
                newFilteredData = filterFn(props.data.data);
            }
            else {
                newFilteredData = filterFn(filteredData);
            }
            const newState = processInitialData(props, view, this.state, newFilteredData);
            this.updateChart(newState);
        };
        this.updateChart = (updatedState) => {
            const { view, dimensions, metrics, chart, lineType, areaType, selectedDimensions, selectedMetrics, pieceType, summaryType, networkType, hierarchyType, trendLine, marginalGraphics, barGrouping, colors, primaryKey, editable, showLegend, data: stateData, facets, overrideSettings, } = Object.assign(Object.assign({}, this.state), updatedState);
            if (!this.props.data && !this.props.metadata) {
                return;
            }
            let instantiatedView;
            const { data, height, OverrideVizControls, OverrideLegend, additionalViews } = this.props;
            const chartKey = generateChartKey({
                view,
                lineType,
                areaType,
                selectedDimensions,
                selectedMetrics,
                pieceType,
                summaryType,
                networkType,
                hierarchyType,
                chart,
                trendLine,
                marginalGraphics,
                barGrouping
            });
            const extendedSettings = Object.assign(Object.assign({}, semioticSettings), additionalViews);
            if (!view || view === "grid") {
                instantiatedView = React.createElement(DataResourceTransformGrid, Object.assign({}, this.props));
            }
            else {
                const { Frame, chartGenerator } = extendedSettings[view];
                const chartSettings = {
                    metrics,
                    dimensions,
                    chart,
                    colors,
                    height,
                    lineType,
                    areaType,
                    selectedDimensions,
                    selectedMetrics,
                    pieceType,
                    summaryType,
                    networkType,
                    hierarchyType,
                    primaryKey,
                    trendLine,
                    marginalGraphics,
                    barGrouping,
                    setColor: this.setColor,
                    filterData: this.filterData,
                    showLegend
                };
                const baseFrameSettings = chartGenerator(stateData, data.schema, chartSettings);
                const { frameSettings } = baseFrameSettings;
                const frameOverride = typeof overrideSettings === "function" ? overrideSettings(chartSettings, baseFrameSettings, data, view) : overrideSettings;
                instantiatedView = React.createElement(Frame, Object.assign({ responsiveWidth: true, size: defaultResponsiveSize }, frameSettings, frameOverride));
            }
            let finalRenderedViz;
            if (facets && facets.length > 0) {
                let colorHashOverride;
                let colorDimOverride;
                const facetFrames = [];
                facets
                    .forEach((baseDXSettings, facetIndex) => {
                    const { dimFacet, initialView = view, data: facetDataSettings = this.state, metadata: facetMetadata = { dx: {} } } = baseDXSettings;
                    if (initialView === "grid") {
                        const facetGridProps = Object.assign(Object.assign({}, this.props), baseDXSettings);
                        facetFrames.push(React.createElement(DataResourceTransformGrid, Object.assign({}, facetGridProps)));
                    }
                    else {
                        const { dx: facetDX = {} } = facetMetadata;
                        const { FacetFrame, chartGenerator: facetChartGenerator } = extendedSettings[initialView];
                        const { data: facetData, schema: facetSchema } = facetDataSettings;
                        const filteredFacetData = dimFacet ? facetData.filter(d => d[dimFacet.dim] === dimFacet.value) : facetData;
                        const title = dimFacet ? `${dimFacet.dim}=${dimFacet.value}` : "";
                        const facetChartSettings = Object.assign({ metrics,
                            dimensions, chart: Object.assign(Object.assign({}, chart), facetDX), colors,
                            height,
                            lineType,
                            areaType,
                            selectedDimensions,
                            selectedMetrics,
                            pieceType,
                            summaryType,
                            networkType,
                            hierarchyType,
                            primaryKey,
                            trendLine,
                            marginalGraphics,
                            barGrouping, setColor: this.setColor, filterData: this.filterData, showLegend }, facetDX);
                        const facetFrameSettings = facetChartGenerator(filteredFacetData, facetSchema, facetChartSettings, colorHashOverride, colorDimOverride);
                        const { colorHash, frameSettings, colorDim } = facetFrameSettings;
                        colorHashOverride = colorHashOverride || colorHash;
                        colorDimOverride = colorDimOverride || colorDim;
                        const facetOverride = typeof overrideSettings === "function" ? overrideSettings(facetChartSettings, facetFrameSettings, facetDataSettings, view) : overrideSettings;
                        facetFrames.push(React.createElement(FacetFrame, Object.assign({}, frameSettings, { beforeElements: React.createElement(FacetControls, { focusFunction: (dxSettings) => {
                                    this.updateChart({ chart: Object.assign(Object.assign({}, chart), dxSettings.dx), view: initialView, facets: [] });
                                }, removeFunction: (facetIndex) => { this.updateChart({ facets: facets.filter((d, i) => i !== facetIndex) }); }, dxSettings: facetMetadata, facetIndex: facetIndex }), size: defaultResponsiveSize, afterElements: null, margin: Object.assign(Object.assign({}, frameSettings.margin), { left: 55, right: 25, top: 25 }), title: title }, facetOverride)));
                    }
                });
                const ActualLegend = OverrideLegend ? OverrideLegend : HTMLLegend;
                finalRenderedViz = React.createElement(FacetWrapper, null,
                    React.createElement(FacetController, null, facetFrames),
                    React.createElement(ActualLegend, { valueHash: {}, colorHash: colorHashOverride, setColor: this.setColor, colors: colors }));
            }
            else {
                const controlProps = {
                    data: stateData,
                    view,
                    chart,
                    metrics,
                    dimensions,
                    selectedDimensions,
                    selectedMetrics,
                    hierarchyType,
                    summaryType,
                    networkType,
                    trendLine,
                    marginalGraphics,
                    barGrouping,
                    lineType,
                    areaType,
                    setAreaType: this.setAreaType,
                    updateChart: this.updateChart,
                    updateDimensions: this.updateDimensions,
                    setLineType: this.setLineType,
                    updateMetrics: this.updateMetrics,
                    generateFacets: this.generateFacets,
                    filterData: this.filterData,
                    setColor: this.setColor
                };
                const ActualVizControls = OverrideVizControls ? OverrideVizControls : VizControls;
                finalRenderedViz = React.createElement(React.Fragment, null,
                    instantiatedView,
                    editable && React.createElement(ActualVizControls, Object.assign({}, controlProps)));
            }
            const display = (React.createElement(SemioticWrapper, null, finalRenderedViz));
            // If you pass an onMetadataChange function, then fire it and pass the updated dx settings so someone upstream can update the metadata or otherwise use it
            this.updateMetadata({
                view,
                lineType,
                areaType,
                selectedDimensions,
                selectedMetrics,
                pieceType,
                summaryType,
                networkType,
                hierarchyType,
                trendLine,
                marginalGraphics,
                barGrouping,
                colors,
                chart
            });
            this.setState((prevState) => {
                return Object.assign(Object.assign({}, updatedState), { displayChart: Object.assign(Object.assign({}, prevState.displayChart), { [chartKey]: display }) });
            });
        };
        this.setView = (view) => {
            this.updateChart({ view });
        };
        this.updateMetadata = (overrideProps) => {
            const { onMetadataChange, metadata } = this.props;
            const { view, lineType, areaType, selectedDimensions, selectedMetrics, pieceType, summaryType, networkType, hierarchyType, trendLine, marginalGraphics, barGrouping, colors, chart, facets } = this.state;
            if (onMetadataChange) {
                onMetadataChange(Object.assign(Object.assign({}, metadata), { dx: Object.assign({ view,
                        lineType,
                        areaType,
                        selectedDimensions,
                        selectedMetrics,
                        pieceType,
                        summaryType,
                        networkType,
                        hierarchyType,
                        trendLine,
                        marginalGraphics,
                        barGrouping,
                        colors,
                        chart,
                        facets }, overrideProps) }), mediaType);
            }
        };
        this.setGrid = () => {
            this.updateChart({ view: "grid" });
        };
        this.setColor = (newColorArray) => {
            this.updateChart({ colors: newColorArray });
        };
        this.setLineType = (selectedLineType) => {
            this.updateChart({ lineType: selectedLineType });
        };
        this.setAreaType = (selectedAreaType) => {
            this.updateChart({ areaType: selectedAreaType });
        };
        this.updateDimensions = (selectedDimension) => {
            const oldDims = this.state.selectedDimensions;
            const newDimensions = oldDims.indexOf(selectedDimension) === -1
                ? [...oldDims, selectedDimension]
                : oldDims.filter(dimension => dimension !== selectedDimension);
            this.updateChart({ selectedDimensions: newDimensions });
        };
        this.updateMetrics = (selectedMetric) => {
            const oldMetrics = this.state.selectedMetrics;
            const newMetrics = oldMetrics.indexOf(selectedMetric) === -1
                ? [...oldMetrics, selectedMetric]
                : oldMetrics.filter(metric => metric !== selectedMetric);
            this.updateChart({ selectedMetrics: newMetrics });
        };
        this.generateFacets = (name) => (onWhat, which) => {
            if (onWhat === "metric") {
                const generatedFacets = this.state.metrics.map(metric => {
                    return {
                        metadata: {
                            dx: {
                                [name]: metric.name
                            }
                        }
                    };
                });
                this.updateChart({ facets: generatedFacets });
            }
        };
        this.state = processInitialData(props);
    }
    componentDidMount() {
        this.updateChart(this.state);
    }
    render() {
        const { view, dimensions, metrics, chart, lineType, areaType, selectedDimensions, selectedMetrics, pieceType, summaryType, networkType, hierarchyType, trendLine, marginalGraphics, barGrouping, largeDataset, facets } = this.state;
        const { additionalViews } = this.props;
        let display = null;
        if (semioticSettings[view] || view === "grid" || (additionalViews && additionalViews[view])) {
            const chartKey = generateChartKey({
                view,
                lineType,
                areaType,
                selectedDimensions,
                selectedMetrics,
                pieceType,
                summaryType,
                networkType,
                hierarchyType,
                chart,
                trendLine,
                marginalGraphics,
                barGrouping
            });
            display = this.state.displayChart[chartKey];
        }
        const toolbarProps = {
            dimensions,
            metrics,
            currentView: view,
            setGrid: this.setGrid,
            setView: this.setView,
            largeDataset
        };
        let children = React.Children.map(this.props.children, child => {
            if (!React.isValidElement(child)) {
                return;
            }
            const { componentType } = child.props;
            if (componentType === "viz") {
                const newProps = { children: display };
                return React.cloneElement(child, newProps);
            }
            else if (componentType === "toolbar") {
                return React.cloneElement(child, toolbarProps);
            }
            return child;
        });
        return (React.createElement("div", null,
            React.createElement(MetadataWarning, { metadata: this.props.metadata }),
            React.createElement(FlexWrapper, null, children ? children :
                React.createElement(React.Fragment, null,
                    React.createElement(Viz, null, display),
                    (!facets || facets.length === 0) && React.createElement(Toolbar, Object.assign({}, toolbarProps))))));
    }
}
DataExplorer.MIMETYPE = mediaType;
DataExplorer.defaultProps = {
    metadata: {
        dx: {}
    },
    height: 500,
    mediaType,
    initialView: "grid",
    overrideSettings: {},
    additionalViews: {}
};
export { DataExplorer as default, DataExplorer };
