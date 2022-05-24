
//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isObject, sameGuid } from './core';
import { map, each, isArray, without, cloneDeep, isFunction, findIndex, uniq, isEmpty, find } from 'lodash';

export const getTreeItem = (items: Array<Record<string, any>>,
    func: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => boolean,
    childrenNodeName?: string)
    : Record<string, any> | undefined => {
    if (!childrenNodeName) childrenNodeName = "items";
    let v: Record<string, any> | undefined = undefined;
    if (isArray(items) && items.length > 0) {
        for (let i = 0; i < items.length && !v; i++) {
            const item = items[i];
            if (func(item)) {
                v = item;
            }
            else {
                if (!v) v = getTreeItem(item[childrenNodeName], func, childrenNodeName);
            }
        };
    }
    return v;
}


export const updateAllTreeItems = (items: Array<Record<string, any>>, childrenNodeName?: string,
    func?: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => Record<string, any> | undefined | null)
    : Array<Record<string, any>> => {

    if (!isArray(items)) return items;
    if (!isFunction(func)) return items;
    if (!childrenNodeName) childrenNodeName = "items";
    return without(map(items, (item: any) => {
        const newItem: any = func(item, items, childrenNodeName);
        if (isObject(newItem) && !isEmpty(newItem) && childrenNodeName) newItem[childrenNodeName] = updateAllTreeItems(newItem[childrenNodeName], childrenNodeName, func);
        return isObject(newItem) ? newItem : null;
    }), null);

}


export const updateTreeItem = (items: Array<Record<string, any>>, id: string,
    matchFunc?: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => Record<string, any> | undefined | null,
    notMatchFunc?: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => Record<string, any> | undefined | null,
    childrenNodeName?: string)
    : Array<Record<string, any>> => {
   
    if (!isArray(items)) return items;
    if (!isFunction(matchFunc) && !isFunction(notMatchFunc)) return items;
    if (!childrenNodeName) childrenNodeName = "items";

    return without(map(items, (item: any) => {
        let newItem = {...item}
        if (sameGuid(item.id, id)) {
            if (isFunction(matchFunc)) 
            {
                newItem = matchFunc(newItem, items, childrenNodeName);
            }
        }
        else {
            if (isFunction(notMatchFunc)) newItem = notMatchFunc(newItem, items, childrenNodeName);
        }

        if (isObject(newItem) && !isEmpty(newItem) && childrenNodeName) {
            console.log(4);
            newItem[childrenNodeName] = updateTreeItem(newItem[childrenNodeName], id, matchFunc, notMatchFunc, childrenNodeName);
        }

        return isObject(newItem) ? newItem : null;
    }), null);

}


export const insertTreeItem = (items: Array<Record<string, any>>, id: string, newItem: Record<string, any>, pos: 'above' | 'below' | 'children', childrenNodeName?: string): Array<Record<string, any>> => {

    if (!childrenNodeName) childrenNodeName = "items";
    const idx = findIndex(items, (item) => {
        return sameGuid(item.id, id);
    });

    if (idx >= 0) {
        switch (pos) {
            case "above":
                {
                    if (!find(items, (i: Record<string, any>) => i.text.toLowerCase() == newItem.text.toLowerCase())) {
                        items = [
                            ...items.slice(0, idx),
                            newItem,
                            ...items.slice(idx),
                        ]
                    }
                    break;
                }
            case "below":
                {
                    if (!find(items, (i: Record<string, any>) => i.text.toLowerCase() == newItem.text.toLowerCase())) {
                        items = [
                            ...items.slice(0, idx + 1),
                            newItem,
                            ...items.slice(idx + 1),
                        ]
                    }
                    break;
                }
            default: //child
                {
                    if (!isArray(items[idx].items)) items[idx].items = [];
                    if (!find(items[idx].items, (i: Record<string, any>) => i.text.toLowerCase() == newItem.text.toLowerCase())) {
                        items[idx].items.unshift(newItem);
                    }

                }
        }

        return items;
    }
    else {
        return map(items, (item: Record<string, any>) => {
            if (childrenNodeName && isArray(item[childrenNodeName])) {
                item[childrenNodeName] = insertTreeItem(item[childrenNodeName], id, newItem, pos, childrenNodeName);
            }
            return item;
        });
    }
}

export const replaceTreeItem = (items: Array<Record<string, any>>, id: string, newItem: Record<string, any>, childrenNodeName?: string): Array<Record<string, any>> => {
    return updateTreeItem(items, id, () => { return cloneDeep(newItem) }, undefined, childrenNodeName);
}

export const removeTreeItem = (items: Array<Record<string, any>>, id: string, childrenNodeName?: string): Array<Record<string, any>> => {
    return updateTreeItem(items, id, () => { return null }, undefined, childrenNodeName);
}

//it will return an array that list the parent items 
//{item, path:[grandpaItem, fatherItem]}
export const getTreeItemPath = (items: Array<Record<string, any>>,
    func: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => boolean
    , childrenNodeName?: string,
    result?: Record<string, any>): Record<string, any> => {

    if (!childrenNodeName) childrenNodeName = "items";
    if (!isObject(result)) result = { path: [] }
    each(items, (item) => {
        if (func(item, items, childrenNodeName) && result) {
            result.item = cloneDeep(item);
        }
        else {
            if (!result?.item && childrenNodeName) {
                const parent = cloneDeep(result);
                parent?.push(cloneDeep(item));
                const child = getTreeItemPath(item[childrenNodeName], func, childrenNodeName, parent);
                if (child?.item) result = cloneDeep(child);
            }
        }
    });
    return result ? result : { path: [] };
}


//it will return the prop value of a node
//if the node does have the prop value, it will return the one from the closest parent node that has the prop value.
export const getTreeItemHavingPropValue = (items: Array<Record<string, any>>,
    prop: string,
    func: (item?: Record<string, any>, items?: Array<Record<string, any>>, childrenNodeName?: string) => boolean,
    childrenNodeName?: string)
    : Record<string, any> | undefined => {

    const itemInfo: Record<string, any> = getTreeItemPath(items, func, childrenNodeName);
    if (!itemInfo.item) return undefined; //item not found
    if (itemInfo.item[prop] != undefined) return itemInfo.item;
    for (let i = itemInfo.path.length - 1; i >= 0; i--) {
        if (itemInfo.path[i][prop] != undefined) return itemInfo.path[i];
    }

    return undefined;
}

export const getTreeItemAndChildrenIds = (item: Record<string, any>, ids: Array<string>, childrenNodeName?: string): Array<string> => {
    if (!isObject(item)) return [];
    ids.push(item.id);
    each(item[childrenNodeName ? childrenNodeName : 'items'], (subItem) => {
        ids = getTreeItemAndChildrenIds(subItem, ids, childrenNodeName);
    });
    return uniq(ids);
}
