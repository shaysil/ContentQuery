import { SPHttpClient } from '@microsoft/sp-http';
export declare class SearchService {
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
     * Recursively executes the specified search query until all results are fetched
     * @param webUrl : The web url from which to call the REST API
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     **************************************************************************************************/
    getSearchResultsRecursive(webUrl: string, queryParameters: string): Promise<any>;
    /**************************************************************************************************
     * Recursively executes the specified search query using batches of 500 results until all results are fetched
     * @param webUrl : The web url from which to call the search API
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     * @param startRow : The row from which the search needs to return the results from
     **************************************************************************************************/
    getSearchResults(webUrl: string, queryParameters: string, startRow?: number): Promise<any>;
    /**************************************************************************************************
     * Recursively searches for all site collections with a path which starts by the specified url
     * @param startingUrl : The url of the domain from which to find the site collections
     **************************************************************************************************/
    getSitesStartingWith(startingUrl: string): Promise<string[]>;
    /**************************************************************************************************
     * Recursively searches for all site collections with a path which starts by the specified url
     * @param siteUrl : The url of the site collection from which to find the webs
     **************************************************************************************************/
    getWebsFromSite(siteUrl: string): Promise<string[]>;
    /**************************************************************************************************
     * Recursively executes the specified search query using batches of 500 results until all results are fetched
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     * @param parameterName : The name of the parameter that needs to be ensured
     * @param parameterValue : The value of the parameter that needs to be ensured
     **************************************************************************************************/
    private ensureSearchQueryParameter(queryParameters, parameterName, parameterValue);
    /**************************************************************************************************
     * Gets the paths out of the specified search results
     * @param results : The url of the domain from which to find the site collections
     **************************************************************************************************/
    private getPathsFromResults(results);
}
