/// <reference types="react" />
import * as React from 'react';
import { IAsyncDropdownProps } from './IAsyncDropdownProps';
import { IAsyncDropdownState } from './IAsyncDropdownState';
export declare class AsyncDropdown extends React.Component<IAsyncDropdownProps, IAsyncDropdownState> {
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    constructor(props: IAsyncDropdownProps, state: IAsyncDropdownState);
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    componentDidMount(): void;
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    componentDidUpdate(prevProps: IAsyncDropdownProps, prevState: IAsyncDropdownState): void;
    /*************************************************************************************
     * Loads the dropdown options asynchronously
     *************************************************************************************/
    private loadOptions();
    /*************************************************************************************
     * Temporary fix because of an issue introducted in office-ui-fabric-react 4.32.0 :
     * https://github.com/OfficeDev/office-ui-fabric-react/issues/2719
     * Issue has been resolved but SPFX still refers to 4.32.0, so this is a temporary fix
     * while waiting for SPFX to use a more recent version of office-ui-fabric-react
     *************************************************************************************/
    private onChanged(option, index?);
    /*************************************************************************************
     * Renders the the AsyncDropdown component
     *************************************************************************************/
    render(): JSX.Element;
}
