import { Text } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
var SearchService = /** @class */ (function () {
    /**************************************************************************************************
     * Constructor
     * @param httpClient : The spHttpClient required to perform REST calls against SharePoint
     **************************************************************************************************/
    function SearchService(spHttpClient) {
        this.spHttpClient = spHttpClient;
    }
    /**************************************************************************************************
     * Recursively executes the specified search query until all results are fetched
     * @param webUrl : The web url from which to call the REST API
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     **************************************************************************************************/
    SearchService.prototype.getSearchResultsRecursive = function (webUrl, queryParameters) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Executes the search request for a first time in order to have an idea of the returned rows vs total results
            _this.getSearchResults(webUrl, queryParameters)
                .then(function (results) {
                // If there is more rows available...
                var relevantResults = results.PrimaryQueryResult.RelevantResults;
                var initialResults = relevantResults.Table.Rows;
                if (relevantResults.TotalRowsIncludingDuplicates > relevantResults.RowCount) {
                    // Stores and executes all the missing calls in parallel until we have ALL results
                    var promises = new Array();
                    var nbPromises = Math.ceil(relevantResults.TotalRowsIncludingDuplicates / relevantResults.RowCount);
                    for (var i = 1; i < nbPromises; i++) {
                        var nextStartRow = (i * relevantResults.RowCount);
                        promises.push(_this.getSearchResults(webUrl, queryParameters, nextStartRow));
                    }
                    // Once the missing calls are done, concatenates their results to the first request
                    Promise.all(promises).then(function (values) {
                        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                            var recursiveResults = values_1[_i];
                            initialResults = initialResults.concat(recursiveResults.PrimaryQueryResult.RelevantResults.Table.Rows);
                        }
                        results.PrimaryQueryResult.RelevantResults.Table.Rows = initialResults;
                        results.PrimaryQueryResult.RelevantResults.RowCount = initialResults.length;
                        resolve(results);
                    });
                }
                else {
                    resolve(results);
                }
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Recursively executes the specified search query using batches of 500 results until all results are fetched
     * @param webUrl : The web url from which to call the search API
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     * @param startRow : The row from which the search needs to return the results from
     **************************************************************************************************/
    SearchService.prototype.getSearchResults = function (webUrl, queryParameters, startRow) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            queryParameters = _this.ensureSearchQueryParameter(queryParameters, 'StartRow', startRow);
            var endpoint = Text.format("{0}/_api/search/query?{1}", webUrl, queryParameters);
            _this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1).then(function (response) {
                if (response.ok) {
                    resolve(response.json());
                }
                else {
                    reject(response.statusText);
                }
            })
                .catch(function (error) { reject(error); });
        });
    };
    /**************************************************************************************************
     * Recursively searches for all site collections with a path which starts by the specified url
     * @param startingUrl : The url of the domain from which to find the site collections
     **************************************************************************************************/
    SearchService.prototype.getSitesStartingWith = function (startingUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var queryProperties = Text.format("querytext='Path:{0}/* AND contentclass:STS_Site'&selectproperties='Path'&trimduplicates=false&rowLimit=500&Properties='EnableDynamicGroups:true'", startingUrl);
            _this.getSearchResultsRecursive(startingUrl, queryProperties)
                .then(function (results) {
                resolve(_this.getPathsFromResults(results));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Recursively searches for all site collections with a path which starts by the specified url
     * @param siteUrl : The url of the site collection from which to find the webs
     **************************************************************************************************/
    SearchService.prototype.getWebsFromSite = function (siteUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var queryProperties = Text.format("querytext='SPSiteUrl:{0} AND (contentclass:STS_Site OR contentclass:STS_Web)'&selectproperties='Path'&trimduplicates=false&rowLimit=500&Properties='EnableDynamicGroups:true'", siteUrl);
            _this.getSearchResultsRecursive(siteUrl, queryProperties)
                .then(function (results) {
                resolve(_this.getPathsFromResults(results));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Recursively executes the specified search query using batches of 500 results until all results are fetched
     * @param queryParameters : The search query parameters following the "/_api/search/query?" part
     * @param parameterName : The name of the parameter that needs to be ensured
     * @param parameterValue : The value of the parameter that needs to be ensured
     **************************************************************************************************/
    SearchService.prototype.ensureSearchQueryParameter = function (queryParameters, parameterName, parameterValue) {
        if (parameterValue) {
            var strParameter = Text.format("{0}={1}", parameterName, parameterValue);
            queryParameters = queryParameters.replace(new RegExp('StartRow=\\d*', 'gi'), strParameter);
            if (queryParameters.toLowerCase().indexOf(parameterName) < 0) {
                queryParameters += ('&' + strParameter);
            }
        }
        return queryParameters;
    };
    /**************************************************************************************************
     * Gets the paths out of the specified search results
     * @param results : The url of the domain from which to find the site collections
     **************************************************************************************************/
    SearchService.prototype.getPathsFromResults = function (results) {
        var urls = [];
        var pathIndex = null;
        for (var _i = 0, _a = results.PrimaryQueryResult.RelevantResults.Table.Rows; _i < _a.length; _i++) {
            var result = _a[_i];
            // Stores the index of the "Path" cell on the first loop in order to avoid finding the cell on every loop
            if (!pathIndex) {
                var pathCell = result.Cells.filter(function (cell) { return cell.Key == "Path"; })[0];
                pathIndex = result.Cells.indexOf(pathCell);
            }
            urls.push(result.Cells[pathIndex].Value.toLowerCase().trim());
        }
        return urls;
    };
    return SearchService;
}());
export { SearchService };
//# sourceMappingURL=SearchService.js.map