import { DatabaseOcticon } from "@nteract/octicons";
import * as React from "react";
import { chartHelpText } from "../chartmeta/chart-docs";
import { BarChartIcon, BoxplotIcon, HexbinIcon, LineChartIcon, NetworkIcon, ParallelCoordinatesIcon, ScatterplotIcon, TreeIcon } from "../utilities/icons";
import { IconButton } from "./IconButton";
import styled from "styled-components";
const ToolbarWrapper = styled.div `
  display: flex;
  flex-flow: column nowrap;
  z-index: 1;
  padding: 5px;
`;
Toolbar.defaultProps = {
    componentType: "toolbar",
    currentView: "",
    dimensions: [],
    setGrid: () => null,
    setView: () => null
};
export function Toolbar({ dimensions, setGrid, setView, currentView, componentType, largeDataset }) {
    return (React.createElement(ToolbarWrapper, { className: "dx-button-bar" },
        React.createElement(IconButton, { title: chartHelpText.grid, onClick: setGrid, message: "Data Table", selected: false },
            React.createElement(DatabaseOcticon, null)),
        !largeDataset && dimensions.length > 0 && (React.createElement(IconButton, { title: chartHelpText.bar, onClick: () => setView("bar"), selected: currentView === "bar", message: "Bar Graph" },
            React.createElement(BarChartIcon, null))),
        React.createElement(IconButton, { title: chartHelpText.summary, onClick: () => setView("summary"), selected: currentView === "summary", message: "Summary" },
            React.createElement(BoxplotIcon, null)),
        React.createElement(IconButton, { title: chartHelpText.scatter, onClick: () => setView("scatter"), selected: currentView === "scatter", message: "Scatter Plot" },
            React.createElement(ScatterplotIcon, null)),
        React.createElement(IconButton, { title: chartHelpText.hexbin, onClick: () => setView("hexbin"), selected: currentView === "hexbin", message: "Area Plot" },
            React.createElement(HexbinIcon, null)),
        !largeDataset && dimensions.length > 1 && (React.createElement(IconButton, { title: chartHelpText.network, onClick: () => setView("network"), selected: currentView === "network", message: "Network" },
            React.createElement(NetworkIcon, null))),
        !largeDataset && dimensions.length > 0 && (React.createElement(IconButton, { title: chartHelpText.hierarchy, onClick: () => setView("hierarchy"), selected: currentView === "hierarchy", message: "Hierarchy" },
            React.createElement(TreeIcon, null))),
        dimensions.length > 0 && (React.createElement(IconButton, { title: chartHelpText.parallel, onClick: () => setView("parallel"), selected: currentView === "parallel", message: "Parallel Coordinates" },
            React.createElement(ParallelCoordinatesIcon, null))),
        React.createElement(IconButton, { title: chartHelpText.line, onClick: () => setView("line"), selected: currentView === "line", message: "Line Graph" },
            React.createElement(LineChartIcon, null))));
}
