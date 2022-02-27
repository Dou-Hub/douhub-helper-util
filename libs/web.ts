//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isNonEmptyString } from './core';
import { without, find, map, isNil } from 'lodash'

export const getBaseDomain = (domain: string): string => {
    if (isNonEmptyString(domain)) {
        const domainSegments = domain.split('.');
        const domainSegmentsCount = domainSegments.length;
        switch (domainSegmentsCount) {
            case 3:
                {
                    domain = `${domainSegments[1]}.${domainSegments[2]}`;
                    break;
                }
            case 4:
                {
                    domain = `${domainSegments[1]}.${domainSegments[2]}.${domainSegments[3]}`;
                    break;
                }
            default:
                {
                    break;
                }
        }
    }

    return domain;
}


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

export const getWebQueryValue = (url: string, key: string, defaultValue?: string): string | undefined => {

    if (!isNonEmptyString(url)) return defaultValue;
    const lo = getWebLocation(url.indexOf('/') == 0 ? `https://www.primeobjects.com${url}` : url);
    if (lo && lo.query && lo.query.trim().length > 0) {
        const query = find(lo.query.split(`&`), (q) => {
            const pair = q.split(`=`);
            return (
                pair.length > 1 && pair[0].toLowerCase() === key.toLowerCase()
            );
        });

        if (query) {
            const value = decodeURIComponent(query.split(`=`)[1]);
            if (isNonEmptyString(value)) return value;
        }
    }

    return defaultValue;
};

export const setWebQueryValue = (url: string, key: string, value?: string): string => {
    const val: string = !isNil(value) && isNonEmptyString(value) ? encodeURIComponent(value).replace(/'/g, '%27') : '';
    url = url.replace(/[\?]{2,}/ig,'?');
    const lo = getWebLocation(url);
    if (lo && lo.query && lo.query.trim().length > 0) {
        let queries: (string | undefined | null)[] = lo.query.split(`&`);
        let replaced = false;

        queries = without(map(queries, (q: string | undefined | null) => {
            if (isNil(q)) return null;
            const pair = q.split(`=`);
            if (pair.length > 1 && pair[0].toLowerCase() === key.toLowerCase()) {
                pair[1] = val;
                replaced = true;
                if (isNonEmptyString(val)) {
                    q = pair.join("=");
                }
                else {
                    q = null;
                }
            }
            return q;
        }), null);

        if (!replaced) {
            queries.push(`${key}=${val}`);
        }

        return `${url.split("?")[0]}?${queries.join("&")}`;
    } else {
        return `${url}?${key}=${val}`;
    }
};
