



//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

// import { find, map, isNil, isArray, each, concat, without } from 'lodash';
// import { isObject, newGuid, isNonEmptyString, _track, getWebQueryValue } from 'douhub-helper-util';
// import { getDisplay, getAbstract, getMedia } from './data-helper';


import { isNonEmptyString, isObject } from "./core";
import { find } from "lodash";

export const getEntity = (solution: Record<string, any>, entityName: string, entityType?: string): Record<string, any> | null =>
{

    if (!isNonEmptyString(entityName)) return null;

    let entity = find(solution.entities, (entity) => {
        return entity.entityName === entityName && entity.entityType === entityType;
    });

    if (!isObject(entity)) {
        //we will try to use entityName only
        entity = find(solution.entities, (entity) => {
            return entity.entityName === entityName && !entity.entityType;
        });
    }

    return isObject(entity) ? entity : null;
};

export const getEntityBySlug = (solution: Record<string, any>, slug: string): Record<string, any> | null =>
{

    if (!isNonEmptyString(slug)) return null;

    let entity = find(solution.entities, (entity) => {
        return entity.slug === slug;
    });

    return isObject(entity) ? entity : null;
};

export const getEntityTypeFromFileName = (fileName: string): string | null => {
    if (!isNonEmptyString(fileName)) return null;
    const fileInfo = fileName.split('?')[0];
    var ext = fileInfo.split('.');
    switch (ext[ext.length - 1].toLowerCase()) {
        case 'gif':
        case 'jpeg':
        case 'jpg':
        case 'png':
            {
                return 'Photo';
            }
        case 'mp4':
            {
                return 'Video';
            }
        case 'mp3':
            {
                return 'Audio';
            }
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'csv':
        case 'txt':
        case 'pdf':
        case 'ppt':
        case 'pptx':
        case 'zip':
            {
                return 'Document';
            }
        default:
            {
                return null;
            }
    }
};


// export const generateTreeViewQueryStringValue = (type, entityName, entityType, ids) => {
//     return ids.length == 0 ? '' : `${type}|${entityName}${isNonEmptyString(entityType) ? '|' + entityType : ''}|${ids.join()}`;
// };

// export const getTreeViewQueryStringInfo = (url: string, name: string): Record<string, any> | null => {

//     const queryStringValue = getWebQueryValue(url, name, '');
//     if (!isNonEmptyString(queryStringValue)) return null;
//     const info = queryStringValue?.split('|');
//     if (info && info.length < 3) return null;
//     const result: Record<string, any> = isArray(info) ? { type: info[0], entityName: info[1] } : {};
//     if (info && info.length == 3) result.ids = info[2].length == 0 ? [] : info[2].split(',');
//     if (info && info.length == 4) {
//         result.entityType = info[2];
//         result.ids = info[3].length == 0 ? [] : info[3].split(',');
//     }
//     return result.ids.length == 0 ? null : result;
// };


// export const getFieldsHavingDefaultValue = (tabs) => {
//     let fields:any[] = [];
//     each(tabs, tab => {
//         each(tab.rows, row => {
//             fields = concat(fields, without(map(row.fields, field => {
//                 return field.defaultValue ? field : null;
//             }), null));
//         });
//     });

//     return fields;
// };

// export const getDefaultTab = (tabs) => {
//     const defaultTab = find(tabs, (tab) => tab.default);
//     return defaultTab || tabs[0];
// };


// export const getView = (name, defaultName) => {
//     const view = name ? solution.views[name] : null;
//     return isObject(view) ? view : (isNonEmptyString(defaultName) ? solution.views[defaultName] : null);
// };

// const processNavItem = (item, checkToShow) => {

//     const curStatus = _.getSession(`nav.${item.id}.status`);

//     if (curStatus == 'open' || item.type == 'section' && !isNonEmptyString(curStatus)) {
//         item.open = true;
//     }
//     else {
//         item.open = false;
//     }

//     if (item.sectionId && _.getSession(`nav.${item.sectionId}.status`) == 'close') {
//         item.hidden = true;
//     }
//     else {
//         item.hidden = false;
//     }

//     if (!isNonEmptyString(item.path)) item.path = `/index/${item.id}`;

//     if (!_.isFunction(checkToShow) || _.isFunction(checkToShow) && checkToShow(item)) {
//         if (_.isArray(item.items) && item.items.length > 0) {
//             item.items = without(map(item.items, sub => {
//                 return processNavItem(sub, checkToShow);
//             }), null);
//             if (item.items.length == 0) delete item.items;
//         }
//         return item;
//     }
//     else {
//         return null;
//     }
// };

