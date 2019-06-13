import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyPaneQueryFilterPanelProps } from './IPropertyPaneQueryFilterPanelProps';
import { IPropertyPaneQueryFilterPanelInternalProps } from './IPropertyPaneQueryFilterPanelInternalProps';
export declare class PropertyPaneQueryFilterPanel implements IPropertyPaneField<IPropertyPaneQueryFilterPanelProps> {
    type: PropertyPaneFieldType;
    targetProperty: string;
    properties: IPropertyPaneQueryFilterPanelInternalProps;
    private elem;
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    constructor(targetProperty: string, properties: IPropertyPaneQueryFilterPanelProps);
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    render(): void;
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    private onRender(elem);
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the QueryFilterPanel changes
     *****************************************************************************************/
    private onChanged(filters);
}
