import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyPaneAsyncChecklistProps } from './IPropertyPaneAsyncChecklistProps';
import { IPropertyPaneAsyncChecklistInternalProps } from './IPropertyPaneAsyncChecklistInternalProps';
export declare class PropertyPaneAsyncChecklist implements IPropertyPaneField<IPropertyPaneAsyncChecklistProps> {
    type: PropertyPaneFieldType;
    targetProperty: string;
    properties: IPropertyPaneAsyncChecklistInternalProps;
    loadedItems: boolean;
    private elem;
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    constructor(targetProperty: string, properties: IPropertyPaneAsyncChecklistProps);
    /*****************************************************************************************
     * Renders the AsyncChecklist property pane
     *****************************************************************************************/
    render(): void;
    /*****************************************************************************************
     * Renders the AsyncChecklist property pane
     *****************************************************************************************/
    private onRender(elem);
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the QueryFilterPanel changes
     *****************************************************************************************/
    private onChange(checkedKeys);
}
