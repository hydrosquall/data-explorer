import * as React from "react";
import { controlHelpText } from "../chartmeta/chart-docs";
import styled, { css } from "styled-components";
const commonCSS = css `
  h2 {
    text-transform: capitalize;
    margin-bottom: 10px;
  }
  select {
    height: 30px;
  }

  .selected {
    background-color: #d8e1e8 !important;
    background-image: none !important;
  }
`;
const ControlWrapper = styled.div `
  margin-right: 30px;
  ${commonCSS}
`;
const Wrapper = styled.div `
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-bottom: 30px;
  ${commonCSS}
`;
const metricDimSelector = (values, selectionFunction, title, required, selectedValue, contextTooltip = "Help me help you help yourself", facetingFunction) => {
    const metricsList = required ? values : ["none", ...values];
    let displayMetrics;
    if (metricsList.length > 1) {
        displayMetrics = (React.createElement("select", { onChange: (event) => {
                selectionFunction(event.target.value);
            }, value: selectedValue }, metricsList.map((metricName, i) => (React.createElement("option", { "aria-selected": selectedValue === metricName, key: `display-metric-${i}`, label: metricName, value: metricName }, metricName)))));
    }
    else {
        displayMetrics = React.createElement("p", { style: { margin: 0 } }, metricsList[0]);
    }
    let generateFacetButton;
    if (facetingFunction) {
        generateFacetButton = (React.createElement("button", { onClick: () => {
                facetingFunction("metric", title);
            } }, "Facet"));
    }
    return (React.createElement(ControlWrapper, { title: contextTooltip },
        React.createElement("div", null,
            React.createElement("h3", null, title)),
        displayMetrics,
        generateFacetButton));
};
const availableLineTypes = [
    {
        type: "line",
        label: "Line Chart"
    },
    {
        type: "stackedarea",
        label: "Stacked Area Chart"
    },
    {
        type: "stackedpercent",
        label: "Stacked Area Chart (Percent)"
    },
    {
        type: "bumparea",
        label: "Ranked Area Chart"
    }
];
const availableAreaTypes = [
    {
        type: "hexbin",
        label: "Hexbin"
    },
    {
        type: "heatmap",
        label: "Heatmap"
    },
    {
        type: "contour",
        label: "Contour Plot"
    }
];
export default ({ view, chart, metrics, dimensions, updateChart, selectedDimensions, selectedMetrics, hierarchyType, trendLine, marginalGraphics, barGrouping, summaryType, networkType, setLineType, updateMetrics, updateDimensions, lineType, areaType, setAreaType, data, generateFacets }) => {
    const metricNames = metrics.map(metric => metric.name);
    const dimensionNames = dimensions.map(dim => dim.name);
    const updateChartGenerator = (chartProperty) => {
        return (metricOrDim) => updateChart({ chart: Object.assign(Object.assign({}, chart), { [chartProperty]: metricOrDim }) });
    };
    const getControlHelpText = (view, metricOrDim) => {
        if (Object.keys(controlHelpText).find(mOrD => mOrD === metricOrDim)) {
            const mOrD = metricOrDim;
            const views = controlHelpText[mOrD] !== undefined ? controlHelpText[mOrD] : null;
            if (views == null) {
                return "";
            }
            if (typeof views === "string") {
                return views;
            }
            if (views[view] != null) {
                return views[view];
            }
            else {
                return views.default;
            }
        }
        return "";
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Wrapper, null,
            (view === "summary" ||
                view === "scatter" ||
                view === "hexbin" ||
                view === "bar" ||
                view === "network" ||
                view === "hierarchy") &&
                metricDimSelector(metricNames, updateChartGenerator("metric1"), view === "scatter" || view === "hexbin" ? "X" : "Metric", true, chart.metric1, getControlHelpText(view, "metric1"), generateFacets("metric1")),
            (view === "scatter" || view === "hexbin") &&
                metricDimSelector(metricNames, updateChartGenerator("metric2"), "Y", true, chart.metric2, getControlHelpText(view, "metric2"), generateFacets("metric2")),
            ((view === "scatter" && data.length < 1000) || view === "bar") &&
                metricDimSelector(metricNames, updateChartGenerator("metric3"), view === "bar" ? "Width" : "Size", false, chart.metric3, getControlHelpText(view, "metric3"), generateFacets("metric3")),
            view === "bar" &&
                metricDimSelector(metricNames, updateChartGenerator("metric4"), "Error Bars", false, chart.metric4, getControlHelpText(view, "metric4"), generateFacets("metric4")),
            view === "bar" &&
                metricDimSelector(["Clustered", "Stacked"], selectedBarGrouping => updateChart({ barGrouping: selectedBarGrouping }), "Stack or Cluster", true, barGrouping, controlHelpText.barGrouping),
            view === "scatter" &&
                metricDimSelector(["boxplot", "violin", "heatmap", "ridgeline", "histogram"], selectedMarginalGraphics => updateChart({ marginalGraphics: selectedMarginalGraphics }), "Marginal Graphics", false, marginalGraphics, controlHelpText.marginalGraphics),
            view === "scatter" &&
                metricDimSelector(["linear", "polynomial", "power", "exponential", "logarithmic"], selectedRegressionType => updateChart({ trendLine: selectedRegressionType }), "Trendline", false, trendLine, controlHelpText.trendLine),
            (view === "summary" ||
                view === "scatter" ||
                (view === "hexbin" && areaType === "contour") ||
                view === "bar" ||
                view === "parallel") &&
                metricDimSelector(dimensionNames, updateChartGenerator("dim1"), view === "summary" ? "Category" : "Color", true, chart.dim1, getControlHelpText(view, "dim1")),
            view === "scatter" &&
                metricDimSelector(dimensionNames, updateChartGenerator("dim2"), "Labels", false, chart.dim2, getControlHelpText(view, "dim2")),
            view === "hexbin" &&
                areaType === "contour" &&
                metricDimSelector(["by color"], updateChartGenerator("dim3"), "Multiclass", false, chart.dim3, getControlHelpText(view, "dim3")),
            view === "network" &&
                metricDimSelector(dimensionNames, updateChartGenerator("dim1"), "SOURCE", true, chart.dim1, getControlHelpText(view, "dim1")),
            view === "network" &&
                metricDimSelector(dimensionNames, updateChartGenerator("dim2"), "TARGET", true, chart.dim2, getControlHelpText(view, "dim2")),
            view === "network" &&
                metricDimSelector(["matrix", "arc", "force", "sankey"], selectedNetworkType => updateChart({ networkType: selectedNetworkType }), "Type", true, networkType, controlHelpText.networkType),
            view === "network" &&
                metricDimSelector(["static", "scaled"], updateChartGenerator("networkLabel"), "Show Labels", false, chart.networkLabel, controlHelpText.networkLabel),
            view === "hierarchy" &&
                metricDimSelector(["dendrogram", "treemap", "partition", "sunburst"], selectedHierarchyType => updateChart({ hierarchyType: selectedHierarchyType }), "Type", true, hierarchyType, controlHelpText.hierarchyType),
            view === "summary" &&
                metricDimSelector(["violin", "boxplot", "ridgeline", "heatmap", "histogram"], selectedSummaryType => updateChart({ summaryType: selectedSummaryType }), "Type", true, summaryType, controlHelpText.summaryType),
            view === "line" &&
                metricDimSelector(["array-order", ...metricNames], updateChartGenerator("timeseriesSort"), "Sort by", true, chart.timeseriesSort, controlHelpText.timeseriesSort),
            view === "line" && (React.createElement("div", { title: controlHelpText.lineType, style: { display: "inline-block" } },
                React.createElement("div", null,
                    React.createElement("h3", null, "Chart Type")),
                availableLineTypes.map(lineTypeOption => (React.createElement("button", { key: lineTypeOption.type, className: `button-text ${lineType === lineTypeOption.type &&
                        "selected"}`, onClick: () => setLineType(lineTypeOption.type) }, lineTypeOption.label))))),
            view === "hexbin" && (React.createElement("div", { className: "control-wrapper", title: controlHelpText.areaType },
                React.createElement("div", null,
                    React.createElement("h3", null, "Chart Type")),
                availableAreaTypes.map(areaTypeOption => {
                    const areaTypeOptionType = areaTypeOption.type;
                    if (areaTypeOptionType === "contour" ||
                        areaTypeOptionType === "hexbin" ||
                        areaTypeOptionType === "heatmap") {
                        return (React.createElement("button", { className: `button-text ${areaType === areaTypeOptionType &&
                                "selected"}`, key: areaTypeOptionType, onClick: () => setAreaType(areaTypeOptionType) }, areaTypeOption.label));
                    }
                    else {
                        return React.createElement("div", null);
                    }
                }))),
            view === "hierarchy" && (React.createElement("div", { className: "control-wrapper", title: controlHelpText.nestingDimensions },
                React.createElement("div", null,
                    React.createElement("h3", null, "Nesting")),
                selectedDimensions.length === 0
                    ? "Select categories to nest"
                    : `root, ${selectedDimensions.join(", ")}`)),
            (view === "bar" || view === "hierarchy") && (React.createElement("div", { className: "control-wrapper", title: controlHelpText.barDimensions },
                React.createElement("div", null,
                    React.createElement("h3", null, "Categories")),
                dimensions.map(dim => (React.createElement("button", { key: `dimensions-select-${dim.name}`, className: `button-text ${selectedDimensions.indexOf(dim.name) !== -1 && "selected"}`, onClick: () => updateDimensions(dim.name) }, dim.name))))),
            view === "line" && (React.createElement("div", { className: "control-wrapper", title: controlHelpText.lineDimensions },
                React.createElement("div", null,
                    React.createElement("h3", null, "Metrics")),
                metrics.map(metric => (React.createElement("button", { key: `metrics-select-${metric.name}`, className: `button-text ${selectedMetrics.indexOf(metric.name) !== -1 && "selected"}`, onClick: () => updateMetrics(metric.name) }, metric.name))))))));
};
