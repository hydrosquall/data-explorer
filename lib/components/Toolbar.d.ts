/// <reference types="react" />
import { View } from "../utilities/types";
interface Props {
    setGrid: () => void;
    dimensions: object[];
    setView: (view: View) => void;
    currentView: string;
    componentType: "toolbar";
    largeDataset?: boolean;
}
export declare function Toolbar({ dimensions, setGrid, setView, currentView, componentType, largeDataset }: Props): JSX.Element;
export declare namespace Toolbar {
    var defaultProps: {
        componentType: string;
        currentView: string;
        dimensions: never[];
        setGrid: () => null;
        setView: () => null;
    };
}
export {};
