import * as React from "react";
import styled from "styled-components";
const baseButtonStyle = `
width: 32px;
height: 32px;
cursor: pointer;
color: var(--theme-app-fg);
`;
const BaseButton = styled.button `
  ${baseButtonStyle}
  border: 1px solid var(--theme-app-fg);
  background-color: var(--theme-app-bg);
`;
const SelectedButton = styled.button `
  ${baseButtonStyle}

  border: 1px outset #666;
  background-color: #aaa;
`;
export class IconButton extends React.PureComponent {
    render() {
        const { message, onClick, children, selected } = this.props;
        const { title = message } = this.props;
        const WhichButton = selected ? SelectedButton : BaseButton;
        return (React.createElement(WhichButton, { onClick: onClick, key: message, title: title }, children));
    }
}
