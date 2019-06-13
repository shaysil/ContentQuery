/// <reference types="react" />
import * as React from 'react';
import { IAsyncChecklistProps } from './IAsyncChecklistProps';
import { IAsyncChecklistState } from './IAsyncChecklistState';
export declare class AsyncChecklist extends React.Component<IAsyncChecklistProps, IAsyncChecklistState> {
    /*************************************************************************************
     * Stores the checked items
     *************************************************************************************/
    private checkedItems;
    /*************************************************************************************
     * Component's constructor
     *************************************************************************************/
    constructor(props: IAsyncChecklistProps, state: IAsyncChecklistState);
    /*************************************************************************************
     * Gets the default checked items
     *************************************************************************************/
    private getDefaultCheckedItems();
    /*************************************************************************************
     * When a checkbox changes within the checklist
     * @param ev : The React.FormEvent object which contains the element that has changed
     * @param checked : Whether the checkbox is not checked or not
     *************************************************************************************/
    private onCheckboxChange(ev?, checked?);
    /*************************************************************************************
     * Returns whether the checkbox with the specified ID should be checked or not
     * @param checkboxId
     *************************************************************************************/
    private isCheckboxChecked(checkboxId);
    /*************************************************************************************
     * Loads the checklist items asynchronously
     *************************************************************************************/
    private loadItems();
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    componentDidMount(): void;
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    componentDidUpdate(prevProps: IAsyncChecklistProps, prevState: {}): void;
    /*************************************************************************************
     * Renders the the QueryFilter component
     *************************************************************************************/
    render(): JSX.Element;
}
