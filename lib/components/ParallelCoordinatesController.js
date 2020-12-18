import { scaleLinear } from "d3-scale";
import * as React from "react";
import { Axis, ResponsiveOrdinalFrame } from "semiotic";
import HTMLLegend from "./HTMLLegend";
import TooltipContent from "../utilities/tooltip-content";
import { numeralFormatting } from "../utilities/utilities";
import styled from "styled-components";
const NumberOfItemsP = styled.p `
  margin: 20px 0 5px;
`;
const ParCoordsAxisTickG = styled.g `
  & text {
    text-anchor: end;
  }

  & :first-child {
    fill: white;
    stroke: white;
    opacity: 0.75;
    stroke-width: 2;
  }
`;
const axisSize = [40, 380];
function parallelizeData(data, metrics, schemaFields, primaryKey) {
    const minmax = {};
    const screenScales = {};
    metrics.forEach(metric => {
        const dataExtent = [
            Math.min(...data.map(datapoint => datapoint[metric.name])),
            Math.max(...data.map(datapoint => datapoint[metric.name]))
        ];
        const minMaxScale = scaleLinear()
            .domain(dataExtent)
            .range([0, 1]);
        minmax[metric.name] = minMaxScale;
        const screenScale = scaleLinear()
            .domain(dataExtent)
            .range([380, 0]);
        screenScales[metric.name] = screenScale;
    });
    const dataPieces = [];
    data.forEach(datapoint => {
        metrics.forEach(metric => {
            const dataPiece = {
                metric: metric.name,
                rawvalue: datapoint[metric.name],
                pctvalue: minmax[metric.name](datapoint[metric.name])
            };
            schemaFields.forEach((field) => {
                if (field.type === "string") {
                    dataPiece[field.name] = datapoint[field.name];
                }
            });
            primaryKey.forEach(key => {
                dataPiece[key] = datapoint[key];
            });
            dataPieces.push(dataPiece);
        });
    });
    return { dataPieces, scales: screenScales };
}
class ParallelCoordinatesController extends React.Component {
    constructor(props) {
        super(props);
        this.brushing = (selectedExtent, columnName) => {
            const columnExtent = this.state.columnExtent;
            columnExtent[columnName] = selectedExtent;
            this.setState({ columnExtent });
        };
        const { options, data, schema } = props;
        const { primaryKey, metrics } = options;
        const parallelizeResults = parallelizeData(data, metrics, schema.fields, primaryKey);
        this.state = {
            filterMode: true,
            data: parallelizeResults.dataPieces,
            dataScales: parallelizeResults.scales,
            columnExtent: metrics.reduce((metricHash, metric) => {
                metricHash[metric.name] = [-Infinity, Infinity];
                return metricHash;
            }, {})
        };
    }
    shouldComponentUpdate() {
        return true;
    }
    render() {
        const { options, data } = this.props;
        const { primaryKey, metrics, chart, colors, setColor } = options;
        const { dim1 } = chart;
        const { columnExtent, filterMode } = this.state;
        const hiddenHash = new Map();
        const connectorFunction = (columnDatapoint) => primaryKey.map(key => columnDatapoint[key]).join(",");
        Object.keys(columnExtent).forEach((key) => {
            const extent = columnExtent[key].sort((a, b) => a - b);
            this.state.data
                .filter((datapoint) => datapoint.metric === key &&
                (datapoint.pctvalue < extent[0] || datapoint.pctvalue > extent[1]))
                .forEach((datapoint) => {
                hiddenHash.set(primaryKey.map(key => datapoint[key]).join(","), true);
            });
        });
        const additionalSettings = {};
        const shownData = data.filter(datapoint => !hiddenHash.get(primaryKey.map(key => datapoint[key]).join(",")));
        const filteredData = shownData.map(datapoint => primaryKey.map(key => datapoint[key]).join(" - "));
        const colorHash = { Other: "grey" };
        if (dim1 && dim1 !== "none") {
            const { uniqueValues, valueHash } = shownData.reduce((valueReducer, datapoint) => {
                const value = datapoint[dim1];
                valueReducer.valueHash[value] =
                    (valueReducer.valueHash[value] &&
                        valueReducer.valueHash[value] + 1) ||
                        1;
                valueReducer.uniqueValues =
                    (!valueReducer.uniqueValues.find((uniqueValue) => uniqueValue === value) && [...valueReducer.uniqueValues, value]) ||
                        valueReducer.uniqueValues;
                return valueReducer;
            }, { uniqueValues: [], valueHash: {} });
            const uniqueDimsForColors = data.reduce((colorArray, datapoint) => colorArray.indexOf(datapoint[dim1]) === -1
                ? [...colorArray, datapoint[dim1]]
                : colorArray, []);
            uniqueDimsForColors.forEach((value, index) => {
                colorHash[value] = colors[index % colors.length];
            });
            additionalSettings.afterElements =
                uniqueValues.length <= 18 ? (React.createElement(HTMLLegend, { values: uniqueValues, colorHash: colorHash, valueHash: valueHash, setColor: setColor })) : (React.createElement(NumberOfItemsP, null,
                    filteredData.length,
                    " items"));
        }
        if (!filterMode) {
            additionalSettings.annotations = metrics
                .map(metric => ({
                label: "",
                metric: metric.name,
                type: "enclose-rect",
                color: "green",
                disable: ["connector"],
                coordinates: [
                    { metric: metric.name, pctvalue: columnExtent[metric.name][0] },
                    { metric: metric.name, pctvalue: columnExtent[metric.name][1] }
                ]
            }))
                .filter(annotation => annotation.coordinates[0].pctvalue !== 0 ||
                annotation.coordinates[1].pctvalue !== 1);
        }
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("button", { className: `button-text ${filterMode ? "selected" : ""}`, onClick: () => this.setState({ filterMode: true }) }, "Filter"),
                React.createElement("button", { className: `button-text ${filterMode ? "" : "selected"}`, onClick: () => this.setState({ filterMode: false }) }, "Explore")),
            React.createElement(ResponsiveOrdinalFrame, Object.assign({ data: this.state.data, oAccessor: "metric", rAccessor: "pctvalue", type: {
                    type: "point",
                    r: 2
                }, connectorType: connectorFunction, style: (datapoint) => ({
                    fill: hiddenHash.get(primaryKey.map((key) => datapoint[key]).join(","))
                        ? "lightgray"
                        : colorHash[datapoint[dim1]],
                    opacity: hiddenHash.get(primaryKey.map((key) => datapoint[key]).join(","))
                        ? 0.15
                        : 0.99
                }), connectorStyle: (datapoint) => ({
                    stroke: hiddenHash.get(primaryKey.map((key) => datapoint.source[key]).join(","))
                        ? "gray"
                        : colorHash[datapoint.source[dim1]],
                    strokeWidth: hiddenHash.get(primaryKey.map((key) => datapoint.source[key]).join(","))
                        ? 1
                        : 1.5,
                    strokeOpacity: hiddenHash.get(primaryKey.map((key) => datapoint.source[key]).join(","))
                        ? 0.1
                        : 1
                }), responsiveWidth: true, margin: { top: 20, left: 20, right: 20, bottom: 100 }, oPadding: 40, pixelColumnWidth: 80, interaction: filterMode
                    ? {
                        columnsBrush: true,
                        during: this.brushing,
                        extent: Object.keys(this.state.columnExtent)
                    }
                    : null, pieceHoverAnnotation: !filterMode, tooltipContent: (hoveredDatapoint) => {
                    const textColor = hiddenHash.get(primaryKey.map((key) => hoveredDatapoint[key]).join(","))
                        ? "grey"
                        : colorHash[hoveredDatapoint[dim1]];
                    return (React.createElement(TooltipContent, { x: hoveredDatapoint.x, y: hoveredDatapoint.y },
                        React.createElement("h3", null, primaryKey
                            .map((key) => hoveredDatapoint[key])
                            .join(", ")),
                        hoveredDatapoint[dim1] && (React.createElement("h3", { style: { color: textColor } },
                            dim1,
                            ": ",
                            hoveredDatapoint[dim1])),
                        React.createElement("p", null,
                            hoveredDatapoint.metric,
                            ": ",
                            hoveredDatapoint.rawvalue)));
                }, canvasPieces: true, canvasConnectors: true, oLabel: (columnLabel) => (React.createElement("g", null,
                    React.createElement("text", { transform: "rotate(45)" }, columnLabel),
                    React.createElement("g", { transform: "translate(-20,-395)" },
                        React.createElement(Axis, { scale: this.state.dataScales[columnLabel], size: axisSize, orient: "left", ticks: 5, tickFormat: (tickValue) => (React.createElement(ParCoordsAxisTickG, null,
                                React.createElement("text", null, numeralFormatting(tickValue)),
                                React.createElement("text", null, numeralFormatting(tickValue)))) })))) }, additionalSettings))));
    }
}
ParallelCoordinatesController.defaultProps = {
    metadata: {},
    height: 500
};
export default ParallelCoordinatesController;
