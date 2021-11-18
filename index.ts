//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isObject, isNil, isString, assign, isArray, isNumber, forOwn, camelCase, isNaN, isInteger, isFunction } from "lodash";
import { isValidNumber } from "libphonenumber-js";
import { v4 } from 'uuid';

export const GUID_PRE: string = '00000000-0000-0000-0000-0000000';
export const GUID_EMPTY: string = GUID_PRE + '00000';
export const GUID_00001: string = GUID_PRE + '00001';
export const GUID_00002: string = GUID_PRE + '00002';
export const GUID_00003: string = GUID_PRE + '00003';
export const GUID_00004: string = GUID_PRE + '00004';
export const GUID_00005: string = GUID_PRE + '00005';
export const GUID_00010: string = GUID_PRE + '00010';
export const GUID_00020: string = GUID_PRE + '00020';
export const GUID_00030: string = GUID_PRE + '00030';
export const GUID_00040: string = GUID_PRE + '00040';
export const GUID_00050: string = GUID_PRE + '00050';

export type Object = {
    [key: string]: any
}

export const isNonEmptyString = (s: any, trim?: boolean): boolean => {
    return (
        isString(s) &&
        ((!trim && s.length > 0) || (trim && s.trim().length > 0))
    ) ? true : false;
};


export const isGuid = (v: any): boolean => {
    if (!isNonEmptyString(v)) return false;
    var pattern = new RegExp(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    return pattern.test(v.replace("{", "").replace("}", "").toLowerCase()) ? true : false;
};

export const isPhoneNumber = (n: any): boolean => {
    if (isNonEmptyString(n)) n = n.trim().replace(/ /g, "");
    return isValidNumber(n);
};

export const isEmptyString = (s: any, trim?: boolean): boolean => {
    return (
        isString(s) &&
        ((!trim && s.length === 0) || (trim && s.trim().length === 0))
    )?true:false;
};


export const newGuid = (): string => {
    return v4();
};

export const assignDeep = (...args: any[]) => {
    let result: any = {};
    for (var i = 0; i < args.length; i++) {
        const item: any = args[i];
        if (isObject(item)) {
            const objItem: Object  = item;
            for (var p in objItem) {
                const newPropValue = objItem[p];
                if (isObject(newPropValue)) {
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


export const style = function () {
    let styles = {};
    for (var i = 0; i < arguments.length; i++) {
        styles = assign(styles, arguments[i]);
    }
    return styles;
};

export const getWebLocation = (url: string) => {
    var match =
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

export const getSubObject = (obj: Object | null | undefined, props: string): Object | null => {
    if (isNil(obj)) return null;
    const indirectEval = eval;
    return (indirectEval(`(o)=>(({${props}}) => ({${props}}))(o)`))(obj);
};

export const timeDiff = (d1: Date, d2: Date, type: 'second' | 'sec' | 's' | 'minute' | 'min' | 'm' | 'hour' | 'hr' | 'h') => {
    var diffT = d1.getTime() - d2.getTime();
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
        let n =
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

export const getObjectPropValue = (obj: Object | null | undefined, key: string, caseSensitive?: boolean) => {
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

export const getIntValueOfObject = (obj: Object | null | undefined, key: string, defaultValue?: number | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = null;
    const val = getPropValueOfObject(obj, key);
    return !isNaN(parseInt(val)) ? parseInt(val) : defaultValue;
};

export const getFloatValueOfObject = (obj: Object | null | undefined, key: string, defaultValue?: number | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = null;
    const val = getPropValueOfObject(obj, key);
    return !isNaN(parseFloat(val)) ? parseFloat(val) : defaultValue;
};

export const getBooleanValueOfObject = (obj: Object | null | undefined, key: string, defaultValue?: boolean | null | undefined) => {
    if (!isNonEmptyString(defaultValue)) defaultValue = null;
    const val = getPropValueOfObject(obj, key);
    if (`${val}`.toLowerCase() == 'true') return true;
    if (`${val}`.toLowerCase() == 'false') return false;
    return defaultValue;
};

export const getArrayPropValueOfObject = (obj: Object | null | undefined, key: string, defaultValue: any[] | null | undefined) => {
    if (!isObject(defaultValue)) defaultValue = null;
    const val = getPropValueOfObject(obj, key);
    return isArray(val) ? val : isNonEmptyString(val) ? JSON.parse(val) : defaultValue;
};



export const getPropValueOfObject = (obj: Object | null | undefined , key: string) => {

    if (!isObject(obj) || !isNonEmptyString(key)) return null;
    let v = obj[key];
    if (!v) key = key.replace(/-/g, '');
    if (!v) v = obj[key.toLowerCase()];
    if (!v) v = obj[key.toUpperCase()];
    if (!v) v = obj[camelCase(key)];

    if (!v) {
        //try scan all props
        for (var p in obj) {
            if (p.toLowerCase() == key.toLowerCase()) return obj[p];
        }
    }
    return v;
};

let _memoryCache: any = {};

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
    _memoryCache[key] = {};
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

const sameGuid = (a: string, b: string): boolean => {
    return cleanGuid(a) === cleanGuid(b);
};

export const isEmptyGuid = (v: string) => {
    return sameGuid(v, GUID_EMPTY);
};


export const checkToTrue = (js: string, props: any): boolean => {

    if (!isObject(props)) props = {};

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
    var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    return pattern.test(email);
};

export const isPassword = (v: string, settings?:any) => {

    if (!isObject(settings)) settings = {};

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

export const utcISOString = (dt:Date, minutesDiff:number):string => {
    if (!dt) dt = new Date();
    if (isNumber(minutesDiff)) dt.setMinutes(dt.getMinutes() + minutesDiff);
    return dt.toISOString();
};

export const utcMaxISOString = ():string => {
    return utcISOString(new Date("9999-12-31T23:59:59.999Z"),0);
};

