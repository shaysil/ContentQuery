/// <reference types="react" />
import * as React from 'react';
import { ITextDialogProps } from './ITextDialogProps';
import { ITextDialogState } from './ITextDialogState';
import './AceEditor.module.scss';
import 'brace';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
export declare class TextDialog extends React.Component<ITextDialogProps, ITextDialogState> {
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    constructor(props: ITextDialogProps, state: ITextDialogState);
    /*************************************************************************************
     * Shows the dialog
     *************************************************************************************/
    private showDialog();
    /*************************************************************************************
     * Notifies the parent with the dialog's latest value, then closes the dialog
     *************************************************************************************/
    private saveDialog();
    /*************************************************************************************
     * Closes the dialog without notifying the parent for any changes
     *************************************************************************************/
    private cancelDialog();
    /*************************************************************************************
     * Updates the dialog's value each time the textfield changes
     *************************************************************************************/
    private onDialogTextChanged(newValue);
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    componentDidUpdate(prevProps: ITextDialogProps, prevState: ITextDialogState): void;
    /*************************************************************************************
     * Renders the the TextDialog component
     *************************************************************************************/
    render(): JSX.Element;
}
