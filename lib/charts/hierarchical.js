import { nest } from "d3-collection";
import { interpolateLab } from "d3-interpolate";
import * as React from "react";
import TooltipContent from "../utilities/tooltip-content";
const overrideFrameHover = (hierarchyType) => (annotation) => {
    const { d } = annotation;
    if (d.type === "frame-hover" && hierarchyType !== "treemap") {
        return;
    }
    return null;
};
const hierarchicalAnnotation = (hierarchyType, selectedDimensions, metric) => (annotation) => {
    const { d, networkFrameState, nodes: drawnNodes } = annotation;
    const { type, parent } = d;
    const { networkFrameRender } = networkFrameState;
    if (hierarchyType !== "treemap" && parent && type === "highlight") {
        const { nodes } = networkFrameRender;
        const { customMark, styleFn: baseStyle } = nodes;
        const ancestors = parent.ancestors();
        const parentPlusPieces = [parent, ...ancestors];
        const drawnPieces = parentPlusPieces.map(d => drawnNodes.find((p) => (p.depth === 0 && d.depth === 0) ||
            p.hierarchicalID === d.hierarchicalID));
        const allPieces = [d, ...drawnPieces];
        const baseMarkProps = { forceUpdate: true };
        const ancestorHighlight = allPieces.map((node, nodei) => {
            const transform = `translate(${node.x},${node.y})`;
            const styleFn = (d) => (Object.assign(Object.assign({}, baseStyle(d)), { fill: "red", opacity: 0.5, stroke: "red", strokeWidth: "4px" }));
            const customNode = customMark({
                d: node,
                styleFn,
                transform: transform,
                baseMarkProps,
                key: `highlight-${nodei}-parent`
            });
            const thisLevelName = selectedDimensions[node.depth - 1];
            return (React.createElement("g", null,
                customNode,
                React.createElement("text", { transform: transform },
                    thisLevelName && `${thisLevelName}: ${node.key}`,
                    node.depth !== 0 && node[metric] && `${metric}: ${node[metric]}`)));
        });
        return React.createElement("g", null, ancestorHighlight);
    }
    return null;
};
const parentPath = (datapoint, pathArray) => {
    if (datapoint.parent) {
        pathArray = parentPath(datapoint.parent, [datapoint.key, ...pathArray]);
    }
    else {
        pathArray = [...pathArray];
    }
    return pathArray;
};
const hierarchicalTooltip = (datapoint, primaryKey, metric, selectedDimensions) => {
    const pathString = datapoint.parent
        ? parentPath(datapoint.parent, (datapoint.key && [datapoint.key]) || []).map((d, i) => (React.createElement("p", null,
            selectedDimensions[i],
            ": ",
            d)))
        : "";
    const content = [];
    if (!datapoint.parent) {
        content.push(React.createElement("h2", { key: "hierarchy-title" }, "Root"));
    }
    else if (datapoint.key) {
        content.push(React.createElement("h2", { key: "hierarchy-title" }, datapoint.key));
        content.push(React.createElement("p", { key: "path-string" }, pathString));
        content.push(React.createElement("p", { key: "hierarchy-value" },
            "Total Value: ",
            datapoint.value));
        content.push(React.createElement("p", { key: "hierarchy-children" },
            "Children: ",
            datapoint.children.length));
    }
    else {
        content.push(pathString, React.createElement("p", { key: "leaf-label" }, primaryKey.map((pkey) => datapoint[pkey]).join(", ")));
        content.push(React.createElement("p", { key: "hierarchy-value" },
            metric,
            ": ",
            datapoint[metric]));
    }
    return content;
};
const hierarchicalColor = (colorHash, datapoint) => {
    if (datapoint.depth === 0) {
        return "white";
    }
    if (datapoint.depth === 1) {
        return colorHash[datapoint.key];
    }
    let colorNode = datapoint;
    for (let x = datapoint.depth; x > 1; x--) {
        colorNode = colorNode.parent;
    }
    const lightenScale = interpolateLab("white", colorHash[colorNode.key]);
    return lightenScale(Math.max(0, datapoint.depth / 6));
};
export const semioticHierarchicalChart = (data, schema, options, colorHashOverride, colorDimOverride) => {
    const { hierarchyType: baseHierarchyType = "dendrogram", chart, selectedDimensions, primaryKey, colors } = options;
    const { metric1 } = chart;
    // a sunburst is just a radial partition
    const hierarchyType = baseHierarchyType === "sunburst" ? "partition" : baseHierarchyType;
    if (selectedDimensions.length === 0) {
        return {};
    }
    const nestingParams = nest();
    selectedDimensions.forEach((dim) => {
        nestingParams.key((param) => param[dim]);
    });
    const colorHash = colorHashOverride || {};
    const sanitizedData = [];
    data.forEach((datapoint) => {
        if (!colorDimOverride && !colorHash[datapoint[selectedDimensions[0]]]) {
            colorHash[datapoint[selectedDimensions[0]]] =
                colors[Object.keys(colorHash).length];
        }
        sanitizedData.push(Object.assign(Object.assign({}, datapoint), { sanitizedR: datapoint.r, r: undefined }));
    });
    const entries = nestingParams.entries(sanitizedData.sort((a, b) => a[metric1] - b[metric1]));
    const rootNode = { id: "all", values: entries };
    const hierarchySettings = {
        edges: rootNode,
        edgeStyle: () => ({ fill: "lightgray", stroke: "gray" }),
        nodeStyle: (node) => {
            return {
                fill: hierarchicalColor(colorHash, node),
                stroke: node.depth === 1 ? "white" : "black",
                strokeOpacity: node.depth * 0.1 + 0.2
            };
        },
        networkType: {
            type: hierarchyType,
            projection: baseHierarchyType === "sunburst" && "radial",
            hierarchySum: (node) => node[metric1],
            hierarchyChildren: (node) => node.values,
            padding: hierarchyType === "treemap" ? 3 : 0,
            zoom: false
        },
        edgeRenderKey: (edge, index) => {
            return index;
        },
        nodeIDAccessor: (d, i) => d.id || d.key || i,
        baseMarkProps: { forceUpdate: true },
        margin: { left: 10, right: 10, top: 10, bottom: 10 },
        hoverAnnotation: [
            { type: "frame-hover" },
            {
                type: "highlight",
                style: {
                    stroke: "red",
                    strokeOpacity: 0.5,
                    strokeWidth: 5,
                    fill: "none"
                }
            }
        ],
        svgAnnotationRules: hierarchicalAnnotation(hierarchyType, selectedDimensions, metric1),
        htmlAnnotationRules: overrideFrameHover(hierarchyType),
        tooltipContent: (hoveredDatapoint) => {
            return (React.createElement(TooltipContent, { x: hoveredDatapoint.x, y: hoveredDatapoint.y }, hierarchicalTooltip(hoveredDatapoint, primaryKey, metric1, selectedDimensions)));
        }
    };
    return {
        frameSettings: hierarchySettings,
        colorDim: selectedDimensions[0],
        colorHash
    };
};
