import { SPHttpClient } from '@microsoft/sp-http';
export declare class PeoplePickerService {
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
     * @param webUrl : The url of the current web
     * @param query : The query on which the user suggestions must be based on
     * @param principalSource : The source to search (15=All, 4=Membership Provider, 8=Role Provider, 1=User Info List, 2=Windows)
     * @param principalType : The type of entities returned (15=All, 2=Distribution Lists, 4=Security Groups,8=SharePoint Groups, 1=Users)
     * @param maximumEntitySuggestion : Limit the amount of returned results
     **************************************************************************************************/
    getUserSuggestions(webUrl: string, query: string, principalSource: number, principalType: number, maximumEntitySuggestion?: number): Promise<any>;
}
