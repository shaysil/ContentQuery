import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { QueryFilterPanel } from './components/QueryFilterPanel/QueryFilterPanel';
var PropertyPaneQueryFilterPanel = /** @class */ (function () {
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    function PropertyPaneQueryFilterPanel(targetProperty, properties) {
        this.type = PropertyPaneFieldType.Custom;
        this.targetProperty = targetProperty;
        this.properties = {
            filters: properties.filters,
            loadFields: properties.loadFields,
            onLoadTaxonomyPickerSuggestions: properties.onLoadTaxonomyPickerSuggestions,
            onLoadPeoplePickerSuggestions: properties.onLoadPeoplePickerSuggestions,
            onPropertyChange: properties.onPropertyChange,
            trimEmptyFiltersOnChange: properties.trimEmptyFiltersOnChange,
            disabled: properties.disabled,
            strings: properties.strings,
            onRender: this.onRender.bind(this),
            key: targetProperty
        };
    }
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    PropertyPaneQueryFilterPanel.prototype.render = function () {
        if (!this.elem) {
            return;
        }
        this.onRender(this.elem);
    };
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    PropertyPaneQueryFilterPanel.prototype.onRender = function (elem) {
        if (!this.elem) {
            this.elem = elem;
        }
        var queryFilterpanel = React.createElement(QueryFilterPanel, {
            filters: this.properties.filters,
            loadFields: this.properties.loadFields,
            onLoadTaxonomyPickerSuggestions: this.properties.onLoadTaxonomyPickerSuggestions,
            onLoadPeoplePickerSuggestions: this.properties.onLoadPeoplePickerSuggestions,
            onChanged: this.onChanged.bind(this),
            trimEmptyFiltersOnChange: this.properties.trimEmptyFiltersOnChange,
            disabled: this.properties.disabled,
            strings: this.properties.strings,
            // required to allow the component to be re-rendered by calling this.render() externally
            stateKey: new Date().toString()
        });
        ReactDom.render(queryFilterpanel, elem);
    };
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the QueryFilterPanel changes
     *****************************************************************************************/
    PropertyPaneQueryFilterPanel.prototype.onChanged = function (filters) {
        this.properties.onPropertyChange(this.targetProperty, filters);
    };
    return PropertyPaneQueryFilterPanel;
}());
export { PropertyPaneQueryFilterPanel };
//# sourceMappingURL=PropertyPaneQueryFilterPanel.js.map