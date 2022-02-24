import {isNumber, isArray, find} from 'lodash';
import {isNonEmptyString, isObject,  isEmail, slug} from './core';

export const getRecordDisplay = (record:Record<string,any>, maxLength?:number): string => {
    if (!isObject(record)) return '';
    let result = getRecordFullName(record);
    if (!isNonEmptyString(result) && isNonEmptyString(record.displayValue)) result = record.displayValue;
    const number = !isNonEmptyString(result) && isNonEmptyString(record.number) ? `${record.number} - ` : '';
    if (!isNonEmptyString(result) && isNonEmptyString(record.title)) result = `${number}${record.title}`;
    if (!isNonEmptyString(result) && isNonEmptyString(record.name)) result = `${number}${record.name}`;
    if (!isNonEmptyString(result) && isNonEmptyString(record.text)) result = record.text;
    if (!isNonEmptyString(result) && isNonEmptyString(record.symbol)) result = record.symbol;
    if (!isNonEmptyString(result) && isNonEmptyString(record.code)) result = record.code;
    //if (!isNonEmptyString(result) && isNonEmptyString(record.display)) result = record.display;
    if (!isNonEmptyString(result)) {
        return '';
    }

    if (isNumber(maxLength) && result.length > maxLength) result = `${result.substring(0, maxLength)} ...`;
    return result.replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
};

export const getRecordAbstract = (record:Record<string,any>, maxLength?:number, includeContent?:boolean): string => {
    if (!isObject(record)) return '';
    let result = '';
    if (result.length == 0 && isNonEmptyString(record.summary)) result = record.summary;
    if (result.length == 0 && isNonEmptyString(record.description)) result = record.description;
    if (result.length == 0 && isNonEmptyString(record.abstract)) result = record.abstract;
    if (includeContent && result.length == 0 && isNonEmptyString(record.content)) result = record.content;
    if (!isNonEmptyString(result)) return '';
    // if (isNonEmptyString(result)) {
    //     if (result.indexOf('<') >= 0) {
    //         result = cheerio.load(result).text();
    //     }
    // }
    // else {
    //     result = '';
    // }

    if (isNumber(maxLength) && result.length > maxLength) result = `${result.substring(0, maxLength)} ...`;
    return result.replace(/\n/g, ' ').replace(/\r/g, ' ');
};

export const getRecordAddress = (record:Record<string,any>, prefix:string): string => {

    if (!isObject(record)) return '';

    const line1 = isNonEmptyString(record[`${prefix}Line1`]) ? record[`${prefix}Line1`] : '';
    const line2 = isNonEmptyString(record[`${prefix}Line2`]) ? record[`${prefix}Line2`] : '';
    const city = isNonEmptyString(record[`${prefix}City`]) ? record[`${prefix}City`] : '';
    const postalCode = isNonEmptyString(record[`${prefix}PostalCode`]) ? record[`${prefix}PostalCode`] : '';
    const state = isNonEmptyString(record[`${prefix}State`]) ? record[`${prefix}State`] : '';
    const country = isNonEmptyString(record[`${prefix}Country`]) ? record[`${prefix}Country`] : '';

    if (line1.length > 0 && city.length > 0 && state.length > 0 && country.length > 0 ||
        postalCode.length > 0 && country.length > 0) {
        return `${line1} ${line2},${city},${state},${postalCode},${country}`;
    }

    return '';
};

export const getRecordContent = (record:Record<string,any>):string => {
    if (!isObject(record)) return "";
    if (isNonEmptyString(record.content)) return record.content;
    if (isNonEmptyString(record.description)) return record.description;
    if (isNonEmptyString(record.detail)) return record.detail;
    return "";
};

export const getRecordMedia = (record:Record<string,any>):string => {
    if (!isObject(record)) return "";
    if (isNonEmptyString(record.media)) return record.media;
    if (isNonEmptyString(record.photoUrl)) return record.photoUrl;
    if (record.source && isNonEmptyString(record.source.photoUrl)) return record.source.photoUrl;
    return "";
};

export const getRecordFullName = (user:Record<string,any>, skipFullNameProp?:boolean):string => {
    if (!isObject(user)) return "";

    const email = isNonEmptyString(user.email) ? user.email.trim() : "";
    
    let fullName = isNonEmptyString(user.fullName) && !skipFullNameProp 
        ? user.fullName.trim()
        : "";

    const firstName = isNonEmptyString(user.firstName)
        ? user.firstName.trim()
        : "";
    
        const lastName = isNonEmptyString(user.lastName)
        ? user.lastName.trim()
        : "";

    if (
        fullName.length == 0 ||
        (firstName.length > 0 && lastName.length > 0) ||
        (fullName.length > 0 && fullName == email)
    ) {
        fullName = `${firstName} ${lastName.length > 0 ? " " + lastName : ""
            }`.trim();
    }

    if (user.lcid === 2052) fullName = fullName.replace(/ /g, "");
    fullName = fullName.replace(/\s\s+/g, " ").trim();
    fullName = fullName.length > 0 ? fullName : email;

    return fullName;
};

export const getRecordEmailAddress = (record:Record<string,any>, emailOnly?:boolean): string|undefined => {
    
 
    if (isObject(record) && isEmail(record.email)) {
        const fullName = getRecordFullName(record);
        if (isNonEmptyString(fullName) && !emailOnly) {
            return `${fullName} <${record.email}>`;
        }
        else {
            return record.email;
        }
    }

    return undefined;
};

export const getRecordPageMetadata = (record: Record<string,any>, settings?:{siteName?:string}) => {

    const restult: Record<string,any>= {};

    const recordDisplay = getRecordDisplay(record);
    if (!isNonEmptyString(recordDisplay)) {
        restult.title = isObject(settings) && settings?.siteName? `${settings?.siteName} - ${getRecordAbstract(record, 64)}`: getRecordAbstract(record, 64);
    }
    else {
        restult.title = isObject(settings) && settings?.siteName? `${settings?.siteName} - ${recordDisplay}`: recordDisplay;
    }

    restult.id = record.id;
    restult.description = getRecordAbstract(record, 128);
    restult.type = 'article';
    const media = getRecordMedia(record);
    if (isNonEmptyString(media)) restult.image = media;

    return restult;
};


export const applyRecordSlug = (record:Record<string,any>): Record<string,any> => {
    const id = record.id;
    const display = getRecordDisplay(record);
    if (!isArray(record.slugs)) record.slugs = [];
    const curSlug = slug(`${display} ${id.split('-')[1]}`);
    if (!find(record.slugs, (slug) => slug == curSlug)) {
        record.slugs.push(curSlug);
    }
    
    record.slug = curSlug;
    return record;
};