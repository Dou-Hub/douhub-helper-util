//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isObject as _isObject, isNil, isString, sortBy, without, map,
    capitalize, each,
    isArray, isNumber, forOwn, camelCase, isNaN, isInteger, isFunction, isBoolean } from "lodash";
import { isValidNumber } from "libphonenumber-js";
import { v4 } from 'uuid';
import Constants from './constants';
import slugify from 'slugify';

const { GUID_EMPTY } = Constants;

export const _process: any = typeof process !== "undefined" ? process : {};;
export const _track = `${_process?.env?.TRACK}`.toLowerCase() == 'true';


export const stringToColor = (str: string, s?: number, l?: number) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return `hsl(${h}, ${s && s >= 0 && s <= 100 ? s : 50}%, ${l && l >= 0 && l <= 100 ? l : 50}%)`;
}


export const slug = (text: string) => {
    return !isNonEmptyString(text) ? null : slugify(text.replace(/_/g, '-'), {
        lower: true,
        remove: /[=:?#@!$&'()*+,;"<>%{}|\\^`]/g
    })
        .replace(/\./g, '-')
        .replace(/\//g, '-')
        .toLowerCase();
};


export const isNonEmptyString = (s: any, trim?: boolean): boolean => {
    return (
        isString(s) &&
        ((!trim && s.length > 0) || (trim && s.trim().length > 0))
    ) ? true : false;
};

export const isGuid = (v: any): boolean => {
    if (!isNonEmptyString(v)) return false;
    const pattern = new RegExp(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    return pattern.test(v.replace("{", "").replace("}", "").toLowerCase()) ? true : false;
};

export const isPhoneNumber = (n: any): boolean => {
    if (!isNonEmptyString(n)) return false;
    return isValidNumber(n.trim().replace(/ /g, ""));
};

export const isEmptyString = (s: any, trim?: boolean): boolean => {
    return (
        isString(s) &&
        ((!trim && s.length === 0) || (trim && s.trim().length === 0))
    ) ? true : false;
};

export const newGuid = (): string => {
    return v4();
};

export const assignDeep = (...args: any[]) => {
    const result: Record<string, any> = {};
    for (let i = 0; i < args.length; i++) {
        const item: any = args[i];
        if (_isObject(item)) {
            const objItem: Record<string, any> = item;
            for (const p in objItem) {
                const newPropValue = objItem[p];
                if (_isObject(newPropValue)) {
                    if (isArray(newPropValue)) {
                        result[p] = newPropValue;
                    }
                    else {
                        result[p] = assignDeep({}, result[p], newPropValue);
                    }
                } else {
                    if (!isNil(newPropValue)) result[p] = newPropValue;
                }
            }
        }
    }

    return result;
};


export const assignStyles = (...args: Record<string, any>[]) => {
    let styles = {};
    for (let i = 0; i < args.length; i++) {
        styles = { ...styles, ...args[i] };
    }
    return styles;
};


export const getSubObject = (obj: Record<string, any> | null | undefined, props: string): Record<string, any> | undefined => {
    if (isNil(obj)) return undefined;
    const indirectEval = eval;
    return (indirectEval(`(o)=>(({${props}}) => ({${props}}))(o)`))(obj);
};

export const timeDiff = (d1: Date, d2: Date, type: 'second' | 'sec' | 's' | 'minute' | 'min' | 'm' | 'hour' | 'hr' | 'h') => {
    const diffT = d1.getTime() - d2.getTime();
    if (type == "second" || type == "sec" || type == "s")
        return Math.floor(diffT / 1000);
    if (type == "minute" || type == "min" || type == "m")
        return Math.floor(diffT / 1000 / 60);
    if (type == "hour" || type == "hr" || type == "h")
        return Math.floor(diffT / 1000 / 60 / 60);
    return diffT;
};

export const serialNumber = () => {
    const dt: Date = new Date();
    let dtString: string = new Date(
        dt.getTime() + dt.getTimezoneOffset() * 60000
    ).toISOString();
    dtString = dtString
        .replace(/-/g, "")
        .replace(/:/g, "")
        .replace("Z", "")
        .replace("T", "")
        .replace(/[.]/g, "");
    const c: string[] = dtString.substring(1).split("");

    let result = "";
    let i = 0;
    while (i < c.length) {
        const n: number =
            i < c.length - 1
                ? parseInt(c[i]) * 10 + parseInt(c[i + 1])
                : parseInt(c[i]);
        if (n <= 9) {
            result = result + `n`;
            i = i + 2;
        } else if (n >= 10 && n < 36) {
            result = result + String.fromCharCode("a".charCodeAt(0) + n - 10);
            i = i + 2;
        } else if (n >= 36 && n < 62) {
            result = result + String.fromCharCode("A".charCodeAt(0) + n - 36);
            i = i + 2;
        } else {
            result = result + c[i];
            i = i + 1;
        }
    }
    return result;
};

export const ttl = (mins: number) => {
    if (!isNumber(mins)) mins = 60;
    const date = Date.now();
    return Math.floor(date / 1000) + (mins * 60);
};

export const getObjectPropValue = (obj: Record<string, any> | null | undefined, key: string, caseSensitive?: boolean) => {
    let value = null;

    if (!isNonEmptyString(key)) return value;

    forOwn(obj, (v: any, k: string) => {
        if (
            k &&
            v &&
            ((!caseSensitive && key.toLowerCase() == k.toLowerCase()) ||
                (caseSensitive && key === k))
        ) {
            value = v;
        }
    });

    return value;
};


export const getBooleanPropValue = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: boolean) => {
    if (!isBoolean(defaultValue)) defaultValue = undefined;
    const val = getPropValueOfObject(obj, key);
    if (isBoolean(val)) return val;
    if (isString(val)) return val.toLowerCase().trim() == 'true';
    return defaultValue;
};


export const getIntValueOfObject = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: number | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = undefined;
    const val = getPropValueOfObject(obj, key);
    return !isNaN(parseInt(val)) ? parseInt(val) : defaultValue;
};

export const getFloatValueOfObject = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: number | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = undefined;
    const val = getPropValueOfObject(obj, key);
    return !isNaN(parseFloat(val)) ? parseFloat(val) : defaultValue;
};

