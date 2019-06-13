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
import * as Handlebars from "handlebars";
import * as strings from 'ContentQueryWebPartStrings';
import { Checkbox, Spinner } from 'office-ui-fabric-react';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { Text, Log } from '@microsoft/sp-core-library';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './ContentQuery.module.scss';
var ContentQuery = /** @class */ (function (_super) {
    __extends(ContentQuery, _super);
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    function ContentQuery(props, state) {
        var _this = _super.call(this, props) || this;
        /*************************************************************************************
         * Constants
         *************************************************************************************/
        _this.logSource = "ContentQuery.tsx";
        _this.nsReactContentQuery = "ReactContentQuery";
        _this.nsExternalScripts = "ExternalScripts";
        _this.callbackOnPreRenderName = "onPreRender";
        _this.callbackOnPostRenderName = "onPostRender";
        // Imports the handlebars-helpers
        var helpers = require('handlebars-helpers')({
            handlebars: Handlebars
        });
        // Ensures the WebPart's namespace for external scripts
        window[_this.nsReactContentQuery] = window[_this.nsReactContentQuery] || {};
        window[_this.nsReactContentQuery][_this.nsExternalScripts] = window[_this.nsReactContentQuery][_this.nsExternalScripts] || {};
        _this.onGoingAsyncCalls = [];
        _this.state = { loading: true, processedTemplateResult: null, error: null };
        return _this;
    }
    /*************************************************************************************
     * Returns whether the specified call is the LAST executed call within the stored calls
     *************************************************************************************/
    ContentQuery.prototype.isLastExecutedCall = function (timeStamp) {
        return (this.onGoingAsyncCalls.length > 0 && this.onGoingAsyncCalls.filter(function (t) { return t > timeStamp; }).length == 0);
    };
    /*************************************************************************************
     * Loads the external scritps sequentially (one after the other) if any
     *************************************************************************************/
    ContentQuery.prototype.loadExternalScriptsSequentially = function (scriptUrls) {
        var index = 0;
        var _this_ = this;
        return new Promise(function (resolve, reject) {
            function next() {
                if (scriptUrls && index < scriptUrls.length) {
                    SPComponentLoader.loadScript(scriptUrls[index++])
                        .then(next)
                        .catch(function (error) {
                        // As of August 12th 2017, Log.error doesn't seem to do anything, so I use a console.log on top of it for now.
                        Log.error(_this_.logSource, error, _this_.props.wpContext.serviceScope);
                        console.log(error);
                        next();
                    });
                }
                else {
                    resolve();
                }
            }
            next();
        });
    };
    /*************************************************************************************
     * Loads the items asynchronously and wraps them into a context object for handlebars
     *************************************************************************************/
    ContentQuery.prototype.loadTemplateContext = function () {
        var _this = this;
        if (this.areMandatoryFieldsConfigured()) {
            // Stores the current call timestamp locally 
            var currentCallTimeStamp = new Date().valueOf();
            this.onGoingAsyncCalls.push(currentCallTimeStamp);
            // Sets the state to "loading" only if it's the only async call going on (otherwise it's already loading)
            if (this.onGoingAsyncCalls.length == 1) {
                this.setState({
                    loading: true,
                    processedTemplateResult: null,
                    error: null
                });
            }
            // Fires the async call with its associated timestamp
            this.props.onLoadTemplateContext(this.props.querySettings, currentCallTimeStamp).then(function (templateContext) {
                // Loads the handlebars template
                _this.loadTemplate().then(function (templateContent) {
                    // Only process the result of the current async call if it's the last in the ordered queue
                    if (_this.isLastExecutedCall(templateContext.callTimeStamp)) {
                        // Resets the onGoingAsyncCalls
                        _this.onGoingAsyncCalls = [];
                        // Process the handlebars template
                        _this.processTemplate(templateContent, templateContext);
                    }
                })
                    .catch(function (error) {
                    _this.setState({ loading: false, processedTemplateResult: null, error: Text.format(_this.props.strings.errorLoadingTemplate, error) });
                });
            })
                .catch(function (error) {
                _this.setState({ loading: false, processedTemplateResult: null, error: Text.format(_this.props.strings.errorLoadingQuery, error) });
            });
        }
        else {
            this.setState({ loading: false, processedTemplateResult: null, error: null });
        }
    };
    /*************************************************************************************
     * Load spesific template if selected or the template from url if available, otherwise returns the inline template
     *************************************************************************************/
    ContentQuery.prototype.loadTemplate = function () {
        var _this = this;
        // Resolves the template content if no template url
        if (isEmpty(this.props.Selectedtemplate)) {
            return Promise.resolve(this.props.templateUrl);
        }
        else if (isEmpty(this.props.templateUrl)) {
            return Promise.resolve(this.props.templateText);
        }
        return new Promise(function (resolve, reject) {
            _this.props.onLoadTemplate(_this.props.templateUrl).then(function (templateContent) {
                resolve(templateContent);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /*************************************************************************************
     * Process the specified handlebars template with the given template context
     * @param templateContent : The handlebars template that needs to be compiled
     * @param templateContext : The context that must be applied to the compiled template
     *************************************************************************************/
    ContentQuery.prototype.processTemplate = function (templateContent, templateContext) {
        try {
            // Calls the external OnPreRender callbacks if any
            this.executeExternalCallbacks(this.callbackOnPreRenderName);
            // Processes the template
            var template = Handlebars.compile(templateContent);
            var result = template(templateContext);
            // Updates the state only if the stored calls are still empty (just in case they get updated during the processing of the handlebars template)
            if (this.onGoingAsyncCalls.length == 0) {
                this.setState({ loading: false, processedTemplateResult: result, error: null });
            }
            // Calls the external OnPostRender callbacks if any
            this.executeExternalCallbacks(this.callbackOnPostRenderName);
        }
        catch (error) {
            this.setState({ loading: false, processedTemplateResult: null, error: Text.format(this.props.strings.errorProcessingTemplate, error) });
        }
    };
    /*************************************************************************************
     * Executes the specified callback for every external script, if available
     *************************************************************************************/
    ContentQuery.prototype.executeExternalCallbacks = function (callbackName) {
        if (this.props.externalScripts) {
            // Gets the ReactContentQuery namespace previously created in the constructor
            var ReactContentQuery = window[this.nsReactContentQuery];
            // Loops through all the external scripts of the current WebPart
            for (var _i = 0, _a = this.props.externalScripts; _i < _a.length; _i++) {
                var scriptUrl = _a[_i];
                // Generates a valid namespace suffix based on the current file name
                var namespaceSuffix = this.generateNamespaceFromScriptUrl(scriptUrl);
                // Checks if the current file's namespace is available within the page
                var scriptNamespace = ReactContentQuery[this.nsExternalScripts][namespaceSuffix];
                if (scriptNamespace) {
                    // Checks if the needed callback is available in the script's namespace
                    var callback = scriptNamespace[callbackName];
                    if (callback) {
                        callback(this.props.wpContext, Handlebars);
                    }
                }
            }
        }
    };
    /*************************************************************************************
     * Extracts the file name out of the specified url and normalizes it for a namespace
     *************************************************************************************/
    ContentQuery.prototype.generateNamespaceFromScriptUrl = function (scriptUrl) {
        return scriptUrl.substring(scriptUrl.lastIndexOf('/') + 1).replace('.js', '').replace(/[^a-zA-Z0-9]/g, "");
    };
    /*************************************************************************************
     * Returns whether all mandatory fields are configured or not
     *************************************************************************************/
    ContentQuery.prototype.areMandatoryFieldsConfigured = function () {
        return !isEmpty(this.props.siteUrl) &&
            !isEmpty(this.props.querySettings.webUrl) &&
            !isEmpty(this.props.querySettings.listId) &&
            !isEmpty(this.props.querySettings.viewFields) &&
            (!isEmpty(this.props.Selectedtemplate) || !isEmpty(this.props.templateUrl) || !isEmpty(this.props.templateText));
    };
    /*************************************************************************************
     * Converts the specified HTML by an object required for dangerouslySetInnerHTML
     * @param html
     *************************************************************************************/
    ContentQuery.prototype.createMarkup = function (html) {
        return { __html: html };
    };
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    ContentQuery.prototype.componentDidMount = function () {
        var _this = this;
        this.loadExternalScriptsSequentially(this.props.externalScripts).then(function () {
            _this.loadTemplateContext();
            React.createElement("div", null, "aa");
        });
    };
    /*************************************************************************************
     * Gets called when the WebPart refreshes (because of the reactive mode for instance)
     *************************************************************************************/
    ContentQuery.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        if (prevProps.stateKey !== this.props.stateKey) {
            this.loadExternalScriptsSequentially(this.props.externalScripts).then(function () {
                _this.loadTemplateContext();
                React.createElement("div", null, "bbb");
            });
        }
    };
    /*************************************************************************************
     * Renders the Content by Query WebPart
     *************************************************************************************/
    ContentQuery.prototype.render = function () {
        var loading = this.state.loading ? React.createElement(Spinner, { label: this.props.strings.loadingItems }) : React.createElement("div", null);
        var error = this.state.error ? React.createElement("div", { className: styles.cqwpError }, this.state.error) : React.createElement("div", null);
        var mandatoryFieldsConfigured = this.areMandatoryFieldsConfigured();
        return (React.createElement("div", { className: styles.cqwp },
            loading,
            error,
            !mandatoryFieldsConfigured && !this.state.loading && !this.state.error &&
                React.createElement("div", { className: styles.cqwpValidations },
                    this.props.strings.mandatoryProperties,
                    React.createElement(Checkbox, { label: strings.SiteUrlFieldLabel, checked: !isEmpty(this.props.siteUrl) }),
                    React.createElement(Checkbox, { label: strings.WebUrlFieldLabel, checked: !isEmpty(this.props.querySettings.webUrl) }),
                    React.createElement(Checkbox, { label: strings.ListTitleFieldLabel, checked: !isEmpty(this.props.querySettings.listId) }),
                    React.createElement(Checkbox, { label: strings.viewFieldsChecklistStrings.label, checked: !isEmpty(this.props.querySettings.viewFields) }),
                    React.createElement(Checkbox, { label: strings.templateTextStrings.dialogButtonLabel + " / " + strings.TemplateUrlFieldLabel, checked: (!isEmpty(this.props.Selectedtemplate) || !isEmpty(this.props.templateUrl) || !isEmpty(this.props.templateText)) })),
            mandatoryFieldsConfigured && !this.state.loading && !this.state.error &&
                React.createElement("div", { dangerouslySetInnerHTML: this.createMarkup(this.state.processedTemplateResult) },
                    React.createElement("div", null, "12312312"))));
    };
    return ContentQuery;
}(React.Component));
export default ContentQuery;
//# sourceMappingURL=ContentQuery.js.map