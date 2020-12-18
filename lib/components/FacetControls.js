import * as React from "react";
export default function (props) {
    const { removeFunction, focusFunction, dxSettings, facetIndex } = props;
    return React.createElement("div", null,
        React.createElement("button", { onClick: () => { removeFunction(facetIndex); } }, "Remove"),
        React.createElement("button", { onClick: () => { focusFunction(dxSettings); } }, "Focus"));
}