// export const getQuery = (id) => {
//     return find(solution.queries, (query) => query.id == id);
// };

// export const getNav = (navPath, checkToShow) => {
//     let items = [];
//     navPath = isNonEmptyString(navPath) ? navPath : '';
//     const pathInfo = isNonEmptyString(navPath) ? navPath.split('.') : [];
//     const pageInfo = pathInfo[0];
//     const id = pathInfo.length > 1 ? pathInfo[1] : null;

//     if (navPath.indexOf('entity-lookup-') == 0 || navPath.indexOf('entity-regarding-') == 0) {

//         let entityInfo = pageInfo.split('-');

//         let entityName = null;
//         let entityType = null;

//         switch (entityInfo.length) {
//             case 3:
//                 {
//                     entityName = entityInfo[2];
//                     break;
//                 }
//             case 4:
//                 {
//                     entityName = entityInfo[2];
//                     entityType = entityInfo[3];

//                     const itemEntityNameType = {
//                         id: pageInfo,
//                         type: 'item',
//                         title: 'Lookup',
//                         page: {
//                             layout: 'table',
//                             rowViewId: `${entityName.toLowerCase()}-${entityType.toLowerCase()}-table-record`,
//                             itemViewId: `${entityName.toLowerCase()}-${entityType.toLowerCase()}-list-record`,
//                             pageViewId: `${entityName.toLowerCase()}-${entityType.toLowerCase()}-page`,
//                             query: {
//                                 entityName,
//                                 entityType,
//                                 includeOwnerInfo: 'id,avatar,firstName,lastName,fullName,name,company,title,introduction,twitter',
//                                 orderBy: [
//                                     {
//                                         type: 'desc',
//                                         attribute: 'modifiedOn'
//                                     }
//                                 ]
//                             }
//                         }
//                     };

//                     if (isNonEmptyString(id)) {
//                         if (pageInfo.indexOf('entity-regarding-') == 0) {
//                             itemEntityNameType.page.query.regardingId = id;
//                         }
//                         else {
//                             itemEntityNameType.page.query = getQuery(id);
//                         }
//                     }

//                     //make sure there's rowViewId or itemViewId,
//                     //if there's no such view, we will change it to the video only for entityName
//                     if (!getView(itemEntityNameType.page.itemViewId)) itemEntityNameType.page.itemViewId = `${entityName.toLowerCase()}-list-record`;
//                     if (!getView(itemEntityNameType.page.rowViewId)) itemEntityNameType.page.rowViewId = `${entityName.toLowerCase()}-table-record`;

//                     items.push(itemEntityNameType);
//                     break;
//                 }
//         }


//         const itemEntityNameOnly = {
//             id: pageInfo,
//             type: 'item',
//             title: 'Lookup',
//             page: {
//                 layout: 'table',
//                 rowViewId: `${entityName.toLowerCase()}-table-record`,
//                 itemViewId: `${entityName.toLowerCase()}-list-record`,
//                 pageViewId: `${entityName.toLowerCase()}-page`,
//                 query: {
//                     entityName,
//                     includeOwnerInfo: 'id,avatar,firstName,lastName,fullName,name,company,title,introduction,twitter',
//                     orderBy: [
//                         {
//                             type: 'desc',
//                             attribute: 'modifiedOn'
//                         }
//                     ]
//                 }
//             }
//         };

//         if (isNonEmptyString(id)) {
//             if (pageInfo.indexOf('entity-regarding-') == 0) {
//                 itemEntityNameOnly.page.query.regardingId = id;
//             }
//             else {
//                 itemEntityNameOnly.page.query = getQuery(id);
//             }
//         }

//         items.push(itemEntityNameOnly);
//     }
//     else {
//         if (_.isArray(solution.nav)) items = solution.nav;
//     }

//     return without(map(items, (item) => processNavItem(item, checkToShow)), null);
// };


// export const getMetadataByNavPath = (navPath, checkToShow) => {

//     const navItem = getNavItem(navPath, checkToShow);
//     const itemViewId = navItem && navItem.page && navItem.page.itemViewId;
//     const rowViewId = navItem && navItem.page && navItem.page.rowViewId;
//     const pageViewId = navItem && navItem.page && navItem.page.pageViewId;

//     const pageView = getView(pageViewId, 'default-page-view');
//     const itemView = getView(itemViewId, 'default-item-view');
//     const rowView = getView(rowViewId, 'default-row-view');

