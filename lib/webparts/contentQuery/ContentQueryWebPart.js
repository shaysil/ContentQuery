var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'ContentQueryWebPartStrings';
import { Version, Text, Log } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import { PropertyPaneChoiceGroup } from '@microsoft/sp-webpart-base';
import { PropertyPaneToggle } from '@microsoft/sp-webpart-base';
import { update, get, isEmpty } from '@microsoft/sp-lodash-subset';
import ContentQuery from './components/ContentQuery';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { PropertyPaneQueryFilterPanel } from '../../controls/PropertyPaneQueryFilterPanel/PropertyPaneQueryFilterPanel';
import { PropertyPaneAsyncChecklist } from '../../controls/PropertyPaneAsyncChecklist/PropertyPaneAsyncChecklist';
import { PropertyPaneTextDialog } from '../../controls/PropertyPaneTextDialog/PropertyPaneTextDialog';
import { ContentQueryService } from '../../common/services/ContentQueryService';
import { ContentQueryConstants } from '../../common/constants/ContentQueryConstants';
var ContentQueryWebPart = /** @class */ (function (_super) {
    __extends(ContentQueryWebPart, _super);
    function ContentQueryWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.logSource = "ContentQueryWebPart.ts";
        return _this;
    }
    Object.defineProperty(ContentQueryWebPart.prototype, "dataVersion", {
        /***************************************************************************
         * Returns the WebPart's version
         ***************************************************************************/
        get: function () {
            return Version.parse('1.0.11');
        },
        enumerable: true,
        configurable: true
    });
    /***************************************************************************
     * Initializes the WebPart
     ***************************************************************************/
    ContentQueryWebPart.prototype.onInit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ContentQueryService = new ContentQueryService(_this.context, _this.context.spHttpClient);
            _this.properties.webUrl = _this.properties.siteUrl || _this.properties.webUrl ? _this.properties.webUrl : _this.context.pageContext.web.absoluteUrl.toLocaleLowerCase().trim();
            _this.properties.siteUrl = _this.properties.siteUrl ? _this.properties.siteUrl : _this.context.pageContext.site.absoluteUrl.toLowerCase().trim();
            resolve();
        });
    };
    /***************************************************************************
     * Renders the WebPart
     ***************************************************************************/
    ContentQueryWebPart.prototype.render = function () {
        var querySettings = {
            webUrl: this.properties.webUrl,
            listId: this.properties.listId,
            limitEnabled: this.properties.limitEnabled,
            itemLimit: this.properties.itemLimit,
            recursiveEnabled: this.properties.recursiveEnabled,
            orderBy: this.properties.orderBy,
            orderByDirection: this.properties.orderByDirection,
            filters: this.properties.filters,
            viewFields: this.properties.viewFields,
        };
        var element = React.createElement(ContentQuery, {
            onLoadTemplate: this.loadTemplate.bind(this),
            onLoadTemplateContext: this.loadTemplateContext.bind(this),
            siteUrl: this.properties.siteUrl,
            querySettings: querySettings,
            templateText: this.properties.templateText,
            Selectedtemplate: this.properties.Selectedtemplate,
            templateUrl: this.properties.templateUrl,
            wpContext: this.context,
            externalScripts: this.properties.externalScripts ? this.properties.externalScripts.split('\n').filter(function (script) { return (script && script.trim() != ''); }) : null,
            strings: strings.contentQueryStrings,
            stateKey: new Date().toString()
        });
        ReactDom.render(element, this.domElement);
    };
    Object.defineProperty(ContentQueryWebPart.prototype, "choiceOptions", {
        get: function () {
            var options = new Array();
            var imgCarousel = "https://spoprod-a.akamaihd.net/files/sp-client-prod_2017-08-04.008/image_choicegroup_carousel_82b63fce.png";
            var imgTiles = "https://spoprod-a.akamaihd.net/files/sp-client-prod_2017-08-04.008/image_choicegroup_grid_0503466b.png";
            var imgList = 'https://spoprod-a.akamaihd.net/files/sp-client-prod_2017-08-04.008/image_choicegroup_list_f5a84202.png';
            options.push({ checked: true, imageSrc: imgCarousel, key: "Carousel", text: "Carousel", selectedImageSrc: imgCarousel });
            //  options.push({ checked: false, imageSrc: imgTiles, key: "Grid", text: "Grid", selectedImageSrc: imgTiles });
            //  options.push({ checked: false, imageSrc: imgList, key: "List", text: "List", selectedImageSrc: imgList });
            options.push({ iconProps: { officeFabricIconFontName: 'List' }, text: "List", key: "List" });
            options.push({ iconProps: { officeFabricIconFontName: 'GridViewMedium' }, text: "Grid", key: "Grid" });
            options.push({ iconProps: { officeFabricIconFontName: 'ContactCard' }, text: "Contact Card", key: "ContactCard" });
            options.push({ iconProps: { officeFabricIconFontName: 'Table' }, text: "Table", key: "Table" });
            this._choicGroup = options;
            return this._choicGroup;
        },
        enumerable: true,
        configurable: true
    });
    /***************************************************************************
     * Loads the toolpart configuration
     ***************************************************************************/
    ContentQueryWebPart.prototype.getPropertyPaneConfiguration = function () {
        var firstCascadingLevelDisabled = !this.properties.siteUrl;
        var secondCascadingLevelDisabled = !this.properties.siteUrl || !this.properties.webUrl;
        var thirdCascadingLevelDisabled = !this.properties.siteUrl || !this.properties.webUrl || !this.properties.listId;
        // Creates a custom PropertyPaneAsyncDropdown for the siteUrl property
        this.siteUrlDropdown = new PropertyPaneAsyncDropdown(ContentQueryConstants.propertySiteUrl, {
            label: strings.SiteUrlFieldLabel,
            loadingLabel: strings.SiteUrlFieldLoadingLabel,
            errorLabelFormat: strings.SiteUrlFieldLoadingError,
            loadOptions: this.loadSiteUrlOptions.bind(this),
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            selectedKey: this.properties.siteUrl || ""
        });
        // Creates a custom PropertyPaneAsyncDropdown for the webUrl property
        this.webUrlDropdown = new PropertyPaneAsyncDropdown(ContentQueryConstants.propertyWebUrl, {
            label: strings.WebUrlFieldLabel,
            loadingLabel: strings.WebUrlFieldLoadingLabel,
            errorLabelFormat: strings.WebUrlFieldLoadingError,
            loadOptions: this.loadWebUrlOptions.bind(this),
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            selectedKey: this.properties.webUrl || "",
            disabled: firstCascadingLevelDisabled
        });
        // Creates a custom PropertyPaneAsyncDropdown for the listId property
        this.listTitleDropdown = new PropertyPaneAsyncDropdown(ContentQueryConstants.propertyListId, {
            label: strings.ListTitleFieldLabel,
            loadingLabel: strings.ListTitleFieldLoadingLabel,
            errorLabelFormat: strings.ListTitleFieldLoadingError,
            loadOptions: this.loadListTitleOptions.bind(this),
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            selectedKey: this.properties.listId || "",
            disabled: secondCascadingLevelDisabled
        });
        // Creates a custom PropertyPaneAsyncDropdown for the orderBy property
        this.orderByDropdown = new PropertyPaneAsyncDropdown(ContentQueryConstants.propertyOrderBy, {
            label: strings.OrderByFieldLabel,
            loadingLabel: strings.OrderByFieldLoadingLabel,
            errorLabelFormat: strings.OrderByFieldLoadingError,
            loadOptions: this.loadOrderByOptions.bind(this),
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            selectedKey: this.properties.orderBy || "",
            disabled: thirdCascadingLevelDisabled
        });
        // Creates a custom PropertyPaneQueryFilterPanel for the filters property
        this.filtersPanel = new PropertyPaneQueryFilterPanel(ContentQueryConstants.propertyFilters, {
            filters: this.properties.filters,
            loadFields: this.loadFilterFields.bind(this),
            onLoadTaxonomyPickerSuggestions: this.loadTaxonomyPickerSuggestions.bind(this),
            onLoadPeoplePickerSuggestions: this.loadPeoplePickerSuggestions.bind(this),
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            trimEmptyFiltersOnChange: true,
            disabled: thirdCascadingLevelDisabled,
            strings: strings.queryFilterPanelStrings
        });
        // Creates a custom PropertyPaneAsyncChecklist for the viewFields property
        this.viewFieldsChecklist = new PropertyPaneAsyncChecklist(ContentQueryConstants.propertyViewFields, {
            loadItems: this.loadViewFieldsChecklistItems.bind(this),
            checkedItems: this.properties.viewFields,
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            disable: thirdCascadingLevelDisabled,
            strings: strings.viewFieldsChecklistStrings
        });
        // Creates a custom PropertyPaneTextDialog for the templateText property
        this.templateTextDialog = new PropertyPaneTextDialog(ContentQueryConstants.propertyTemplateText, {
            dialogTextFieldValue: this.properties.templateText,
            onPropertyChange: this.onCustomPropertyPaneChange.bind(this),
            disabled: false,
            strings: strings.templateTextStrings
        });
        // Creates a PropertyPaneChoiceGroup for the orderByDirection property
        this.orderByDirectionChoiceGroup = PropertyPaneChoiceGroup(ContentQueryConstants.propertOrderByDirection, {
            options: [
                { text: strings.ShowItemsAscending, key: 'asc', checked: !this.properties.orderByDirection || this.properties.orderByDirection == 'asc', disabled: secondCascadingLevelDisabled },
                { text: strings.ShowItemsDescending, key: 'desc', checked: this.properties.orderByDirection == 'desc', disabled: secondCascadingLevelDisabled }
            ]
        });
        // Creates a PropertyPaneTextField for the templateUrl property
        this.templateUrlTextField = PropertyPaneTextField(ContentQueryConstants.propertyTemplateUrl, {
            label: strings.TemplateUrlFieldLabel,
            placeholder: strings.TemplateUrlPlaceholder,
            deferredValidationTime: 500,
            onGetErrorMessage: this.onTemplateUrlChange.bind(this)
        });
        // Creates a PropertyPaneToggle for the limitEnabled property
        this.limitEnabledToggle = PropertyPaneToggle(ContentQueryConstants.propertyLimitEnabled, {
            label: strings.LimitEnabledFieldLabel,
            offText: 'Disabled',
            onText: 'Enabled',
            checked: this.properties.limitEnabled,
            disabled: thirdCascadingLevelDisabled
        });
        // Creates a PropertyPaneTextField for the itemLimit property
        this.itemLimitTextField = PropertyPaneTextField(ContentQueryConstants.propertyItemLimit, {
            deferredValidationTime: 500,
            placeholder: strings.ItemLimitPlaceholder,
            disabled: !this.properties.limitEnabled || secondCascadingLevelDisabled,
            onGetErrorMessage: this.onItemLimitChange.bind(this)
        });
        // Creates a PropertyPaneToggle for the limitEnabled property
        this.recursiveEnabledToggle = PropertyPaneToggle(ContentQueryConstants.propertyRecursiveEnabled, {
            label: strings.RecursiveEnabledFieldLabel,
            offText: 'Disabled',
            onText: 'Enabled',
            checked: this.properties.recursiveEnabled,
            disabled: thirdCascadingLevelDisabled
        });
        // Creates a PropertyPaneTextField for the externalScripts property
        this.externalScripts = PropertyPaneTextField(ContentQueryConstants.propertyExternalScripts, {
            label: strings.ExternalScriptsLabel,
            deferredValidationTime: 500,
            placeholder: strings.ExternalScriptsPlaceholder,
            multiline: true,
            rows: 5,
            onGetErrorMessage: function () { return ''; }
        });
        return {
            pages: [
                {
                    header: { description: strings.SourcePageDescription },
                    groups: [
                        {
                            groupName: strings.SourceGroupName,
                            groupFields: [
                                this.siteUrlDropdown,
                                this.webUrlDropdown,
                                this.listTitleDropdown
                            ]
                        }
                    ]
                },
                {
                    header: { description: strings.QueryPageDescription },
                    groups: [
                        {
                            groupName: strings.QueryGroupName,
                            groupFields: [
                                this.orderByDropdown,
                                this.orderByDirectionChoiceGroup,
                                this.limitEnabledToggle,
                                this.itemLimitTextField,
                                this.recursiveEnabledToggle,
                                this.filtersPanel
                            ]
                        }
                    ]
                },
                {
                    header: { description: strings.DisplayPageDescription },
                    groups: [
                        {
                            groupName: strings.DisplayGroupName,
                            groupFields: [
                                this.viewFieldsChecklist,
                                PropertyPaneChoiceGroup('Selectedtemplate', {
                                    label: 'Layout',
                                    options: this.choiceOptions
                                }),
                                this.templateTextDialog,
                                this.templateUrlTextField,
                            ]
                        }
                    ]
                },
                {
                    header: { description: strings.ExternalPageDescription },
                    groups: [
                        {
                            groupName: strings.ExternalGroupName,
                            groupFields: [
                                this.externalScripts
                            ]
                        }
                    ]
                }
            ]
        };
    };
    /***************************************************************************
     * Loads the HandleBars template from the specified url
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadTemplate = function (templateUrl) {
        return this.ContentQueryService.getFileContent(templateUrl);
    };
    /***************************************************************************
     * Loads the HandleBars context based on the specified query
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadTemplateContext = function (querySettings, callTimeStamp) {
        return this.ContentQueryService.getTemplateContext(querySettings, callTimeStamp);
    };
    /***************************************************************************
     * Loads the dropdown options for the webUrl property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadSiteUrlOptions = function () {
        return this.ContentQueryService.getSiteUrlOptions();
    };
    /***************************************************************************
     * Loads the dropdown options for the webUrl property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadWebUrlOptions = function () {
        return this.ContentQueryService.getWebUrlOptions(this.properties.siteUrl);
    };
    /***************************************************************************
     * Loads the dropdown options for the listTitle property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadListTitleOptions = function () {
        return this.ContentQueryService.getListTitleOptions(this.properties.webUrl);
    };
    /***************************************************************************
     * Loads the dropdown options for the orderBy property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadOrderByOptions = function () {
        return this.ContentQueryService.getOrderByOptions(this.properties.webUrl, this.properties.listId);
    };
    /***************************************************************************
     * Loads the dropdown options for the listTitle property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadFilterFields = function () {
        return this.ContentQueryService.getFilterFields(this.properties.webUrl, this.properties.listId);
    };
    /***************************************************************************
     * Loads the checklist items for the viewFields property
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadViewFieldsChecklistItems = function () {
        return this.ContentQueryService.getViewFieldsChecklistItems(this.properties.webUrl, this.properties.listId);
    };
    /***************************************************************************
     * Returns the user suggestions based on the user entered picker input
     * @param filterText : The filter specified by the user in the people picker
     * @param currentPersonas : The IPersonaProps already selected in the people picker
     * @param limitResults : The results limit if any
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadPeoplePickerSuggestions = function (filterText, currentPersonas, limitResults) {
        return this.ContentQueryService.getPeoplePickerSuggestions(this.properties.webUrl, filterText, currentPersonas, limitResults);
    };
    /***************************************************************************
     * Returns the taxonomy suggestions based on the user entered picker input
     * @param field : The taxonomy field from which to load the terms from
     * @param filterText : The filter specified by the user in the people picker
     * @param currentPersonas : The IPersonaProps already selected in the people picker
     * @param limitResults : The results limit if any
     ***************************************************************************/
    ContentQueryWebPart.prototype.loadTaxonomyPickerSuggestions = function (field, filterText, currentTerms) {
        return this.ContentQueryService.getTaxonomyPickerSuggestions(this.properties.webUrl, this.properties.listId, field, filterText, currentTerms);
    };
    /***************************************************************************
     * When a custom property pane updates
     ***************************************************************************/
    ContentQueryWebPart.prototype.onCustomPropertyPaneChange = function (propertyPath, newValue) {
        Log.verbose(this.logSource, "WebPart property '" + propertyPath + "' has changed, refreshing WebPart...", this.context.serviceScope);
        var rerenderTemplateTextDialog = false;
        var oldValue = get(this.properties, propertyPath);
        // Stores the new value in web part properties
        update(this.properties, propertyPath, function () { return newValue; });
        this.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
        // Resets dependent property panes if needed
        this.resetDependentPropertyPanes(propertyPath);
        // If the viewfields have changed, update the default template text if it hasn't been altered by the user
        if (propertyPath == ContentQueryConstants.propertyViewFields && !this.properties.hasDefaultTemplateBeenUpdated) {
            var generatedTemplate_1 = this.ContentQueryService.generateDefaultTemplate(newValue);
            update(this.properties, ContentQueryConstants.propertyTemplateText, function () { return generatedTemplate_1; });
            this.templateTextDialog.properties.dialogTextFieldValue = generatedTemplate_1;
            rerenderTemplateTextDialog = true;
        }
        // If the templateText have changed, update the "hasDefaultTemplateBeenUpdated" to true so the WebPart doesn't override the user template after updating view fields
        if (propertyPath == ContentQueryConstants.propertyTemplateText && !this.properties.hasDefaultTemplateBeenUpdated) {
            update(this.properties, ContentQueryConstants.propertyhasDefaultTemplateBeenUpdated, function () { return true; });
        }
        // Refreshes the web part manually because custom fields don't update since sp-webpart-base@1.1.1
        // https://github.com/SharePoint/sp-dev-docs/issues/594
        if (!this.disableReactivePropertyChanges)
            this.render();
        if (rerenderTemplateTextDialog) {
            this.templateTextDialog.render();
        }
    };
    /***************************************************************************
     * Validates the templateUrl property
     ***************************************************************************/
    ContentQueryWebPart.prototype.onTemplateUrlChange = function (value) {
        var _this = this;
        Log.verbose(this.logSource, "WebPart property 'templateUrl' has changed, refreshing WebPart...", this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            // Doesn't raise any error if file is empty (otherwise error message will show on initial load...)
            if (isEmpty(value)) {
                resolve('');
            }
            else if (!_this.ContentQueryService.isValidTemplateFile(value)) {
                resolve(strings.ErrorTemplateExtension);
            }
            else {
                _this.ContentQueryService.ensureFileResolves(value).then(function (isFileResolving) {
                    resolve('');
                })
                    .catch(function (error) {
                    resolve(Text.format(strings.ErrorTemplateResolve, error));
                });
            }
        });
    };
    /***************************************************************************
     * Validates the itemLimit property
     ***************************************************************************/
    ContentQueryWebPart.prototype.onItemLimitChange = function (value) {
        Log.verbose(this.logSource, "WebPart property 'itemLimit' has changed, refreshing WebPart...", this.context.serviceScope);
        return new Promise(function (resolve, reject) {
            // Resolves an error if the file isn't a valid number between 1 to 999
            var parsedValue = parseInt(value);
            var isNumeric = !isNaN(parsedValue) && isFinite(parsedValue);
            var isValid = (isNumeric && parsedValue >= 1 && parsedValue <= 999) || isEmpty(value);
            resolve(!isValid ? strings.ErrorItemLimit : '');
        });
    };
    /***************************************************************************
     * Resets dependent property panes if needed
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetDependentPropertyPanes = function (propertyPath) {
        if (propertyPath == ContentQueryConstants.propertySiteUrl) {
            this.resetWebUrlPropertyPane();
            this.resetListTitlePropertyPane();
            this.resetOrderByPropertyPane();
            this.resetFiltersPropertyPane();
            this.resetViewFieldsPropertyPane();
        }
        else if (propertyPath == ContentQueryConstants.propertyWebUrl) {
            this.resetListTitlePropertyPane();
            this.resetOrderByPropertyPane();
            this.resetFiltersPropertyPane();
            this.resetViewFieldsPropertyPane();
        }
        else if (propertyPath == ContentQueryConstants.propertyListId) {
            this.resetOrderByPropertyPane();
            this.resetFiltersPropertyPane();
            this.resetViewFieldsPropertyPane();
        }
    };
    /***************************************************************************
     * Resets the List Title property pane and re-renders it
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetWebUrlPropertyPane = function () {
        var _this = this;
        Log.verbose(this.logSource, "Resetting 'webUrl' property...", this.context.serviceScope);
        this.properties.webUrl = "";
        this.ContentQueryService.clearCachedWebUrlOptions();
        update(this.properties, ContentQueryConstants.propertyWebUrl, function () { return _this.properties.webUrl; });
        this.webUrlDropdown.properties.selectedKey = "";
        this.webUrlDropdown.properties.disabled = isEmpty(this.properties.siteUrl);
        this.webUrlDropdown.render();
    };
    /***************************************************************************
     * Resets the List Title property pane and re-renders it
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetListTitlePropertyPane = function () {
        var _this = this;
        Log.verbose(this.logSource, "Resetting 'listTitle' property...", this.context.serviceScope);
        this.properties.listId = null;
        this.ContentQueryService.clearCachedListTitleOptions();
        update(this.properties, ContentQueryConstants.propertyListId, function () { return _this.properties.listId; });
        this.listTitleDropdown.properties.selectedKey = "";
        this.listTitleDropdown.properties.disabled = isEmpty(this.properties.webUrl);
        this.listTitleDropdown.render();
    };
    /***************************************************************************
     * Resets the Filters property pane and re-renders it
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetOrderByPropertyPane = function () {
        var _this = this;
        Log.verbose(this.logSource, "Resetting 'orderBy' property...", this.context.serviceScope);
        this.properties.orderBy = null;
        this.ContentQueryService.clearCachedOrderByOptions();
        update(this.properties, ContentQueryConstants.propertyOrderBy, function () { return _this.properties.orderBy; });
        this.orderByDropdown.properties.selectedKey = "";
        this.orderByDropdown.properties.disabled = isEmpty(this.properties.webUrl) || isEmpty(this.properties.listId);
        this.orderByDropdown.render();
    };
    /***************************************************************************
     * Resets the Filters property pane and re-renders it
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetFiltersPropertyPane = function () {
        var _this = this;
        Log.verbose(this.logSource, "Resetting 'filters' property...", this.context.serviceScope);
        this.properties.filters = null;
        this.ContentQueryService.clearCachedFilterFields();
        update(this.properties, ContentQueryConstants.propertyFilters, function () { return _this.properties.filters; });
        this.filtersPanel.properties.filters = null;
        this.filtersPanel.properties.disabled = isEmpty(this.properties.webUrl) || isEmpty(this.properties.listId);
        this.filtersPanel.render();
    };
    /***************************************************************************
     * Resets the View Fields property pane and re-renders it
     ***************************************************************************/
    ContentQueryWebPart.prototype.resetViewFieldsPropertyPane = function () {
        var _this = this;
        Log.verbose(this.logSource, "Resetting 'viewFields' property...", this.context.serviceScope);
        this.properties.viewFields = null;
        this.ContentQueryService.clearCachedViewFields();
        update(this.properties, ContentQueryConstants.propertyViewFields, function () { return _this.properties.viewFields; });
        this.viewFieldsChecklist.properties.checkedItems = null;
        this.viewFieldsChecklist.properties.disable = isEmpty(this.properties.webUrl) || isEmpty(this.properties.listId);
        this.viewFieldsChecklist.render();
    };
    return ContentQueryWebPart;
}(BaseClientSideWebPart));
export default ContentQueryWebPart;
//# sourceMappingURL=ContentQueryWebPart.js.map