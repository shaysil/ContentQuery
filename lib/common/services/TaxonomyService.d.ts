import { SPHttpClient } from '@microsoft/sp-http';
export declare class TaxonomyService {
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
     * Gets the taxonomy terms associated with the specified taxonomy field's termset
     * @param webUrl : The url of the web which contains the specified list
     * @param listId : The id of the list which contains the specified taxonomy field
     * @param fieldInternalName : The internal name of the taxonomy field on which to extract the termset
     **************************************************************************************************/
    getSiteTaxonomyTermsByTermSet(webUrl: string, listId: string, fieldInternalName: string, lcid?: number): Promise<any>;
    /**************************************************************************************************
     * Gets the termset id out of the specified taxonomy field
     * @param webUrl : The url of the web which contains the specified list
     * @param listId : The id of the list which contains the sepcified field
     * @param fieldInternalName : The internal name of the field on which to extract its termset id
     **************************************************************************************************/
    getListFieldTermSetId(webUrl: string, listId: string, fieldInternalName: string): Promise<string>;
}
