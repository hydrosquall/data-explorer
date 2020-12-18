import { ScaleLinear } from "d3-scale";
import * as React from "react";
import * as Dx from "../utilities/types";
interface State {
    filterMode: boolean;
    data: object[];
    dataScales: {
        [index: string]: ScaleLinear<number, number>;
    };
    columnExtent: {
        [index: string]: number[];
    };
}
interface ParallelCoordinateOptions {
    primaryKey: string[];
    metrics: Dx.Metric[];
    chart: Dx.Chart;
    colors: Dx.ChartOptions["colors"];
    setColor: Dx.ChartOptions["setColor"];
}
interface Props {
    data: Dx.DataProps["data"];
    schema: Dx.DataProps["schema"];
    options: ParallelCoordinateOptions;
}
declare class ParallelCoordinatesController extends React.Component<Props, State> {
    static defaultProps: {
        metadata: {};
        height: number;
    };
    constructor(props: Props);
    shouldComponentUpdate(): boolean;
    brushing: (selectedExtent: number[], columnName: string) => void;
    render(): JSX.Element;
}
export default ParallelCoordinatesController;
