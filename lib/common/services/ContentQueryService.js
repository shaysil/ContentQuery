import * as strings from 'ContentQueryWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { Text, Log } from '@microsoft/sp-core-library';
import { QueryFilterFieldType } from '../../controls/PropertyPaneQueryFilterPanel/components/QueryFilter/QueryFilterFieldType';
import { CamlQueryHelper } from '../helpers/CamlQueryHelper';
import { ListService } from './ListService';
import { SearchService } from './SearchService';
import { PeoplePickerService } from './PeoplePickerService';
import { TaxonomyService } from './TaxonomyService';
var ContentQueryService = /** @class */ (function () {
    /**************************************************************************************************
     * Constructor
     * @param context : A IWebPartContext for logging and page context
     * @param spHttpClient : A SPHttpClient for performing SharePoint specific requests
     **************************************************************************************************/
    function ContentQueryService(context, spHttpClient) {
        this.logSource = "ContentQueryService.ts";
        Log.verbose(this.logSource, "Initializing a new IContentQueryService instance...", context.serviceScope);
        this.context = context;
        this.spHttpClient = spHttpClient;
        this.listService = new ListService(this.spHttpClient);
        this.searchService = new SearchService(this.spHttpClient);
        this.peoplePickerService = new PeoplePickerService(this.spHttpClient);
        this.taxonomyService = new TaxonomyService(this.spHttpClient);
    }
    /**************************************************************************************************
     * Generates the final template context that will be given to handlebars
     * @param querySettings : The settings required for generating the CAML query
     * @param callTimeStamp : The time stamp of the call in order to fight concurency
     **************************************************************************************************/
    ContentQueryService.prototype.getTemplateContext = function (querySettings, callTimeStamp) {
        var _this = this;
        Log.verbose(this.logSource, Text.format("Getting template context for request with queue number {0}...", callTimeStamp), this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            // Initializes the base template context
            var templateContext = {
                pageContext: _this.context.pageContext,
                items: [],
                accessDenied: false,
                webNotFound: false,
                callTimeStamp: callTimeStamp
            };
            // Builds the CAML query based on the webpart settings
            var query = CamlQueryHelper.generateCamlQuery(querySettings);
            Log.info(_this.logSource, Text.format("Generated CAML query {0}...", query), _this.context.serviceScope);
            // Queries the list with the generated caml query
            _this.listService.getListItemsByQuery(querySettings.webUrl, querySettings.listId, query)
                .then(function (data) {
                // Updates the template context with the normalized query results
                var normalizedResults = _this.normalizeQueryResults(data.value, querySettings.viewFields);
                templateContext.items = normalizedResults;
                resolve(templateContext);
            })
                .catch(function (error) {
                // If it fails because previously configured web/list isn't accessible for current user
                if (error.status === 403) {
                    // Still resolve with accessDenied=true so the handlebar template can decide what to render in that case
                    templateContext.accessDenied = true;
                    resolve(templateContext);
                }
                else if (error.status === 404) {
                    // Still resolve with webNotFound=true so the handlebar template can decide what to render in that case
                    templateContext.webNotFound = true;
                    resolve(templateContext);
                }
                else {
                    var errorMessage = error.statusText ? error.statusText : error;
                    reject(errorMessage);
                }
            });
        });
    };
    /**************************************************************************************************
     * Executes an HTTP request against the specified file and returns a promise with it's content
     * @param fileUrl : The url of the file
     **************************************************************************************************/
    ContentQueryService.prototype.getFileContent = function (fileUrl) {
        var _this = this;
        Log.verbose(this.logSource, Text.format("Getting content for file with url '{0}'...", fileUrl), this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            _this.spHttpClient.get(fileUrl, SPHttpClient.configurations.v1).then(function (response) {
                if (response.ok) {
                    if (response.url.indexOf('AccessDenied.aspx') > -1) {
                        reject('Access Denied');
                    }
                    else {
                        resolve(response.text());
                    }
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
    /**************************************************************************************************
     * Gets the available webs for the current user
     **************************************************************************************************/
    ContentQueryService.prototype.getSiteUrlOptions = function () {
        var _this = this;
        Log.verbose(this.logSource, "Loading dropdown options for toolpart property 'Site Url'...", this.context.serviceScope);
        // Resolves the already loaded data if available
        if (this.siteUrlOptions) {
            return Promise.resolve(this.siteUrlOptions);
        }
        // Otherwise, performs a REST call to get the data
        return new Promise(function (resolve, reject) {
            var serverUrl = Text.format("{0}//{1}", window.location.protocol, window.location.hostname);
            _this.searchService.getSitesStartingWith(serverUrl)
                .then(function (urls) {
                // Adds the current site collection url to the ones returned by the search (in case the current site isn't indexed yet)
                _this.ensureUrl(urls, _this.context.pageContext.site.absoluteUrl);
                // Builds the IDropdownOption[] based on the urls
                var options = [{ key: "", text: strings.SiteUrlFieldPlaceholder }];
                var urlOptions = urls.sort().map(function (url) {
                    var serverRelativeUrl = !isEmpty(url.replace(serverUrl, '')) ? url.replace(serverUrl, '') : '/';
                    return { key: url, text: serverRelativeUrl };
                });
                options = options.concat(urlOptions);
                _this.siteUrlOptions = options;
                resolve(options);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Gets the available webs for the current user
     * @param siteUrl : The url of the site from which webs must be loaded from
     **************************************************************************************************/
    ContentQueryService.prototype.getWebUrlOptions = function (siteUrl) {
        var _this = this;
        Log.verbose(this.logSource, "Loading dropdown options for toolpart property 'Web Url'...", this.context.serviceScope);
        // Resolves an empty array if site is null
        if (isEmpty(siteUrl)) {
            return Promise.resolve(new Array());
        }
        // Resolves the already loaded data if available
        if (this.webUrlOptions) {
            return Promise.resolve(this.webUrlOptions);
        }
        // Otherwise, performs a REST call to get the data
        return new Promise(function (resolve, reject) {
            _this.searchService.getWebsFromSite(siteUrl)
                .then(function (urls) {
                // If querying the current site, adds the current site collection url to the ones returned by the search (in case the current web isn't indexed yet)
                if (siteUrl.toLowerCase().trim() === _this.context.pageContext.site.absoluteUrl.toLowerCase().trim()) {
                    _this.ensureUrl(urls, _this.context.pageContext.web.absoluteUrl);
                }
                // Builds the IDropdownOption[] based on the urls
                var options = [{ key: "", text: strings.WebUrlFieldPlaceholder }];
                var urlOptions = urls.sort().map(function (url) {
                    var siteRelativeUrl = !isEmpty(url.replace(siteUrl, '')) ? url.replace(siteUrl, '') : '/';
                    return { key: url, text: siteRelativeUrl };
                });
                options = options.concat(urlOptions);
                _this.webUrlOptions = options;
                resolve(options);
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Gets the available lists from the specified web
     * @param webUrl : The url of the web from which lists must be loaded from
     **************************************************************************************************/
    ContentQueryService.prototype.getListTitleOptions = function (webUrl) {
        var _this = this;
        Log.verbose(this.logSource, "Loading dropdown options for toolpart property 'List Title'...", this.context.serviceScope);
        // Resolves an empty array if web is null
        if (isEmpty(webUrl)) {
            return Promise.resolve(new Array());
        }
        // Resolves the already loaded data if available
        if (this.listTitleOptions) {
            return Promise.resolve(this.listTitleOptions);
        }
        // Otherwise gets the options asynchronously
        return new Promise(function (resolve, reject) {
            _this.listService.getListTitlesFromWeb(webUrl).then(function (listTitles) {
                var options = [{ key: "", text: strings.ListTitleFieldPlaceholder }];
                var listTitleOptions = listTitles.map(function (list) { return { key: list.id, text: list.title }; });
                options = options.concat(listTitleOptions);
                _this.listTitleOptions = options;
                resolve(options);
            })
                .catch(function (error) {
                reject(_this.getErrorMessage(webUrl, error));
            });
        });
    };
    /**************************************************************************************************
     * Gets the available fields out of the specified web/list
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    ContentQueryService.prototype.getOrderByOptions = function (webUrl, listId) {
        var _this = this;
        Log.verbose(this.logSource, "Loading dropdown options for toolpart property 'Order By'...", this.context.serviceScope);
        // Resolves an empty array if no web or no list has been selected
        if (isEmpty(webUrl) || isEmpty(listId)) {
            return Promise.resolve(new Array());
        }
        // Resolves the already loaded data if available
        if (this.orderByOptions) {
            return Promise.resolve(this.orderByOptions);
        }
        // Otherwise gets the options asynchronously
        return new Promise(function (resolve, reject) {
            _this.listService.getListFields(webUrl, listId, ['InternalName', 'Title', 'Sortable'], 'Title').then(function (data) {
                var sortableFields = data.value.filter(function (field) { return field.Sortable == true; });
                var options = [{ key: "", text: strings.queryFilterPanelStrings.queryFilterStrings.fieldSelectLabel }];
                var orderByOptions = sortableFields.map(function (field) { return { key: field.InternalName, text: Text.format("{0} \{\{{1}\}\}", field.Title, field.InternalName) }; });
                options = options.concat(orderByOptions);
                _this.orderByOptions = options;
                resolve(options);
            })
                .catch(function (error) {
                reject(_this.getErrorMessage(webUrl, error));
            });
        });
    };
    /**************************************************************************************************
     * Gets the available fields out of the specified web/list
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    ContentQueryService.prototype.getFilterFields = function (webUrl, listId) {
        var _this = this;
        Log.verbose(this.logSource, "Loading dropdown options for toolpart property 'Filters'...", this.context.serviceScope);
        // Resolves an empty array if no web or no list has been selected
        if (isEmpty(webUrl) || isEmpty(listId)) {
            return Promise.resolve(new Array());
        }
        // Resolves the already loaded data if available
        if (this.filterFields) {
            return Promise.resolve(this.filterFields);
        }
        // Otherwise gets the options asynchronously
        return new Promise(function (resolve, reject) {
            _this.listService.getListFields(webUrl, listId, ['InternalName', 'Title', 'TypeAsString'], 'Title').then(function (data) {
                var fields = data.value;
                var options = fields.map(function (field) {
                    return {
                        internalName: field.InternalName,
                        displayName: field.Title,
                        type: _this.getFieldTypeFromString(field.TypeAsString)
                    };
                });
                _this.filterFields = options;
                resolve(options);
            })
                .catch(function (error) {
                reject(_this.getErrorMessage(webUrl, error));
            });
        });
    };
    /**************************************************************************************************
     * Loads the checklist items for the viewFields property
     * @param webUrl : The url of the web from which the list comes from
     * @param listId : The id of the list from which the field must be loaded from
     **************************************************************************************************/
    ContentQueryService.prototype.getViewFieldsChecklistItems = function (webUrl, listId) {
        var _this = this;
        Log.verbose(this.logSource, "Loading checklist items for toolpart property 'View Fields'...", this.context.serviceScope);
        // Resolves an empty array if no web or no list has been selected
        if (isEmpty(webUrl) || isEmpty(listId)) {
            return Promise.resolve(new Array());
        }
        // Resolves the already loaded data if available
        if (this.viewFields) {
            return Promise.resolve(this.viewFields);
        }
        // Otherwise gets the options asynchronously
        return new Promise(function (resolve, reject) {
            _this.listService.getListFields(webUrl, listId, ['InternalName', 'Title'], 'Title').then(function (data) {
                var fields = data.value;
                var items = fields.map(function (field) {
                    return {
                        id: field.InternalName,
                        label: Text.format("{0} \{\{{1}\}\}", field.Title, field.InternalName)
                    };
                });
                _this.viewFields = items;
                resolve(items);
            })
                .catch(function (error) {
                reject(_this.getErrorMessage(webUrl, error));
            });
        });
    };
    /**************************************************************************************************
     * Returns the user suggestions based on the user entered picker input
     * @param webUrl : The web url on which to query for users
     * @param filterText : The filter specified by the user in the people picker
     * @param currentPersonas : The IPersonaProps already selected in the people picker
     * @param limitResults : The results limit if any
     **************************************************************************************************/
    ContentQueryService.prototype.getPeoplePickerSuggestions = function (webUrl, filterText, currentPersonas, limitResults) {
        var _this = this;
        Log.verbose(this.logSource, "Getting people picker suggestions for toolpart property 'Filters'...", this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            _this.peoplePickerService.getUserSuggestions(webUrl, filterText, 1, 15, limitResults).then(function (data) {
                var users = JSON.parse(data.value);
                var userSuggestions = users.map(function (user) {
                    return {
                        primaryText: user.DisplayText,
                        optionalText: user.EntityData.SPUserID || user.EntityData.SPGroupID
                    };
                });
                resolve(_this.removeUserSuggestionsDuplicates(userSuggestions, currentPersonas));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**************************************************************************************************
     * Returns the taxonomy suggestions based on the user entered picker input
     * @param webUrl : The web url on which to look for the list
     * @param listId : The id of the list on which to look for the taxonomy field
     * @param field : The IQueryFilterField which contains the selected taxonomy field
     * @param filterText : The filter text entered by the user
     * @param currentTerms : The current terms
     **************************************************************************************************/
    ContentQueryService.prototype.getTaxonomyPickerSuggestions = function (webUrl, listId, field, filterText, currentTerms) {
        var _this = this;
        Log.verbose(this.logSource, "Getting taxonomy picker suggestions for toolpart property 'Filters'...", this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            _this.taxonomyService.getSiteTaxonomyTermsByTermSet(webUrl, listId, field.internalName, _this.context.pageContext.web.language).then(function (data) {
                var termField = Text.format('Term{0}', _this.context.pageContext.web.language);
                var terms = data.value;
                var termSuggestions = terms.map(function (term) { return { key: term.Id, name: term[termField] }; });
                resolve(_this.removeTermSuggestionsDuplicates(termSuggestions, currentTerms));
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /*************************************************************************************************
     * Performs a GET request against the specified file path and returns whether it resolved or not
     * @param filePath : The path of the file that needs to be validated against a HEAD request
     *************************************************************************************************/
    ContentQueryService.prototype.ensureFileResolves = function (filePath) {
        var _this = this;
        Log.verbose(this.logSource, Text.format("Checking if file exists at url '{0}'...", filePath), this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            _this.spHttpClient.get(filePath, SPHttpClient.configurations.v1).then(function (response) {
                if (response.ok) {
                    resolve();
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
    /*************************************************************************************************
     * Returns whether the specified file path is a valid .htm or .html filePath
     * @param filePath : The path of the file which needs to be validated
     *************************************************************************************************/
    ContentQueryService.prototype.isValidTemplateFile = function (filePath) {
        Log.verbose(this.logSource, Text.format("Validating template file at url '{0}'...", filePath), this.context.serviceScope);
        var path = filePath.toLowerCase().trim();
        var pathExtension = path.substring(path.lastIndexOf('.'));
        return (pathExtension == '.htm' || pathExtension == '.html');
    };
    /*************************************************************************************************
     * Generates a default handlebars template based on the view fields selected by the user
     * @param viewFields : The view fields that have been selected by the user
     *************************************************************************************************/
    ContentQueryService.prototype.generateDefaultTemplate = function (viewFields) {
        var viewFieldsStr = viewFields.map(function (field) { return Text.format("                    <span><b>{0} : </b>\{\{{0}.textValue\}\}</span>", field); }).join("\n");
        var template = Text.format("<style type=\"text/css\">\n    .dynamic-template .dynamic-items .dynamic-item {\n        background: #ffffff;\n        box-shadow: 0px 0px 6px #bfbebe;\n        margin-bottom: 15px;\n    }\n    .dynamic-template .dynamic-items .dynamic-item h3 {\n        background: #47b4de;\n        color: #fff;\n        padding: 5px 5px 7px 10px;\n        margin: 0px;\n    }\n    .dynamic-template .dynamic-items .dynamic-item .dynamic-item-fields {\n        padding: 10px;\n    }\n    .dynamic-template .dynamic-items .dynamic-item .dynamic-item-fields span {\n        display: block;\n        font-size: 12px;\n    }\n</style>\n\n<div class=\"dynamic-template\">\n    <h2>{0}</h2>\n    <div class=\"dynamic-items\">\n        {{#each items}}\n            <div class=\"dynamic-item\">\n                <h3>Result #{{@index}}</h3>\n                <div class=\"dynamic-item-fields\">\n{1}\n                </div>\n            </div>\n        {{/each}}\n    </div>\n</div>", strings.DynamicallyGeneratedTemplate, viewFieldsStr);
        return template;
    };
    /**************************************************************************************************
     * Resets the stored 'list title' options
     **************************************************************************************************/
    ContentQueryService.prototype.clearCachedWebUrlOptions = function () {
        Log.verbose(this.logSource, "Clearing cached dropdown options for toolpart property 'Web Url'...", this.context.serviceScope);
        this.webUrlOptions = null;
    };
    /**************************************************************************************************
     * Resets the stored 'list title' options
     **************************************************************************************************/
    ContentQueryService.prototype.clearCachedListTitleOptions = function () {
        Log.verbose(this.logSource, "Clearing cached dropdown options for toolpart property 'List Title'...", this.context.serviceScope);
        this.listTitleOptions = null;
    };
    /**************************************************************************************************
     * Resets the stored 'order by' options
     **************************************************************************************************/
    ContentQueryService.prototype.clearCachedOrderByOptions = function () {
        Log.verbose(this.logSource, "Clearing cached dropdown options for toolpart property 'Order By'...", this.context.serviceScope);
        this.orderByOptions = null;
    };
    /**************************************************************************************************
     * Resets the stored filter fields
     **************************************************************************************************/
    ContentQueryService.prototype.clearCachedFilterFields = function () {
        Log.verbose(this.logSource, "Clearing cached dropdown options for toolpart property 'Filter'...", this.context.serviceScope);
        this.filterFields = null;
    };
    /**************************************************************************************************
     * Resets the stored view fields
     **************************************************************************************************/
    ContentQueryService.prototype.clearCachedViewFields = function () {
        Log.verbose(this.logSource, "Clearing cached checklist items for toolpart property 'View Fields'...", this.context.serviceScope);
        this.viewFields = null;
    };
    /**************************************************************************************************
     * Normalizes the results coming from a CAML query into a userfriendly format for handlebars
     * @param results : The results returned by a CAML query executed against a list
     **************************************************************************************************/
    ContentQueryService.prototype.normalizeQueryResults = function (results, viewFields) {
        Log.verbose(this.logSource, "Normalizing results for the requested handlebars context...", this.context.serviceScope);
        var normalizedResults = [];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var result = results_1[_i];
            var normalizedResult = {};
            for (var _a = 0, viewFields_1 = viewFields; _a < viewFields_1.length; _a++) {
                var viewField = viewFields_1[_a];
                var spacesFormattedName = viewField.replace(new RegExp("_x0020_", "g"), "_x005f_x0020_x005f_");
                normalizedResult[viewField] = {
                    textValue: result.FieldValuesAsText[spacesFormattedName],
                    htmlValue: result.FieldValuesAsHtml[spacesFormattedName],
                    rawValue: result[viewField] || result[viewField + 'Id']
                };
            }
            normalizedResults.push(normalizedResult);
        }
        return normalizedResults;
    };
    /**************************************************************************************************
     * Returns an error message based on the specified error object
     * @param error : An error string/object
     **************************************************************************************************/
    ContentQueryService.prototype.getErrorMessage = function (webUrl, error) {
        var errorMessage = error.statusText ? error.statusText : error;
        var serverUrl = Text.format("{0}//{1}", window.location.protocol, window.location.hostname);
        var webServerRelativeUrl = webUrl.replace(serverUrl, '');
        if (error.status === 403) {
            errorMessage = Text.format(strings.ErrorWebAccessDenied, webServerRelativeUrl);
        }
        else if (error.status === 404) {
            errorMessage = Text.format(strings.ErrorWebNotFound, webServerRelativeUrl);
        }
        return errorMessage;
    };
    /**************************************************************************************************
     * Returns a field type enum value based on the provided string type
     * @param fieldTypeStr : The field type as a string
     **************************************************************************************************/
    ContentQueryService.prototype.getFieldTypeFromString = function (fieldTypeStr) {
        var fieldType;
        switch (fieldTypeStr.toLowerCase().trim()) {
            case 'user':
                fieldType = QueryFilterFieldType.User;
                break;
            case 'usermulti':
                fieldType = QueryFilterFieldType.User;
                break;
            case 'datetime':
                fieldType = QueryFilterFieldType.Datetime;
                break;
            case 'lookup':
                fieldType = QueryFilterFieldType.Lookup;
                break;
            case 'url':
                fieldType = QueryFilterFieldType.Url;
                break;
            case 'number':
                fieldType = QueryFilterFieldType.Number;
                break;
            case 'taxonomyfieldtype':
                fieldType = QueryFilterFieldType.Taxonomy;
                break;
            case 'taxonomyfieldtypemulti':
                fieldType = QueryFilterFieldType.Taxonomy;
                break;
            default:
                fieldType = QueryFilterFieldType.Text;
                break;
        }
        return fieldType;
    };
    /**************************************************************************************************
     * Returns the specified users with possible duplicates removed
     * @param users : The user suggestions from which duplicates must be removed
     * @param currentUsers : The current user suggestions that could be duplicates
     **************************************************************************************************/
    ContentQueryService.prototype.removeUserSuggestionsDuplicates = function (users, currentUsers) {
        Log.verbose(this.logSource, "Removing user suggestions duplicates for toolpart property 'Filters'...", this.context.serviceScope);
        var trimmedUsers = [];
        var _loop_1 = function (user) {
            var isDuplicate = currentUsers.filter(function (u) { return u.optionalText === user.optionalText; }).length > 0;
            if (!isDuplicate) {
                trimmedUsers.push(user);
            }
        };
        for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
            var user = users_1[_i];
            _loop_1(user);
        }
        return trimmedUsers;
    };
    /**************************************************************************************************
     * Returns the specified users with possible duplicates removed
     * @param users : The user suggestions from which duplicates must be removed
     * @param currentUsers : The current user suggestions that could be duplicates
     **************************************************************************************************/
    ContentQueryService.prototype.removeTermSuggestionsDuplicates = function (terms, currentTerms) {
        Log.verbose(this.logSource, "Removing term suggestions duplicates for toolpart property 'Filters'...", this.context.serviceScope);
        var trimmedTerms = [];
        var _loop_2 = function (term) {
            var isDuplicate = currentTerms.filter(function (t) { return t.key === term.key; }).length > 0;
            if (!isDuplicate) {
                trimmedTerms.push(term);
            }
        };
        for (var _i = 0, terms_1 = terms; _i < terms_1.length; _i++) {
            var term = terms_1[_i];
            _loop_2(term);
        }
        return trimmedTerms;
    };
    /**************************************************************************************************
     * Makes sure the specified url is in the given collection, otherwise adds it
     * @param urls : An array of urls
     * @param urlToEnsure : The url that needs to be ensured
     **************************************************************************************************/
    ContentQueryService.prototype.ensureUrl = function (urls, urlToEnsure) {
        urlToEnsure = urlToEnsure.toLowerCase().trim();
        var urlExist = urls.filter(function (u) { return u.toLowerCase().trim() === urlToEnsure; }).length > 0;
        if (!urlExist) {
            urls.push(urlToEnsure);
        }
    };
    return ContentQueryService;
}());
export { ContentQueryService };
//# sourceMappingURL=ContentQueryService.js.map