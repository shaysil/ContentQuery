import * as React from 'react';
import * as ReactDom from 'react-dom';
import { PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { TextDialog } from './components/TextDialog/TextDialog';
var PropertyPaneTextDialog = /** @class */ (function () {
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    function PropertyPaneTextDialog(targetProperty, properties) {
        this.type = PropertyPaneFieldType.Custom;
        this.targetProperty = targetProperty;
        this.properties = {
            dialogTextFieldValue: properties.dialogTextFieldValue,
            onPropertyChange: properties.onPropertyChange,
            disabled: properties.disabled,
            strings: properties.strings,
            onRender: this.onRender.bind(this),
            key: targetProperty
        };
    }
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    PropertyPaneTextDialog.prototype.render = function () {
        if (!this.elem) {
            return;
        }
        this.onRender(this.elem);
    };
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    PropertyPaneTextDialog.prototype.onRender = function (elem) {
        if (!this.elem) {
            this.elem = elem;
        }
        var textDialog = React.createElement(TextDialog, {
            dialogTextFieldValue: this.properties.dialogTextFieldValue,
            onChanged: this.onChanged.bind(this),
            disabled: this.properties.disabled,
            strings: this.properties.strings,
            // required to allow the component to be re-rendered by calling this.render() externally
            stateKey: new Date().toString()
        });
        ReactDom.render(textDialog, elem);
    };
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the TextDialog changes
     *****************************************************************************************/
    PropertyPaneTextDialog.prototype.onChanged = function (text) {
        this.properties.onPropertyChange(this.targetProperty, text);
    };
    return PropertyPaneTextDialog;
}());
export { PropertyPaneTextDialog };
//# sourceMappingURL=PropertyPaneTextDialog.js.map