export const getBooleanValueOfObject = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: boolean | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = undefined;
    const val = getPropValueOfObject(obj, key);
    if (`${val}`.toLowerCase() == 'true') return true;
    if (`${val}`.toLowerCase() == 'false') return false;
    return defaultValue;
};

export const getArrayPropValueOfObject = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: any[] | null | undefined) => {
    if (!_isObject(defaultValue)) defaultValue = undefined;
    const val = getPropValueOfObject(obj, key);
    return isArray(val) ? val : isNonEmptyString(val) ? JSON.parse(val) : defaultValue;
};

export const getPropValueOfObject = (obj: Record<string, any> | null | undefined, key: string, defaultValue?: any | null | undefined) => {

    if (isNil(defaultValue)) defaultValue = undefined;
    if (!_isObject(obj) || !isNonEmptyString(key)) return null;
    let v = obj[key];
    if (!v) key = key.replace(/-/g, '');
    if (!v) v = obj[key.toLowerCase()];
    if (!v) v = obj[key.toUpperCase()];
    if (!v) v = obj[camelCase(key)];

    if (!v) {
        //try scan all props
        for (const p in obj) {
            if (p.toLowerCase() == key.toLowerCase()) return obj[p];
        }
    }
    return v;
};

const _memoryCache: Record<string, any> = {};

export const getMemoryCache = (key: string) => {

    if (!isNonEmptyString(key)) return null;

    try {
        const result = _memoryCache[key];
        if (result) {
            if (isInteger(result.ttl) && Date.now() > result.ttl * 1000) { //ttl is in seconds
                return null;
            }
            if (!isNil(result.cache)) return result.cache;
        }
    }
    catch (error) {
        console.log(error);
    }

    return null;
};

