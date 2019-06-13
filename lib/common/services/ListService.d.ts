import { SPHttpClient } from '@microsoft/sp-http';
export declare class ListService {
    /***************************************************************************
     * The spHttpClient object used for performing REST calls to SharePoint
     ***************************************************************************/
    private spHttpClient;
    /**************************************************************************************************
     * Constructor
     * @param httpClient : The spHttpClient required to perform REST calls against SharePoint
     **************************************************************************************************/
    constructor(spHttpClient: SPHttpClient);
    /**************************************************************************************************
     * Performs a CAML query against the specified list and returns the resulting items
     * @param webUrl : The url of the web which contains the specified list
     * @param listId : The id of the list which contains the elements to query
     * @param camlQuery : The CAML query to perform on the specified list
     **************************************************************************************************/
    getListItemsByQuery(webUrl: string, listId: string, camlQuery: string): Promise<any>;
    /**************************************************************************************************
     * Returns a sorted array of all available list titles for the specified web
     * @param webUrl : The web URL from which the list titles must be taken from
     **************************************************************************************************/
    getListTitlesFromWeb(webUrl: string): Promise<IListTitle[]>;
    /**************************************************************************************************
     * Returns the available fields for the specified list id
     * @param webUrl : The web URL from which the specified list is located
     * @param listId : The id of the list from which to load the fields
     * @param selectProperties : Optionnaly, the select properties to narrow down the query size
     * @param orderBy : Optionnaly, the by which the results needs to be ordered
     **************************************************************************************************/
    getListFields(webUrl: string, listId: string, selectProperties?: string[], orderBy?: string): Promise<any>;
}
export interface IListTitle {
    id: string;
    title: string;
}
