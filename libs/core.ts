//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isObject as _isObject, isNil, isString, without, map, isArray, isNumber, forOwn, camelCase, isNaN, isInteger, isFunction, isBoolean } from "lodash";
import { isValidNumber } from "libphonenumber-js";
import { v4 } from 'uuid';
import Constants from './constants';

const {GUID_EMPTY} = Constants;

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

export const getWebLocation = (url: string) => {
    const match =
        isNonEmptyString(url) &&
        url.match(
            /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
        );
    return (
        match && {
            url,
            protocol: match[1],
            host: match[3],
            port: match[4],
            path: match[5],
            query: match[6].replace("?", ""),
            hash: match[7],
        }
    );
};

export const fixUrl = (url: string, protocol: string, host: string): string => {

    if (!isNonEmptyString(protocol)) protocol = 'https:';
    if (url.indexOf('//') == 0) {
        //url = url.replace('//', '/');
        return `${protocol}${url}`;
    }
    if (url.indexOf('/') == 0) url = `${protocol}//${host}${url}`;
    return url;
};

export const getSubObject = (obj: Record<string, any> | null | undefined, props: string): Record<string, any> | null => {
    if (isNil(obj)) return null;
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
    if (isString(val)) return val.toLowerCase().trim()=='true';
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

    if (!isNonEmptyString(v)) return false;

    if (isNonEmptyString(v)) v = v.trim().replace(/ /g, "");

    if (v.length < (!isInteger(minLen) ? 8 : minLen)) return false;

    let result = false;

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
export const isObject=(v:any)=>{
    return _isObject(v)?true:false;
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


export default {
    isNonEmptyString,
    isGuid,
    isPhoneNumber,
    isEmptyString,
    newGuid,
    assignDeep,
    assignStyles,
    getWebLocation,
    fixUrl,
    getSubObject,
    timeDiff,
    serialNumber,
    ttl,
    getObjectPropValue,
    getBooleanPropValue,
    getIntValueOfObject,
    getArrayPropValueOfObject,
    getPropValueOfObject,
    getMemoryCache,
    setMemoryCache,
    cleanGuid,
    sameGuid,
    isEmptyGuid,
    checkToTrue,
    isIntString,
    isFloatString,
    isEmail,
    isPassword,
    utcISOString,
    utcMaxISOString,
    removeNoValueProperty,
    formatString,
}
