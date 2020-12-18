import * as React from "react";
import styled from "styled-components";
const FlexItem = styled.div `
  flex: 1;
  min-width: 0;
`;
function PlaceHolder() {
    return React.createElement("div", null, "This should be a display element!");
}
export const Viz = ({ children, componentType }) => {
    // In the future, the Viz component might be used for things like error boundaries
    return React.createElement(FlexItem, null, children);
};
Viz.defaultProps = { componentType: "viz", children: React.createElement(PlaceHolder, null) };
Viz.displayName = "Viz";
