/// <reference types="react" />
interface HTMLLegendProps {
    values?: string[];
    colorHash: {
        [index: string]: string;
    };
    valueHash: {
        [index: string]: number;
    };
    colors?: string[];
    setColor: (color: string[]) => void;
}
declare const HTMLLegend: ({ colorHash, values, valueHash, colors, setColor }: HTMLLegendProps) => JSX.Element;
export default HTMLLegend;
