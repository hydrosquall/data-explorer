import * as React from "react";
import HTMLLegend from "../components/HTMLLegend";
import TooltipContent, { safeDisplayValue } from "../utilities/tooltip-content";
import { numeralFormatting } from "../utilities/utilities";
import { sortByOrdinalRange } from "./shared";
export const semioticBarChart = (data, schema, options, colorHashOverride, colorDimOverride) => {
    const { selectedDimensions, chart, colors, setColor, barGrouping } = options;
    const { dim1, metric1, metric3, metric4 } = chart;
    const oAccessor = selectedDimensions.length === 0
        ? dim1
        : (datapoint) => selectedDimensions
            .map(selectedDim => datapoint[selectedDim])
            .join(",");
    const rAccessor = metric1;
    const additionalSettings = {};
    const colorHash = colorHashOverride || { Other: "grey" };
    const sortedData = sortByOrdinalRange(oAccessor, (metric3 !== "none" && metric3) || rAccessor, dim1, data);
    if (metric3 && metric3 !== "none") {
        additionalSettings.dynamicColumnWidth = metric3;
    }
    let errorBarAnnotations;
    if (barGrouping === "Clustered" && metric4 && metric4 !== "none") {
        additionalSettings.rExtent = [
            Math.min(...data.map(d => d[metric1] - d[metric4])),
            Math.max(...data.map(d => d[metric1] + d[metric4]))
        ];
        errorBarAnnotations = (d, i, xy) => {
            const errorBarSize = Math.abs(xy.rScale(d[metric1]) - xy.rScale(d[metric1] + d[metric4]));
            return (React.createElement("g", null,
                React.createElement("rect", { width: xy.width, height: xy.height, style: xy.styleFn(d) }),
                React.createElement("g", { transform: `translate(${xy.width / 2},${d.negative ? xy.height : 0})`, stroke: "#333", strokeWidth: "1", opacity: "0.75" },
                    React.createElement("line", { y1: -errorBarSize, y2: -errorBarSize, x1: Math.min(0, -xy.width / 2 + 2), x2: Math.max(0, xy.width / 2 - 2) }),
                    React.createElement("line", { x1: 0, x2: 0, y1: -errorBarSize, y2: errorBarSize }),
                    React.createElement("line", { y1: errorBarSize, y2: errorBarSize, x1: Math.min(0, -xy.width / 2 + 2), x2: Math.max(0, xy.width / 2 - 2) }))));
        };
    }
    const uniqueValues = sortedData.reduce((uniques, datapoint) => !uniques.find((uniqueDimName) => uniqueDimName === datapoint[dim1].toString())
        ? [...uniques, datapoint[dim1].toString()]
        : uniques, []);
    if (!colorHashOverride && dim1 && dim1 !== "none") {
        uniqueValues.forEach((value, index) => {
            // Color the first 18 values after that everything gets grey because more than 18 colors is unreadable no matter what you want
            colorHash[value] = index > 18 ? "grey" : colors[index % colors.length];
        });
        additionalSettings.afterElements = (React.createElement(HTMLLegend, { valueHash: {}, colorHash: colorHash, setColor: setColor, colors: colors }));
        if (barGrouping === "Clustered" ||
            (selectedDimensions.length > 0 && selectedDimensions.join(",") !== dim1)) {
            additionalSettings.pieceHoverAnnotation = true;
            additionalSettings.tooltipContent = hoveredDatapoint => {
                return (React.createElement(TooltipContent, { x: hoveredDatapoint.x, y: hoveredDatapoint.y },
                    React.createElement("div", { style: { display: "flex", flexWrap: "wrap" } },
                        React.createElement("div", null, options.dimensions.map((dim, index) => {
                            return (React.createElement("div", { style: {
                                    margin: "2px 5px 0",
                                    display: "inline-block",
                                    minWidth: "100px"
                                }, key: `dim-${index}` },
                                React.createElement("span", { style: { fontWeight: 600 } }, dim.name),
                                ":",
                                " ",
                                safeDisplayValue(hoveredDatapoint[dim.name])));
                        })),
                        React.createElement("div", null, options.metrics.map((dim, index) => (React.createElement("div", { style: {
                                margin: "2px 5px 0",
                                display: "inline-block",
                                minWidth: "100px"
                            }, key: `dim-${index}` },
                            React.createElement("span", { style: { fontWeight: 600 } }, dim.name),
                            ":",
                            " ",
                            safeDisplayValue(hoveredDatapoint[dim.name]))))))));
            };
        }
    }
    const barSettings = Object.assign({ type: barGrouping === "Clustered"
            ? { type: "clusterbar", customMark: errorBarAnnotations }
            : { type: "bar", customMark: errorBarAnnotations }, data: sortedData, oAccessor,
        rAccessor, style: (datapoint) => ({
            fill: colorHash[datapoint[colorDimOverride || dim1]] || colors[0],
            stroke: colorHash[datapoint[colorDimOverride || dim1]] || colors[0]
        }), oPadding: uniqueValues.length > 30 ? 1 : 5, oLabel: uniqueValues.length > 30
            ? false
            : (columnLabel) => {
                return React.createElement("text", { transform: "rotate(90)" }, columnLabel);
            }, hoverAnnotation: true, margin: { top: 10, right: 10, bottom: 100, left: 70 }, axes: [
            {
                orient: "left",
                label: rAccessor,
                tickFormat: numeralFormatting
            }
        ], tooltipContent: (hoveredDatapoint) => {
            return (React.createElement(TooltipContent, { x: hoveredDatapoint.column.xyData[0].xy.x, y: hoveredDatapoint.column.xyData[0].xy.y },
                React.createElement("p", null, typeof oAccessor === "function"
                    ? oAccessor(hoveredDatapoint.pieces[0])
                    : hoveredDatapoint.pieces[0][oAccessor]),
                React.createElement("p", null,
                    rAccessor,
                    ":",
                    " ",
                    hoveredDatapoint.pieces
                        .map((piece) => piece[rAccessor])
                        .reduce((total, value) => total + value, 0)),
                metric3 && metric3 !== "none" && (React.createElement("p", null,
                    metric3,
                    ":",
                    " ",
                    hoveredDatapoint.pieces
                        .map((piece) => piece[metric3])
                        .reduce((total, value) => total + value, 0)))));
        }, baseMarkProps: { forceUpdate: true }, size: [500, 600] }, additionalSettings);
    return { frameSettings: barSettings, colorDim: dim1, colorHash };
};
