import { scaleLinear } from "d3-scale";
import * as React from "react";
import HTMLLegend from "../components/HTMLLegend";
import TooltipContent, { safeDisplayValue } from "../utilities/tooltip-content";
import { numeralFormatting } from "../utilities/utilities";
const fontScale = scaleLinear()
    .domain([8, 25])
    .range([14, 8])
    .clamp(true);
export const semioticSummaryChart = (data, schema, options, colorHashOverride, colorDimOverride) => {
    const additionalSettings = {};
    const colorHash = colorHashOverride || {};
    const { chart, summaryType, primaryKey, colors, setColor, showLegend } = options;
    const { dim1, metric1 } = chart;
    const oAccessor = dim1;
    const rAccessor = metric1;
    const uniqueValues = data.reduce((uniqueArray, datapoint) => (!uniqueArray.find((dimValue) => dimValue === datapoint[dim1].toString()) && [...uniqueArray, datapoint[dim1].toString()]) ||
        uniqueArray, []);
    if (!colorHashOverride && dim1 && dim1 !== "none") {
        uniqueValues.sort().forEach((dimValue, index) => {
            colorHash[dimValue] = colors[index % colors.length];
        });
        if (showLegend) {
            additionalSettings.afterElements = (React.createElement(HTMLLegend, { valueHash: {}, colorHash: colorHash, setColor: setColor, colors: colors }));
        }
    }
    const summarySettings = Object.assign({ summaryType: { type: summaryType, bins: 16, amplitude: 20 }, type: summaryType === "violin" && data.length < 250 && "swarm", projection: "horizontal", data,
        oAccessor,
        rAccessor, summaryStyle: (summaryDatapoint) => ({
            fill: colorHash[summaryDatapoint[colorDimOverride || dim1]] || colors[0],
            fillOpacity: 0.8,
            stroke: colorHash[summaryDatapoint[colorDimOverride || dim1]] || colors[0]
        }), style: (pieceDatapoint) => ({
            fill: colorHash[pieceDatapoint[colorDimOverride || dim1]] || colors[0],
            stroke: "white"
        }), oPadding: 5, oLabel: uniqueValues.length > 30
            ? false
            : (columnName) => (React.createElement("text", { textAnchor: "end", fontSize: `${(columnName && fontScale(columnName.length)) ||
                    12}px` }, columnName)), margin: { top: 25, right: 10, bottom: 50, left: 100 }, axes: [
            {
                orient: "bottom",
                label: rAccessor,
                tickFormat: numeralFormatting
            }
        ], baseMarkProps: { forceUpdate: true }, pieceHoverAnnotation: summaryType === "violin", tooltipContent: (hoveredDatapoint) => {
            const dimensions = options.dimensions.filter(dim => dim.name !== dim1);
            const furtherDims = dimensions.map(dim => (React.createElement("p", null,
                dim.name,
                ": ",
                safeDisplayValue(hoveredDatapoint[dim.name]))));
            return (React.createElement(TooltipContent, { x: hoveredDatapoint.x, y: hoveredDatapoint.y },
                React.createElement("h3", null, primaryKey.map(pkey => hoveredDatapoint[pkey]).join(", ")),
                React.createElement("p", null,
                    dim1,
                    ": ",
                    safeDisplayValue(hoveredDatapoint[dim1])),
                furtherDims,
                React.createElement("p", null,
                    rAccessor,
                    ": ",
                    safeDisplayValue(hoveredDatapoint[rAccessor]))));
        } }, additionalSettings);
    return { frameSettings: summarySettings, colorDim: dim1, colorHash };
};
