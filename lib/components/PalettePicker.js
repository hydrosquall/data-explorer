import * as React from "react";
import { ChromePicker } from "react-color";
import styled from "styled-components";
// NOTE: These styles could be extracted for each of the components used within.
//       In order to get this typescript & styled-components transition in place though,
//       For now this just matches the prior style structure exactly with one big wrapper
//       and one extracted component -- <PaletteButton />
const Wrapper = styled.div `
  & {
    margin: 30px 0;
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
  }
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    opacity: 0.5;
    font-size: 40px;
    line-height: 22px;
  }
  .close:hover {
    opacity: 1;
  }
  .grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  h3 {
    margin: 0 0 20px;
  }
  .box {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    display: inline-block;
    margin: 0 20px 20px 0;
  }
  textarea {
    height: 184px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 5px;
    font-size: 14px;
    border-color: #ccc;
  }
`;
const ColorPickerWrapper = styled.div `
  & {
    width: 225px;
  }
`;
const PalettePickerWrapper = styled.div `
  & {
    margin-top: 30px;
  }
`;
const PaletteButton = styled.button `
  & {
    margin: 0 20px 10px 0;
    -webkit-appearance: none;
    padding: 5px 15px;
    background: white;
    border: 1px solid #bbb;
    border-radius: 3px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 14px;
    color: #555;
  }
  &:hover {
    border-color: #888;
    color: #222;
  }
`;
class PalettePicker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.openClose = () => {
            this.setState({
                open: !this.state.open,
                colors: this.props.colors.join(",\n")
            });
        };
        this.handleChange = (color, position) => {
            this.setState({ selectedColor: color, selectedPosition: position });
        };
        this.pickerChange = (color) => {
            const { colors } = this.props;
            colors[this.state.selectedPosition] = color.hex;
            this.props.updateColor(colors);
            this.setState({ selectedColor: color.hex, colors: colors.join(",\n") });
        };
        this.colorsFromTextarea = () => {
            const parsedTextValue = this.state.colors
                .replace(/\"/g, "")
                .replace(/ /g, "")
                .replace(/\[/g, "")
                .replace(/\]/g, "")
                .replace(/\r?\n|\r/g, "")
                .split(",");
            this.props.updateColor(parsedTextValue);
        };
        this.updateTextArea = (e) => {
            this.setState({ colors: e.target.value });
        };
        this.state = {
            open: false,
            selectedColor: props.colors[0],
            selectedPosition: 0,
            colors: props.colors.join(",\n")
        };
    }
    render() {
        if (!this.state.open) {
            return (React.createElement("div", { style: { display: "inline-block" } },
                React.createElement(PaletteButton, { onClick: this.openClose }, "Adjust Palette")));
        }
        const { colors } = this.props;
        return (React.createElement(Wrapper, null,
            React.createElement("div", { className: "close", role: "button", tabIndex: 0, onClick: this.openClose, onKeyPress: (e) => {
                    if (e.keyCode === 13) {
                        this.openClose();
                    }
                } }, "\u00D7"),
            React.createElement("div", { className: "grid-wrapper" },
                React.createElement("div", null,
                    React.createElement("h3", null, "Select Color"),
                    colors.map((color, index) => (React.createElement("div", { key: `color-${index}`, className: "box", style: { background: color }, role: "button", tabIndex: 0, onKeyPress: (e) => {
                            if (e.keyCode === 13) {
                                this.handleChange(color, index);
                            }
                        }, onClick: () => this.handleChange(color, index) })))),
                React.createElement("div", null,
                    React.createElement("h3", null, "Adjust Color"),
                    React.createElement(ColorPickerWrapper, null,
                        React.createElement(ChromePicker, { color: this.state.selectedColor, onChangeComplete: this.pickerChange }))),
                React.createElement("div", null,
                    React.createElement("h3", null, "Paste New Colors"),
                    React.createElement("textarea", { value: this.state.colors, onChange: this.updateTextArea }),
                    React.createElement(PaletteButton, { onClick: this.colorsFromTextarea }, "Update Colors"))),
            React.createElement(PalettePickerWrapper, null,
                React.createElement("a", { href: `http://projects.susielu.com/viz-palette?colors=[${colors
                        .map(d => `"${d}"`)
                        .join(",")}]&backgroundColor="white"&fontColor="black"` }, "Evaluate This Palette with VIZ PALETTE"))));
    }
}
PalettePicker.defaultProps = {
    metadata: {},
    height: 500
};
export default PalettePicker;
