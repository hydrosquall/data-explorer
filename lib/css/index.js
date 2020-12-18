import styled from "styled-components";
import reactTableStyles from "./react-table";
import reactTableFixedColumnStyles from "./react-table-hoc-fixed-columns";
export default styled.div `
  /* React table style customization */
  width: 100%;
  font-family: System-UI, -apple-system, BlinkMacSystemFont, "Source Sans Pro", sans-serif;
  font-size: 0.875rem;


  .ReactTable .rt-thead.-header .rt-th {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#1e1e1e" : "#f2f2f2")};
    padding: 2.5rem 0.75rem 0.5rem;
  }
  .ReactTable.-striped .rt-tr.-odd > div {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#111" : "#fff")};
  }

  .ReactTable.-striped .rt-tr.-even > div {
    color: ${props => (props.theme === "dark" ? "#bbb" : "#111")};
    background-color: ${props => (props.theme === "dark" ? "#111" : "#fff")};
  }

  .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
    /* 
    What does this selector do? 
    These classes were in our react-table style sheet previously
    color: var(--theme-app-fg);
    background: var(--cm-background); 
    */
  }

  .ReactTable .-pagination .-btn {
  }

  /* 
  These parts are mostly copied from the dependency packages, 
  but we remove some things that clash with us
  */
  ${reactTableStyles}
  ${reactTableFixedColumnStyles}
`;
