import { Text } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
import { isEmpty } from '@microsoft/sp-lodash-subset';
var TaxonomyService = /** @class */ (function () {
    /**************************************************************************************************
     * Constructor
     * @param httpClient : The spHttpClient required to perform REST calls against SharePoint
     **************************************************************************************************/
    function TaxonomyService(spHttpClient) {
        this.spHttpClient = spHttpClient;
    }
    /**************************************************************************************************
     * Gets the taxonomy terms associated with the specified taxonomy field's termset
     * @param webUrl : The url of the web which contains the specified list
     * @param listId : The id of the list which contains the specified taxonomy field
     * @param fieldInternalName : The internal name of the taxonomy field on which to extract the termset
     **************************************************************************************************/
    TaxonomyService.prototype.getSiteTaxonomyTermsByTermSet = function (webUrl, listId, fieldInternalName, lcid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Gets the termset ID associated with the list field
            _this.getListFieldTermSetId(webUrl, listId, fieldInternalName).then(function (termsetId) {
                // Queries the Taxonomy Hidden list to retreive all terms with their wssIds
                var endpoint = Text.format("{0}/_api/web/lists/GetByTitle('TaxonomyHiddenList')/Items?$select=Term{1},ID&$filter=IdForTermSet eq '{2}'", webUrl, (lcid ? lcid : 1033), termsetId);
                _this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then(function (response) {
                    if (response.ok) {
                        resolve(response.json());
                    }
                    else {
                        reject(response);
                    }
                })
                    .catch(function (error) { reject(error); });
            })
                .catch(function (error) { reject(error); });
        });
    };
    /**************************************************************************************************
     * Gets the termset id out of the specified taxonomy field
     * @param webUrl : The url of the web which contains the specified list
     * @param listId : The id of the list which contains the sepcified field
     * @param fieldInternalName : The internal name of the field on which to extract its termset id
     **************************************************************************************************/
    TaxonomyService.prototype.getListFieldTermSetId = function (webUrl, listId, fieldInternalName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var endpoint = Text.format("{0}/_api/web/lists(guid'{1}')/Fields?$select=IsTermSetValid,TermSetId&$filter=InternalName eq '{2}'", webUrl, listId, fieldInternalName);
            _this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        var fields = data.value;
                        var fieldTermSetId = null;
                        if (fields.length > 0) {
                            var field = fields[0];
                            if (field.IsTermSetValid && !isEmpty(field.TermSetId)) {
                                fieldTermSetId = field.TermSetId;
                            }
                        }
                        resolve(fieldTermSetId);
                    })
                        .catch(function (error) { reject(error); });
                }
                else {
                    reject(response);
                }
            })
                .catch(function (error) { reject(error); });
        });
    };
    return TaxonomyService;
}());
export { TaxonomyService };
//# sourceMappingURL=TaxonomyService.js.map