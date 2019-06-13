import { IPropertyPaneField, PropertyPaneFieldType } from '@microsoft/sp-webpart-base';
import { IPropertyPaneTextDialogProps } from './IPropertyPaneTextDialogProps';
import { IPropertyPaneTextDialogInternalProps } from './IPropertyPaneTextDialogInternalProps';
export declare class PropertyPaneTextDialog implements IPropertyPaneField<IPropertyPaneTextDialogProps> {
    type: PropertyPaneFieldType;
    targetProperty: string;
    properties: IPropertyPaneTextDialogInternalProps;
    private elem;
    /*****************************************************************************************
     * Property pane's contructor
     * @param targetProperty
     * @param properties
     *****************************************************************************************/
    constructor(targetProperty: string, properties: IPropertyPaneTextDialogProps);
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    render(): void;
    /*****************************************************************************************
     * Renders the QueryFilterPanel property pane
     *****************************************************************************************/
    private onRender(elem);
    /*****************************************************************************************
     * Call the property pane's onPropertyChange when the TextDialog changes
     *****************************************************************************************/
    private onChanged(text);
}
