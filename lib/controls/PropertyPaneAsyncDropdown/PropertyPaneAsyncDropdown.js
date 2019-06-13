import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { AsyncDropdown } from './components/AsyncDropdown/AsyncDropdown';
var PropertyPaneAsyncDropdown = /** @class */ (function () {
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    function PropertyPaneAsyncDropdown(targetProperty, properties) {
        this.type = PropertyPaneFieldType.Custom;
        this.targetProperty = targetProperty;
        this.properties = {
            label: properties.label,
            loadingLabel: properties.loadingLabel,
            errorLabelFormat: properties.errorLabelFormat,
            loadOptions: properties.loadOptions,
            onPropertyChange: properties.onPropertyChange,
            selectedKey: properties.selectedKey,
            disabled: properties.disabled,
            onRender: this.onRender.bind(this),
            key: targetProperty
        };
    }
    /*****************************************************************************************
     * Renders the AsyncDropdown property pane
     *****************************************************************************************/
    PropertyPaneAsyncDropdown.prototype.render = function () {
        if (!this.elem) {
            return;
        }
        this.onRender(this.elem);
    };
    /*****************************************************************************************
     * Renders the AsyncDropdown property pane
     *****************************************************************************************/
    PropertyPaneAsyncDropdown.prototype.onRender = function (elem) {
        if (!this.elem) {
            this.elem = elem;
        }
        var asyncDropDown = React.createElement(AsyncDropdown, {
            label: this.properties.label,
            loadingLabel: this.properties.loadingLabel,
            errorLabelFormat: this.properties.errorLabelFormat,
            loadOptions: this.properties.loadOptions,
            onChanged: this.onChanged.bind(this),
            selectedKey: this.properties.selectedKey,
            disabled: this.properties.disabled,
            // required to allow the component to be re-rendered by calling this.render() externally
            stateKey: new Date().toString()
        });
        ReactDom.render(asyncDropDown, elem);
    };
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the AsyncDropdown changes
     *****************************************************************************************/
    PropertyPaneAsyncDropdown.prototype.onChanged = function (option, index) {
        this.properties.onPropertyChange(this.targetProperty, option.key);
    };
    return PropertyPaneAsyncDropdown;
}());
export { PropertyPaneAsyncDropdown };
//# sourceMappingURL=PropertyPaneAsyncDropdown.js.map