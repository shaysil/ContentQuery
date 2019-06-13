var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react';
import { Button, ButtonType, Label } from 'office-ui-fabric-react';
import AceEditor from 'react-ace';
import styles from './TextDialog.module.scss';
import './AceEditor.module.scss';
import 'brace';
import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
var TextDialog = /** @class */ (function (_super) {
    __extends(TextDialog, _super);
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    function TextDialog(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = { dialogText: _this.props.dialogTextFieldValue, showDialog: false };
        return _this;
    }
    /*************************************************************************************
     * Shows the dialog
     *************************************************************************************/
    TextDialog.prototype.showDialog = function () {
        this.setState({ dialogText: this.state.dialogText, showDialog: true });
    };
    /*************************************************************************************
     * Notifies the parent with the dialog's latest value, then closes the dialog
     *************************************************************************************/
    TextDialog.prototype.saveDialog = function () {
        this.setState({ dialogText: this.state.dialogText, showDialog: false });
        if (this.props.onChanged) {
            this.props.onChanged(this.state.dialogText);
        }
    };
    /*************************************************************************************
     * Closes the dialog without notifying the parent for any changes
     *************************************************************************************/
    TextDialog.prototype.cancelDialog = function () {
        this.setState({ dialogText: this.state.dialogText, showDialog: false });
    };
    /*************************************************************************************
     * Updates the dialog's value each time the textfield changes
     *************************************************************************************/
    TextDialog.prototype.onDialogTextChanged = function (newValue) {
        this.setState({ dialogText: newValue, showDialog: this.state.showDialog });
    };
    /*************************************************************************************
     * Called immediately after updating occurs
     *************************************************************************************/
    TextDialog.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.disabled !== prevProps.disabled || this.props.stateKey !== prevProps.stateKey) {
            this.setState({ dialogText: this.props.dialogTextFieldValue, showDialog: this.state.showDialog });
        }
    };
    /*************************************************************************************
     * Renders the the TextDialog component
     *************************************************************************************/
    TextDialog.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Label, null, this.props.strings.dialogButtonLabel),
            React.createElement(Button, { label: this.props.strings.dialogButtonLabel, onClick: this.showDialog.bind(this) }, this.props.strings.dialogButtonText),
            React.createElement(Dialog, { type: DialogType.normal, isOpen: this.state.showDialog, onDismiss: this.cancelDialog.bind(this), title: this.props.strings.dialogTitle, subText: this.props.strings.dialogSubText, isBlocking: true, containerClassName: 'ms-dialogMainOverride ' + styles.textDialog },
                React.createElement(AceEditor, { width: "100%", mode: "html", theme: "monokai", enableLiveAutocompletion: true, showPrintMargin: false, onChange: this.onDialogTextChanged.bind(this), value: this.state.dialogText, name: "CodeEditor", editorProps: { $blockScrolling: 0 } }),
                React.createElement(DialogFooter, null,
                    React.createElement(Button, { buttonType: ButtonType.primary, onClick: this.saveDialog.bind(this) }, this.props.strings.saveButtonText),
                    React.createElement(Button, { onClick: this.cancelDialog.bind(this) }, this.props.strings.cancelButtonText)))));
    };
    return TextDialog;
}(React.Component));
export { TextDialog };
//# sourceMappingURL=TextDialog.js.map