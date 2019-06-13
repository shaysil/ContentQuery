import { IDropdownOption, IPersonaProps, ITag } from 'office-ui-fabric-react';
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IContentQueryService } from './IContentQueryService';
import { IQueryFilterField } from '../../controls/PropertyPaneQueryFilterPanel/components/QueryFilter/IQueryFilterField';
import { IChecklistItem } from '../../controls/PropertyPaneAsyncChecklist/components/AsyncChecklist/IChecklistItem';
import { IContentQueryTemplateContext } from '../../webparts/contentQuery/components/IContentQueryTemplateContext';
import { IQuerySettings } from '../../webparts/contentQuery/components/IQuerySettings';
export declare class ContentQueryService implements IContentQueryService {
    private readonly logSource;
    /**************************************************************************************************
     * The page context and http clients used for performing REST calls
     **************************************************************************************************/
    private context;
    private spHttpClient;
    /**************************************************************************************************
     * The different services used to perform REST calls
     **************************************************************************************************/
    private listService;
    private searchService;
    private peoplePickerService;
    private taxonomyService;
    /**************************************************************************************************
     * Stores the first async calls locally to avoid useless redundant calls
     **************************************************************************************************/
    private siteUrlOptions;
    private webUrlOptions;
    private listTitleOptions;
    private orderByOptions;
    private filterFields;
    private viewFields;
    /**************************************************************************************************
     * Constructor
     * @param context : A IWebPartContext for logging and page context
     * @param spHttpClient : A SPHttpClient for performing SharePoint specific requests
     **************************************************************************************************/
    constructor(context: WebPartContext, spHttpClient: SPHttpClient);
    /**************************************************************************************************
     * Generates the final template context that will be given to handlebars
     * @param querySettings : The settings required for generating the CAML query
     * @param callTimeStamp : The time stamp of the call in order to fight concurency
     **************************************************************************************************/
    getTemplateContext(querySettings: IQuerySettings, callTimeStamp: number): Promise<IContentQueryTemplateContext>;
    /**************************************************************************************************
     * Executes an HTTP request against the specified file and returns a promise with it's content
     * @param fileUrl : The url of the file
     **************************************************************************************************/
    getFileContent(fileUrl: string): Promise<string>;
    /**************************************************************************************************
     * Gets the available webs for the current user
     **************************************************************************************************/
    getSiteUrlOptions(): Promise<IDropdownOption[]>;
    /**************************************************************************************************
     * Gets the available webs for the current user
     * @param siteUrl : The url of the site from which webs must be loaded from
     **************************************************************************************************/
    getWebUrlOptions(siteUrl: string): Promise<IDropdownOption[]>;
    /**************************************************************************************************
     * Gets the available lists from the specified web
     * @param webUrl : The url of the web from which lists must be loaded from
     **************************************************************************************************/
    getListTitleOptions(webUrl: string): Promise<IDropdownOption[]>;
    /**************************************************************************************************
     * Gets the available fields out of the specified web/list
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    getOrderByOptions(webUrl: string, listId: string): Promise<IDropdownOption[]>;
    /**************************************************************************************************
     * Gets the available fields out of the specified web/list
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    getFilterFields(webUrl: string, listId: string): Promise<IQueryFilterField[]>;
    /**************************************************************************************************
     * Loads the checklist items for the viewFields property
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    getViewFieldsChecklistItems(webUrl: string, listId: string): Promise<IChecklistItem[]>;
    /**************************************************************************************************
     * Returns the user suggestions based on the user entered picker input
     * @param webUrl : The web url on which to query for users
     * @param filterText : The filter specified by the user in the people picker
     * @param currentPersonas : The IPersonaProps already selected in the people picker
     * @param limitResults : The results limit if any
     **************************************************************************************************/
    getPeoplePickerSuggestions(webUrl: string, filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): Promise<IPersonaProps[]>;
    /**************************************************************************************************
     * Returns the taxonomy suggestions based on the user entered picker input
     * @param webUrl : The web url on which to look for the list
     * @param listId : The id of the list on which to look for the taxonomy field
     * @param field : The IQueryFilterField which contains the selected taxonomy field
     * @param filterText : The filter text entered by the user
     * @param currentTerms : The current terms
     **************************************************************************************************/
    getTaxonomyPickerSuggestions(webUrl: string, listId: string, field: IQueryFilterField, filterText: string, currentTerms: ITag[]): Promise<ITag[]>;
    /*************************************************************************************************
     * Performs a GET request against the specified file path and returns whether it resolved or not
     * @param filePath : The path of the file that needs to be validated against a HEAD request
     *************************************************************************************************/
    ensureFileResolves(filePath: string): Promise<{}>;
    /*************************************************************************************************
     * Returns whether the specified file path is a valid .htm or .html filePath
     * @param filePath : The path of the file which needs to be validated
     *************************************************************************************************/
    isValidTemplateFile(filePath: string): boolean;
    /*************************************************************************************************
     * Generates a default handlebars template based on the view fields selected by the user
     * @param viewFields : The view fields that have been selected by the user
     *************************************************************************************************/
    generateDefaultTemplate(viewFields: string[]): string;
    /**************************************************************************************************
     * Resets the stored 'list title' options
     **************************************************************************************************/
    clearCachedWebUrlOptions(): void;
    /**************************************************************************************************
     * Resets the stored 'list title' options
     **************************************************************************************************/
    clearCachedListTitleOptions(): void;
    /**************************************************************************************************
     * Resets the stored 'order by' options
     **************************************************************************************************/
    clearCachedOrderByOptions(): void;
    /**************************************************************************************************
     * Resets the stored filter fields
     **************************************************************************************************/
    clearCachedFilterFields(): void;
    /**************************************************************************************************
     * Resets the stored view fields
     **************************************************************************************************/
    clearCachedViewFields(): void;
    /**************************************************************************************************
     * Normalizes the results coming from a CAML query into a userfriendly format for handlebars
     * @param results : The results returned by a CAML query executed against a list
     **************************************************************************************************/
    private normalizeQueryResults(results, viewFields);
    /**************************************************************************************************
     * Returns an error message based on the specified error object
     * @param error : An error string/object
     **************************************************************************************************/
    private getErrorMessage(webUrl, error);
    /**************************************************************************************************
     * Returns a field type enum value based on the provided string type
     * @param fieldTypeStr : The field type as a string
     **************************************************************************************************/
    private getFieldTypeFromString(fieldTypeStr);
    /**************************************************************************************************
     * Returns the specified users with possible duplicates removed
     * @param users : The user suggestions from which duplicates must be removed
     * @param currentUsers : The current user suggestions that could be duplicates
     **************************************************************************************************/
    private removeUserSuggestionsDuplicates(users, currentUsers);
    /**************************************************************************************************
     * Returns the specified users with possible duplicates removed
     * @param users : The user suggestions from which duplicates must be removed
     * @param currentUsers : The current user suggestions that could be duplicates
     **************************************************************************************************/
    private removeTermSuggestionsDuplicates(terms, currentTerms);
    /**************************************************************************************************
     * Makes sure the specified url is in the given collection, otherwise adds it
     * @param urls : An array of urls
     * @param urlToEnsure : The url that needs to be ensured
     **************************************************************************************************/
    private ensureUrl(urls, urlToEnsure);
}
