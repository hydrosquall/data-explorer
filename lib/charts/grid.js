import * as React from "react";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
import CustomReactTableStyles from "../css/";
const ReactTableFixedColumns = withFixedColumns(ReactTable);
const switchMode = (currentMode) => {
    const nextMode = {
        "=": ">",
        ">": "<",
        "<": "="
    };
    return nextMode[currentMode];
};
const NumberFilter = (props) => {
    const { filterState, filterName, updateFunction, onChange } = props;
    const mode = filterState[filterName] || "=";
    return (React.createElement("form", { style: {
            border: "1px solid gray",
            background: "white",
            borderRadius: "5px",
            width: "100%"
        } },
        React.createElement("input", { type: "text", id: "name", name: "user_name", style: { width: "calc(100% - 30px)", border: "none" }, onChange: (event) => {
                onChange(event.currentTarget.value);
            }, placeholder: "number" }),
        React.createElement("button", { onClick: () => {
                updateFunction({ [filterName]: switchMode(mode) });
            } }, mode)));
};
const stringFilter = () => ({ onChange }) => (React.createElement("form", null,
    React.createElement("input", { type: "text", id: "string-filter", name: "string-filter", onChange: (event) => {
            onChange(event.currentTarget.value);
        }, placeholder: "string" })));
const numberFilterWrapper = (filterState, filterName, updateFunction) => ({ onChange }) => (React.createElement(NumberFilter, { onChange: onChange, filterState: filterState, filterName: filterName, updateFunction: updateFunction }));
const filterNumbers = (mode = "=") => (filter, row) => {
    const filterValue = Number(filter.value);
    if (mode === "=") {
        return row[filter.id] === filterValue;
    }
    else if (mode === "<") {
        return row[filter.id] < filterValue;
    }
    else if (mode === ">") {
        return row[filter.id] > filterValue;
    }
    return row[filter.id];
};
const filterStrings = () => (filter, row) => {
    return (row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1);
};
const columnFilters = {
    integer: numberFilterWrapper,
    number: numberFilterWrapper,
    string: stringFilter
};
const filterMethod = {
    integer: filterNumbers,
    number: filterNumbers,
    string: filterStrings
};
class DataResourceTransformGrid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            showFilters: false
        };
    }
    render() {
        const { data: { data, schema }, height, theme } = this.props;
        const { filters, showFilters } = this.state;
        const { primaryKey = [] } = schema;
        const tableColumns = schema.fields.map((field) => {
            if (field.type === "string" ||
                field.type === "number" ||
                field.type === "integer") {
                return {
                    Header: field.name,
                    accessor: field.name,
                    fixed: primaryKey.indexOf(field.name) !== -1 && "left",
                    filterMethod: (filter, row) => {
                        if (field.type === "string" ||
                            field.type === "number" ||
                            field.type === "integer") {
                            return filterMethod[field.type](filters[field.name])(filter, row);
                        }
                    },
                    // If we don't have a filter defined for this field type, pass an empty div
                    Filter: columnFilters[field.type](filters, field.name, (newFilter) => {
                        this.setState({ filters: Object.assign(Object.assign({}, filters), newFilter) });
                    })
                };
            }
            else {
                return {
                    Header: field.name,
                    id: field.name,
                    accessor: (rowValue) => {
                        return field.type === "boolean" ? rowValue[field.name].toString() : rowValue[field.name];
                    },
                    fixed: primaryKey.indexOf(field.name) !== -1 && "left"
                };
            }
        });
        return (React.createElement(CustomReactTableStyles, { theme: theme },
            React.createElement("button", { 
                //          icon="filter"
                onClick: () => this.setState({ showFilters: !showFilters }) },
                showFilters ? "Hide" : "Show",
                " Filters"),
            React.createElement(ReactTableFixedColumns, { data: data, columns: tableColumns, style: {
                    height: `${height}px`
                }, className: "-striped -highlight", filterable: showFilters })));
    }
}
DataResourceTransformGrid.defaultProps = {
    metadata: {},
    height: 500
};
export default DataResourceTransformGrid;