//     const query = _.cloneDeep(navItem && navItem.page && navItem.page.query);
//     const entity = isObject(query) && getEntity(query.entityName, query.entityType);
//     return { navItem, query, pageView, itemView, rowView, entity };
// };

// export const getNavItem = (navPath, checkToShow) => {

//     const items = getNav(navPath, checkToShow);
//     const pagePath = navPath.split('.')[0];

//     let navItem = null;
//     let defaultItem = null;
//     each(items, (item) => {
//         if (navItem) return;
//         if (item.id == pagePath) navItem = item;
//         if (item.items && !navItem) {
//             each(item.items, sub => {
//                 if (sub.id == pagePath) navItem = sub;
//             });
//         }
//         if (item.default) defaultItem = item;
//     });
//     if (!navItem && items.length > 0) navItem = defaultItem || items[0];

//     if (navItem) {
//         navItem.path = navItem.path ? navItem.path : `/index/${navItem.id}`;
//     }

//     return navItem;
// };

// export const getFormFields = (entity, name) => {
//     const form = getForm(entity, name);
//     if (!form) return [];
//     const fields = [];

//     each(form.tabs, (tab) => {
//         each(tab.rows, (row) => {
//             each(row.fields, (field) => {
//                 fields.push(field);
//             });
//         });
//     });

//     return fields;
// };

// export const getForm = (entity, name) => {
//     if (!entity) return null;

//     let form = entity.form && entity.form[name] || entity.form && entity.form.default;
//     if (!form) {

//         form = solution.forms[name];

//         const entityGroup = isNonEmptyString(entity.entityGroup) ? `${entity.entityGroup.toLowerCase()}-` : '';

//         if (!form && isNonEmptyString(entityGroup)) {
//             const formName = `${entityGroup}${entity.entityName.toLowerCase()}${isNonEmptyString(entity.entityType) ? '-' + entity.entityType.toLowerCase() : ''}-form-${name}`;
//             form = solution.forms[formName];
//         }

//         if (!form) {
//             const formName = `${entity.entityName.toLowerCase()}${isNonEmptyString(entity.entityType) ? '-' + entity.entityType.toLowerCase() : ''}-form-${name}`;
//             form = solution.forms[formName];
//         }


//         if (!form && isNonEmptyString(entityGroup)) {
//             const formName = `${entityGroup}${entity.entityName.toLowerCase()}${isNonEmptyString(entity.entityType) ? '-' + entity.entityType.toLowerCase() : ''}-form-default`;
//             form = solution.forms[formName];
//         }

//         if (!form) {
//             const formName = `${entity.entityName.toLowerCase()}${isNonEmptyString(entity.entityType) ? '-' + entity.entityType.toLowerCase() : ''}-form-default`;
//             form = solution.forms[formName];
//         }

//         return form;
//     }
// };




// export const getEndpoint = (entity, name) => {
//     return isNonEmptyString(entity && entity[`${name}Endpoint`]) ? entity[`${name}Endpoint`] :
//         `${name == 'search' ? solution.api.search : solution.api.data}/${name == 'search' ? 'query' : name}`;
// };


// export const getPathInfo = (url) => {

//     if (url.indexOf('http') == 0) {
//         const getWebLocation = _.getWebLocation(url);
//         url = getWebLocation.path;
//     }

//     const path = url.split("?")[0];
//     const pathInfo = path.split('/');
//     const rootPath = pathInfo.length > 1 ? pathInfo[1] : "";
//     let pagePath = pathInfo.length > 2 ? pathInfo[2] : "";
//     const pagePathInfo = pagePath.split(".");
//     pagePath = pagePathInfo[0];
//     const idPath = pagePathInfo.length > 1 ? pagePathInfo[1] : null;
//     const navPath = `${pagePath}${isNonEmptyString(idPath) ? '.' + idPath : ''}`;
//     return {
//         path, idPath, navPath, url,
//         rootPath: isNonEmptyString(rootPath) ? rootPath : solution.default.rootPath,
//         pagePath: isNonEmptyString(pagePath) ? pagePath : solution.default.pagePath
//     };
// };

// export const getPathName = (asPath) => {
//     const { pagePath, rootPath } = getPathInfo(asPath);
//     return isNonEmptyString(pagePath) ? `/${rootPath}/${pagePath}` : `/${rootPath}`;
// };



// export const updateFormField = (form, onField) => {
//     form.tabs = map(form.tabs, (tab) => {
//         tab.rows = map(tab.rows, (row) => {
//             row.fields = map(row.fields, (field) => {
//                 return onField(field);
//             });
//             return row;
//         });
//         return tab;
//     });
//     return form;
// };

