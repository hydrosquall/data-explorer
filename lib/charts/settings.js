import { ResponsiveNetworkFrame, ResponsiveOrdinalFrame, ResponsiveXYFrame, NetworkFrame, OrdinalFrame, XYFrame } from "semiotic";
import ParallelCoordinatesController from "../components/ParallelCoordinatesController";
import { semioticBarChart } from "./bar";
import { semioticHierarchicalChart } from "./hierarchical";
import { semioticLineChart } from "./line";
import { semioticNetwork } from "./network";
import { semioticSummaryChart } from "./summary";
import { semioticHexbin, semioticScatterplot } from "./xyplot";
const semioticParallelCoordinates = (data, schema, options) => {
    return {
        frameSettings: {
            data,
            schema,
            options
        }
    };
};
export const semioticSettings = {
    line: {
        Frame: ResponsiveXYFrame,
        controls: "switch between linetype",
        chartGenerator: semioticLineChart,
        FacetFrame: XYFrame
    },
    scatter: {
        Frame: ResponsiveXYFrame,
        controls: "switch between modes",
        chartGenerator: semioticScatterplot,
        FacetFrame: XYFrame
    },
    hexbin: {
        Frame: ResponsiveXYFrame,
        controls: "switch between modes",
        chartGenerator: semioticHexbin,
        FacetFrame: XYFrame
    },
    bar: {
        Frame: ResponsiveOrdinalFrame,
        controls: "switch between modes",
        chartGenerator: semioticBarChart,
        FacetFrame: OrdinalFrame
    },
    summary: {
        Frame: ResponsiveOrdinalFrame,
        controls: "switch between modes",
        chartGenerator: semioticSummaryChart,
        FacetFrame: OrdinalFrame
    },
    network: {
        Frame: ResponsiveNetworkFrame,
        controls: "switch between modes",
        chartGenerator: semioticNetwork,
        FacetFrame: NetworkFrame
    },
    hierarchy: {
        Frame: ResponsiveNetworkFrame,
        controls: "switch between modes",
        chartGenerator: semioticHierarchicalChart,
        FacetFrame: NetworkFrame
    },
    parallel: {
        Frame: ParallelCoordinatesController,
        controls: "switch between modes",
        chartGenerator: semioticParallelCoordinates,
        FacetFrame: ParallelCoordinatesController
    }
};
