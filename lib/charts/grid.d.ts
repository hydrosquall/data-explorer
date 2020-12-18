import * as React from "react";
import * as Dx from "../utilities/types";
interface State {
    filters: {
        [key: string]: Function;
    };
    showFilters: boolean;
}
interface Props {
    data: {
        data: Dx.Datapoint[];
        schema: Dx.Schema;
    };
    height: number;
    theme?: string;
}
declare class DataResourceTransformGrid extends React.PureComponent<Props, State> {
    static defaultProps: {
        metadata: {};
        height: number;
    };
    constructor(props: Props);
    render(): JSX.Element;
}
export default DataResourceTransformGrid;
