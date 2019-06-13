/// <reference types="react" />
import * as React from 'react';
import { IContentQueryProps } from './IContentQueryProps';
import { IContentQueryState } from './IContentQueryState';
export default class ContentQuery extends React.Component<IContentQueryProps, IContentQueryState> {
    /*************************************************************************************
     * Constants
     *************************************************************************************/
    private readonly logSource;
    private readonly nsReactContentQuery;
    private readonly nsExternalScripts;
    private readonly callbackOnPreRenderName;
    private readonly callbackOnPostRenderName;
    /*************************************************************************************
     * Stores the timestamps of each async calls in order to wait for the last call in
     * case multiple calls have been fired in a short lapse of time by updaing the
     * toolpane too fast
     *************************************************************************************/
    private onGoingAsyncCalls;
    /*************************************************************************************
     * Component's constructor
     * @param props
     * @param state
     *************************************************************************************/
    constructor(props: IContentQueryProps, state: IContentQueryState);
    /*************************************************************************************
     * Returns whether the specified call is the LAST executed call within the stored calls
     *************************************************************************************/
    private isLastExecutedCall(timeStamp);
    /*************************************************************************************
     * Loads the external scritps sequentially (one after the other) if any
     *************************************************************************************/
    private loadExternalScriptsSequentially(scriptUrls);
    /*************************************************************************************
     * Loads the items asynchronously and wraps them into a context object for handlebars
     *************************************************************************************/
    private loadTemplateContext();
    /*************************************************************************************
     * Load spesific template if selected or the template from url if available, otherwise returns the inline template
     *************************************************************************************/
    private loadTemplate();
    /*************************************************************************************
     * Process the specified handlebars template with the given template context
     * @param templateContent : The handlebars template that needs to be compiled
     * @param templateContext : The context that must be applied to the compiled template
     *************************************************************************************/
    private processTemplate(templateContent, templateContext);
    /*************************************************************************************
     * Executes the specified callback for every external script, if available
     *************************************************************************************/
    private executeExternalCallbacks(callbackName);
    /*************************************************************************************
     * Extracts the file name out of the specified url and normalizes it for a namespace
     *************************************************************************************/
    private generateNamespaceFromScriptUrl(scriptUrl);
    /*************************************************************************************
     * Returns whether all mandatory fields are configured or not
     *************************************************************************************/
    private areMandatoryFieldsConfigured();
    /*************************************************************************************
     * Converts the specified HTML by an object required for dangerouslySetInnerHTML
     * @param html
     *************************************************************************************/
    private createMarkup(html);
    /*************************************************************************************
     * Called once after initial rendering
     *************************************************************************************/
    componentDidMount(): void;
    /*************************************************************************************
     * Gets called when the WebPart refreshes (because of the reactive mode for instance)
     *************************************************************************************/
    componentDidUpdate(prevProps: IContentQueryProps, prevState: IContentQueryState): void;
    /*************************************************************************************
     * Renders the Content by Query WebPart
     *************************************************************************************/
    render(): React.ReactElement<IContentQueryProps>;
}
