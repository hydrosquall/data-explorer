import { scaleLinear, scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import * as React from "react";
import TooltipContent from "../utilities/tooltip-content";
import { numeralFormatting } from "../utilities/utilities";
export const semioticLineChart = (data, schema, options) => {
    let lineData;
    const { chart, selectedMetrics, lineType, metrics, primaryKey, colors } = options;
    // const F = (a: number, b:Dx.Chart): string[]=> selectedMetrics;
    const { timeseriesSort } = chart;
    const timeSeriesFields = schema.fields.find(field => field && field.name === timeseriesSort);
    const sortType = timeseriesSort === "array-order"
        ? "integer"
        : timeSeriesFields && timeSeriesFields.type
            ? timeSeriesFields.type
            : null;
    const formatting = (tickValue) => sortType === "datetime"
        ? tickValue.toLocaleString().split(",")[0]
        : numeralFormatting(tickValue);
    const xScale = sortType === "datetime" ? scaleTime() : scaleLinear();
    lineData = metrics
        .map((metric, index) => {
        const metricData = timeseriesSort === "array-order"
            ? data
            : data.sort(
            // Using some questionable type assertions here
            (datapointA, datapointB) => datapointA[timeseriesSort] - datapointB[timeseriesSort]);
        return {
            color: colors[index % colors.length],
            label: metric.name,
            type: metric.type,
            coordinates: metricData.map((datapoint, datapointValue) => ({
                value: datapoint[metric.name],
                x: timeseriesSort === "array-order"
                    ? datapointValue
                    : datapoint[timeseriesSort],
                label: metric.name,
                color: colors[index % colors.length],
                originalData: datapoint
            }))
        };
    })
        .filter((metric) => selectedMetrics.length === 0 ||
        selectedMetrics.some(selectedMetric => selectedMetric === metric.label));
    const canvasRender = lineData[0].coordinates.length > 250;
    const lineSettings = {
        lineType: { type: lineType, interpolator: curveMonotoneX },
        lines: lineData,
        xScaleType: xScale,
        canvasLines: canvasRender,
        renderKey: (line, index) => {
            return line.coordinates
                ? `line-${line.label}`
                : `linepoint=${line.label}-${index}`;
        },
        lineStyle: (line) => ({
            fill: lineType === "line" ? "none" : line.color,
            stroke: line.color,
            fillOpacity: 0.75
        }),
        pointStyle: (point) => {
            return {
                fill: point.color,
                fillOpacity: 0.75
            };
        },
        axes: [
            { orient: "left", tickFormat: numeralFormatting },
            {
                orient: "bottom",
                ticks: 5,
                tickFormat: (tickValue) => {
                    const label = formatting(tickValue);
                    const rotation = label.length > 4 ? "45" : "0";
                    const textAnchor = label.length > 4 ? "start" : "middle";
                    return (React.createElement("text", { transform: `rotate(${rotation})`, textAnchor: textAnchor }, label));
                }
            }
        ],
        hoverAnnotation: true,
        xAccessor: "x",
        yAccessor: "value",
        showLinePoints: !canvasRender && lineType === "line",
        margin: {
            top: 20,
            right: 200,
            bottom: sortType === "datetime" ? 80 : 40,
            left: 50
        },
        legend: {
            title: "Legend",
            position: "right",
            width: 200,
            legendGroups: [
                {
                    label: "",
                    styleFn: (legendItem) => ({ fill: legendItem.color }),
                    items: lineData
                }
            ]
        },
        tooltipContent: (hoveredDatapoint) => {
            return (React.createElement(TooltipContent, { x: hoveredDatapoint.x, y: hoveredDatapoint.y },
                React.createElement("p", null, hoveredDatapoint.parentLine && hoveredDatapoint.parentLine.label),
                React.createElement("p", null, (hoveredDatapoint.value &&
                    hoveredDatapoint.value.toLocaleString()) ||
                    hoveredDatapoint.value),
                React.createElement("p", null,
                    timeseriesSort,
                    ": ",
                    formatting(hoveredDatapoint.x)),
                primaryKey.map((pkey, index) => (React.createElement("p", { key: `key-${index}` },
                    pkey,
                    ":",
                    " ",
                    (hoveredDatapoint.originalData[pkey].toString &&
                        hoveredDatapoint.originalData[pkey].toString()) ||
                        hoveredDatapoint.originalData[pkey])))));
        }
    };
    return { frameSettings: lineSettings, colorDim: "none", colorHash: {} };
};
