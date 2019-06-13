import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyPaneAsyncDropdownProps } from './IPropertyPaneAsyncDropdownProps';
import { IPropertyPaneAsyncDropdownInternalProps } from './IPropertyPaneAsyncDropdownInternalProps';
export declare class PropertyPaneAsyncDropdown implements IPropertyPaneField<IPropertyPaneAsyncDropdownProps> {
    type: PropertyPaneFieldType;
    targetProperty: string;
    properties: IPropertyPaneAsyncDropdownInternalProps;
    private elem;
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    constructor(targetProperty: string, properties: IPropertyPaneAsyncDropdownProps);
    /*****************************************************************************************
     * Renders the AsyncDropdown property pane
     *****************************************************************************************/
    render(): void;
    /*****************************************************************************************
     * Renders the AsyncDropdown property pane
     *****************************************************************************************/
    private onRender(elem);
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the AsyncDropdown changes
     *****************************************************************************************/
    private onChanged(option, index?);
}