export const setMemoryCache = (key: string, value: any, expireMinutes: number) => {

    if (!isNonEmptyString(key)) return null;
    if (expireMinutes > 0) {
        _memoryCache[key].ttl = ttl(expireMinutes);
    }
    else {
        _memoryCache[key].ttl = ttl(30 * 24 * 60); //30 days default
    }

    _memoryCache[key].cache = value;
};

export const cleanGuid = (v: string): string => {
    return !v
        ? ""
        : (v + "")
            .replace("{", "")
            .replace("}", "")
            .replace(/_/g, "-")
            .trim()
            .toLowerCase();
};

export const sameGuid = (a: string, b: string): boolean => {
    return cleanGuid(a) === cleanGuid(b);
};

export const isEmptyGuid = (v: string) => {
    return sameGuid(v, GUID_EMPTY);
};

export const checkToTrue = (js: string, props: any): boolean => {

    if (!_isObject(props)) props = {};

    try {
        const func = isFunction(props.jsEvalFunction) ? props.jsEvalFunction(js) : null;
        if (!isFunction(func)) {
            if (func) return true;
        }
        else {
            if (func(props)) return true;
        }
    }
    catch (ex) {
        console.error('Error when evaluating checkToTrue', { ex, js });
    }

    return false;
};

export const isIntString = (v: string): boolean => {
    if (!(/^-?\d+?$/).test(v)) return false;
    const parsed = parseInt(v);
    return !isNaN(parsed);
};

export const isFloatString = (v: string): boolean => {
    if (!(/^-?\d+(?:[.]\d*?)?$/).test(v)) return false;
    const parsed = parseFloat(v);
    return !isNaN(parsed);
};

export const isEmail = (email: string): boolean => {
    if (isNonEmptyString(email)) email = email.trim().replace(/ /g, "");
    const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    return pattern.test(email);
};

