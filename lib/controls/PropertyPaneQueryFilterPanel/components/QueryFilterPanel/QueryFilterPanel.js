var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { Text } from '@microsoft/sp-core-library';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { Spinner, Button, ButtonType, Label } from 'office-ui-fabric-react';
import { QueryFilter } from '../QueryFilter/QueryFilter';
import { QueryFilterOperator } from '../QueryFilter/QueryFilterOperator';
import { QueryFilterJoin } from '../QueryFilter/QueryFilterJoin';
import styles from './QueryFilterPanel.module.scss';
var QueryFilterPanel = /** @class */ (function (_super) {
    __extends(QueryFilterPanel, _super);
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    function QueryFilterPanel(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            loading: true,
            fields: [],
            filters: _this.getDefaultFilters(),
            error: null
        };
        _this.getDefaultFilters = _this.getDefaultFilters.bind(_this);
        _this.loadFields = _this.loadFields.bind(_this);
        return _this;
    }
    /*************************************************************************************
     * Returns a default array with an empty filter
     *************************************************************************************/
    QueryFilterPanel.prototype.getDefaultFilters = function () {
        if (this.props.filters != null && this.props.filters.length > 0) {
            return this.sortFiltersByIndex(this.props.filters);
        }
        var defaultFilters = [
            { index: 0, field: null, operator: QueryFilterOperator.Eq, join: QueryFilterJoin.Or, value: '' }
        ];
        return defaultFilters;
    };
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    QueryFilterPanel.prototype.componentDidMount = function () {
        this.loadFields();
    };
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    QueryFilterPanel.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.disabled !== prevProps.disabled || this.props.stateKey !== prevProps.stateKey) {
            this.loadFields();
        }
    };
    /*************************************************************************************
     * Loads the available fields asynchronously
     *************************************************************************************/
    QueryFilterPanel.prototype.loadFields = function () {
        var _this = this;
        this.setState(function (prevState, props) {
            prevState.loading = true;
            prevState.error = null;
            return prevState;
        });
        this.props.loadFields().then(function (fields) {
            _this.setState(function (prevState, props) {
                prevState.loading = false;
                prevState.fields = fields;
                prevState.filters = _this.getDefaultFilters();
                return prevState;
            });
        })
            .catch(function (error) {
            _this.setState(function (prevState, props) {
                prevState.loading = false;
                prevState.error = error;
                return prevState;
            });
        });
    };
    /*************************************************************************************
     * When one of the filter changes
     *************************************************************************************/
    QueryFilterPanel.prototype.onFilterChanged = function (filter) {
        var _this = this;
        // Makes sure the parent is not notified for no reason if the modified filter was (and still is) considered empty
        var isWorthNotifyingParent = true;
        var oldFilter = this.state.filters.filter(function (i) { return i.index == filter.index; })[0];
        var oldFilterIndex = this.state.filters.indexOf(oldFilter);
        if (this.props.trimEmptyFiltersOnChange && this.isFilterEmpty(oldFilter) && this.isFilterEmpty(filter)) {
            isWorthNotifyingParent = false;
        }
        // Updates the modified filter in the state
        this.state.filters[oldFilterIndex] = cloneDeep(filter);
        this.setState(function (prevState, props) {
            prevState.filters = _this.state.filters;
            return prevState;
        });
        // Notifies the parent with the updated filters
        if (isWorthNotifyingParent) {
            var filters = this.props.trimEmptyFiltersOnChange ? this.state.filters.filter(function (f) { return !_this.isFilterEmpty(f); }) : this.state.filters;
            this.props.onChanged(filters);
        }
    };
    /*************************************************************************************
     * Returns whether the specified filter is empty or not
     * @param filter : The filter that needs to be checked
     *************************************************************************************/
    QueryFilterPanel.prototype.isFilterEmpty = function (filter) {
        var isFilterEmpty = false;
        // If the filter has no field
        if (filter.field == null) {
            isFilterEmpty = true;
        }
        // If the filter has a null or empty value
        if (filter.value == null || isEmpty(filter.value.toString())) {
            // And has no date time expression
            if (isEmpty(filter.expression)) {
                // And isn't a [Me] switch
                if (!filter.me) {
                    // And isn't a <IsNull /> or <IsNotNull /> operator
                    if (filter.operator != QueryFilterOperator.IsNull && filter.operator != QueryFilterOperator.IsNotNull) {
                        isFilterEmpty = true;
                    }
                }
            }
        }
        return isFilterEmpty;
    };
    /*************************************************************************************
     * When the 'Add filter' button is clicked
     *************************************************************************************/
    QueryFilterPanel.prototype.onAddFilterClick = function () {
        var _this = this;
        // Updates the state with an all fresh new filter
        var nextAvailableFilterIndex = this.state.filters[this.state.filters.length - 1].index + 1;
        var newFilter = { index: nextAvailableFilterIndex, field: null, operator: QueryFilterOperator.Eq, join: QueryFilterJoin.Or, value: '' };
        this.state.filters.push(newFilter);
        this.setState(function (prevState, props) {
            prevState.filters = _this.state.filters;
            return prevState;
        });
    };
    QueryFilterPanel.prototype.sortFiltersByIndex = function (filters) {
        return filters.sort(function (a, b) {
            return a.index - b.index;
        });
    };
    /*************************************************************************************
     * Renders the the QueryFilter component
     *************************************************************************************/
    QueryFilterPanel.prototype.render = function () {
        var _this = this;
        var loading = this.state.loading ? React.createElement(Spinner, { label: this.props.strings.loadingFieldsLabel }) : React.createElement("div", null);
        var error = this.state.error != null ? React.createElement("div", { className: "ms-TextField-errorMessage ms-u-slideDownIn20" }, Text.format(this.props.strings.loadingFieldsErrorLabel, this.state.error)) : React.createElement("div", null);
        var filters = this.state.filters.map(function (filter, index) {
            return React.createElement("div", { className: styles.queryFilterPanelItem, key: index },
                React.createElement(QueryFilter, { fields: _this.state.fields, filter: filter, disabled: _this.props.disabled, onLoadTaxonomyPickerSuggestions: _this.props.onLoadTaxonomyPickerSuggestions, onLoadPeoplePickerSuggestions: _this.props.onLoadPeoplePickerSuggestions, onChanged: _this.onFilterChanged.bind(_this), strings: _this.props.strings.queryFilterStrings, key: index }));
        });
        return (React.createElement("div", { className: styles.queryFilterPanel },
            React.createElement(Label, null, this.props.strings.filtersLabel),
            loading,
            !this.state.loading &&
                React.createElement("div", { className: styles.queryFilterPanelItems }, filters),
            !this.state.loading &&
                React.createElement(Button, { buttonType: ButtonType.primary, onClick: this.onAddFilterClick.bind(this), disabled: this.props.disabled }, this.props.strings.addFilterLabel),
            error));
    };
    return QueryFilterPanel;
}(React.Component));
export { QueryFilterPanel };
//# sourceMappingURL=QueryFilterPanel.js.map