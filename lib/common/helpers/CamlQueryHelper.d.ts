import { IQuerySettings } from '../../webparts/contentQuery/components/IQuerySettings';
export declare class CamlQueryHelper {
    /*************************************************************************************************
     * Generates a full CAML query based on the provided IQuerySettings
     * @param querySettings : A IQuerySettings object required for generating the CAML query
     *************************************************************************************************/
    static generateCamlQuery(querySettings: IQuerySettings): string;
    /*************************************************************************************************
     * Generates the CAML filters based on the specified array of IQueryFilter objects
     * @param filters : The filters that needs to be converted to a CAML string
     *************************************************************************************************/
    private static generateFilters(filters);
    /*************************************************************************************************
     * Generates a valid CAML filter string based on the specified taxonomy filter
     * @param filter : The taxonomy filter that needs to be formatted into a CAML filter string
     *************************************************************************************************/
    private static generateTaxonomyFilter(filter);
    /*************************************************************************************************
     * Generates a valid CAML filter string based on the specified user filter
     * @param filter : The user filter that needs to be formatted into a CAML filter string
     *************************************************************************************************/
    private static generateUserFilter(filter);
    /*************************************************************************************************
     * Returns the value of the specified filter correctly formatted based on its type of value
     * @param filter : The filter that needs its value to be formatted
     *************************************************************************************************/
    private static formatFilterValue(filter);
    /*************************************************************************************************
     * Converts the specified serialized ISO date into the required string format
     * @param dateValue : A valid ISO 8601 date string
     *************************************************************************************************/
    private static formatDateFilterValue(dateValue);
    /*************************************************************************************************
     * Replaces any "[Today]" or "[Today] +/- [digit]" expression by it's actual value
     * @param filterValue : The filter value
     *************************************************************************************************/
    private static formatDateExpressionFilterValue(filterValue);
    /*************************************************************************************************
     * Formats the specified text filter value
     * @param textValue : The text filter value which needs to be formatted
     *************************************************************************************************/
    private static formatTextFilterValue(textValue);
    /*************************************************************************************************
     * Returns the value of the query string parameter with the specified name
     * @param name : The name of the query string parameter
     * @param url : Optionnaly, the specific url to use instead of the current url
     *************************************************************************************************/
    private static getUrlParameter(name, url?);
}
