/// <reference types="react" />
import * as React from 'react';
import { IQueryFilterPanelProps } from './IQueryFilterPanelProps';
import { IQueryFilterPanelState } from './IQueryFilterPanelState';
export declare class QueryFilterPanel extends React.Component<IQueryFilterPanelProps, IQueryFilterPanelState> {
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    constructor(props: IQueryFilterPanelProps, state: IQueryFilterPanelState);
    /*************************************************************************************
     * Returns a default array with an empty filter
     *************************************************************************************/
    private getDefaultFilters();
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    componentDidMount(): void;
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    componentDidUpdate(prevProps: IQueryFilterPanelProps, prevState: IQueryFilterPanelState): void;
    /*************************************************************************************
     * Loads the available fields asynchronously
     *************************************************************************************/
    private loadFields();
    /*************************************************************************************
     * When one of the filter changes
     *************************************************************************************/
    private onFilterChanged(filter);
    /*************************************************************************************
     * Returns whether the specified filter is empty or not
     * @param filter : The filter that needs to be checked
     *************************************************************************************/
    private isFilterEmpty(filter);
    /*************************************************************************************
     * When the 'Add filter' button is clicked
     *************************************************************************************/
    private onAddFilterClick();
    private sortFiltersByIndex(filters);
    /*************************************************************************************
     * Renders the the QueryFilter component
     *************************************************************************************/
    render(): JSX.Element;
}
