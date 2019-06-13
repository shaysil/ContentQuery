import { Text } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
var PeoplePickerService = /** @class */ (function () {
    /**************************************************************************************************
     * Constructor
     * @param httpClient : The spHttpClient required to perform REST calls against SharePoint
     **************************************************************************************************/
    function PeoplePickerService(spHttpClient) {
        this.spHttpClient = spHttpClient;
    }
    /**************************************************************************************************
     * Performs a CAML query against the specified list and returns the resulting items
     * @param webUrl : The url of the current web
     * @param query : The query on which the user suggestions must be based on
     * @param principalSource : The source to search (15=All, 4=Membership Provider, 8=Role Provider, 1=User Info List, 2=Windows)
     * @param principalType : The type of entities returned (15=All, 2=Distribution Lists, 4=Security Groups,8=SharePoint Groups, 1=Users)
     * @param maximumEntitySuggestion : Limit the amount of returned results
     **************************************************************************************************/
    PeoplePickerService.prototype.getUserSuggestions = function (webUrl, query, principalSource, principalType, maximumEntitySuggestion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var endpoint = Text.format("{0}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser", webUrl);
            var data = {
                queryParams: {
                    __metadata: {
                        'type': 'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
                    },
                    QueryString: query,
                    PrincipalSource: principalSource,
                    PrincipalType: principalType,
                    MaximumEntitySuggestions: maximumEntitySuggestion || 50
                }
            };
            var options = { headers: { 'odata-version': '3.0' }, body: JSON.stringify(data) };
            _this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, options)
                .then(function (response) {
                if (response.ok) {
                    resolve(response.json());
                }
                else {
                    reject(response.statusText);
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    return PeoplePickerService;
}());
export { PeoplePickerService };
//# sourceMappingURL=PeoplePickerService.js.map