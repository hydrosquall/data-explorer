import * as React from "react";
import styled from "styled-components";
import PalettePicker from "./PalettePicker";
const CircleSpan = styled.span `
  & {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 20px;
    margin-bottom: -5px;
  }
`;
const LegendItemSpan = styled.span `
  & {
    display: inline-block;
    min-width: 80px;
    margin: 5px;
  }
`;
const LegendWrapper = styled.div `
  & {
    margin-top: 20px;
  }
`;
const HTMLLegend = ({ colorHash, values = Object.keys(colorHash), valueHash, colors = Object.values(colorHash), setColor }) => {
    const updateColorFn = (newColorArray) => {
        setColor(newColorArray);
    };
    return (React.createElement(LegendWrapper, null,
        (values.length > 18
            ? // limit the displayed values to the top 18 and bin everything else into Other
                [...values.filter((d, index) => index < 18), "Other"]
            : values).map((value, index) => colorHash[value] && (React.createElement(LegendItemSpan, { key: `legend-item-${index}` },
            React.createElement(CircleSpan, { style: {
                    background: colorHash[value]
                } }),
            React.createElement("span", { className: "html-legend-item" }, value),
            (valueHash[value] &&
                valueHash[value] > 1 &&
                `(${valueHash[value]})`) ||
                ""))),
        setColor && (React.createElement(PalettePicker, { colors: colors, updateColor: updateColorFn }))));
};
export default HTMLLegend;