export const isPassword = (v: string, settings?: any) => {

    if (!_isObject(settings)) settings = {};

    const {
        needLowerCaseLetter,
        needUpperCaseLetter,
        needDigit,
        needSepcialChar,
        minLen } = settings;


    if (isNonEmptyString(v)) v = v.trim().replace(/ /g, "");
    if (!isNonEmptyString(v)) return false;

    if (v.length < (!isInteger(minLen) ? 8 : minLen)) return false;

    let result = true;

    if (needDigit) {
        result = new RegExp(/^(?=.*[\d])[\w!@#$%.^&*]+$/).test(v);
        if (!result) console.log('Password does not contain digit.');
    }

    if (result && needUpperCaseLetter) {
        result = new RegExp(/^(?=.*[A-Z])[\w!@#$%.^&*]+$/).test(v);
        if (!result) console.log('Password does not contain uppercase letter.');
    }

    if (result && needLowerCaseLetter) {
        result = new RegExp(/^(?=.*[a-z])[\w!@#$%.^&*]+$/).test(v);
        if (!result) console.log('Password does not contain lowercase letter.');
    }

    if (result && needSepcialChar) {
        result = new RegExp(/^(?=.*[!@#$%^&*])[\w!@#$%.^&*]+$/).test(v);
        if (!result) console.log('Password does not contain special charactors.');
    }

    return result;
};

export const utcISOString = (dt?: Date, minutesDiff?: number): string => {
    if (!dt) dt = new Date();
    if (isNumber(minutesDiff)) dt.setMinutes(dt.getMinutes() + minutesDiff);
    return dt.toISOString();
};

export const utcMaxISOString = (): string => {
    return utcISOString(new Date("9999-12-31T23:59:59.999Z"), 0);
};


export const formatString = (...args: string[]) => {
    if (args.length == 0) return null;
    let s = args[0];
    for (var i = 1; i < args.length; i++) {
        s = s.replace(/\{0\}/g, args[i]);
    }
    return s;
};

//the isObject from lodash will cause error from typescript
//this one will not
export const isObject = (v: any): boolean => {
    return _isObject(v) ? true : false;
}

export const isObjectString = (s: string): boolean => {
    try {
        JSON.parse(s);
        return true;
    }
    catch
    {
        return false;
    }
}

export const removeNoValueProperty = (data: Record<string, any>, removeEmptyString: boolean): Record<string, any> => {
    if (isArray(data)) {
        return without(
            map(data, (r) => {
                return r === undefined ||
                    r === null ||
                    (r === "" && removeEmptyString)
                    ? null
                    : _isObject(r)
                        ? removeNoValueProperty(r, removeEmptyString)
                        : r;
            }),
            null
        );
    }

    for (var p in data) {
        const v = data[p];

        if (v === undefined || v === null || (v === "" && removeEmptyString)) {
            delete data[p];
        } else {
            if (isArray(v)) {
                data[p] = without(
                    map(v, (r) => {
                        return r === undefined ||
                            r === null ||
                            (r === "" && removeEmptyString)
                            ? null
                            : _isObject(r)
                                ? removeNoValueProperty(r, removeEmptyString)
                                : r;
                    }),
                    null
                );
            } else {
                if (_isObject(v)) {
                    data[p] = removeNoValueProperty(v, removeEmptyString);
                }
            }
        }
    }

    return data;
};


export const groupItems = (
    data: Array<Record<string, any>>,
    groups: Array<Record<string, any>>,
    propNameForItemGroup?: string,
    propNameForItemSort?: string)
    : Array<Record<string, any>> => {

    if (!(isArray(data) && data.length > 0)) return [];
    propNameForItemGroup = propNameForItemGroup ? propNameForItemGroup : 'group';
    propNameForItemSort = propNameForItemSort ? propNameForItemSort : 'fullName';

    const result = map(groups, (group) => {
        return {
            ...group, data: sortBy(without(map(data, (item: Record<string, any>) => {
                return propNameForItemGroup && item[propNameForItemGroup] == group.id ? item : null;
            }), null),
                (item: Record<string, any>) => {
                    return propNameForItemSort && item[propNameForItemSort];
                })
        };
    });
    return result;
}

export const shortenNumber = (num: number, fractionDigits?: number) => {
    if (!isNumber(fractionDigits) || isNumber(fractionDigits) && fractionDigits < 0) fractionDigits = 1;
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? item && (num / item.value).toFixed(fractionDigits) + item.symbol : "0";
}


export const numberWithCommas = (x:number) => {
    if (!isNumber(x)) return null;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatText = (text:string, format:'lower'|'upper'|'capital'|'capital-first'|'capital-all'|'camel'|'initials') => {
    switch (format) {
        case 'lower': return text.toLowerCase();
        case 'upper': return text.toUpperCase();
        case 'capital':
        case 'capital-first': return capitalize(text);
        case 'capital-all': return map(text.split(' '), capitalize).join(' ');
        case 'initials': return map(text.split(' '), (t)=>t.length>0?t.charAt(0):'').join(' ');
        case 'camel': return camelCase(text);
        default: return text;
    }
};


export const readableFileSize = (fileSizeInBytes:number) => {
    if (!isNumber(fileSizeInBytes)) return "";
    var i = -1;
    var byteUnits = [" KB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

export const formatJSONString = (c: string) => {

    const jsonValue = isNonEmptyString(c) ? JSON.parse(c) : c;

    try {
        return JSON.stringify(jsonValue, null, 4);
    }
    catch (ex) {
        //console.log({ v, ex })
    }

    return JSON.stringify(jsonValue);
};

export const deepFlatten = (array: Array<any>): Array<any> => {
    var result: Array<any> = [];
    array.forEach(function (elem) {
        if (Array.isArray(elem)) {
            result = result.concat(deepFlatten(elem));
        } else {
            result.push(elem);
        }
    });

    return result;
}
