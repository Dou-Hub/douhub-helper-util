//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import Constants from './libs/constants';
import Colors from './libs/colors';


export {
    getWebQueryValue,
    setWebQueryValue,
    getWebLocation,
    getWebRootUrl,
    fixUrl,
    getBaseDomain
} from './libs/web';

export {
    getFileType,
    getContentType,
    getAcceptExtention,
    uploadToS3,
    getAcceptMIMEs,
    getAcceptFileExtensions
} from './libs/file';

export {
    stringToColor,
    slug,
    isNonEmptyString,
    isGuid,
    isPhoneNumber,
    isEmptyString,
    newGuid,
    assignDeep,
    assignStyles,
    getSubObject,
    timeDiff,
    serialNumber,
    getDateTimeString,
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
    formatString,
    shortenString,
    removeNoValueProperty,
    isObject,
    isObjectString,
    groupItems,
    shortenNumber,
    numberWithCommas,
    formatText,
    readableFileSize,
    formatJSONString,
    deepFlatten,
    csvToJson,
    getPropName,
    doNothing,
    _process,
    _track
} from './libs/core';

export {
    getTreeItemAndChildrenIds,
    getTreeItemHavingPropValue,
    getTreeItemPath,
    getTreeItem,
    insertTreeItem,
    removeTreeItem,
    updateTreeItem,
    replaceTreeItem,
    updateAllTreeItems
} from './libs/tree';

export {
    isMember,
    isOwner,
    hasMemberRole,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    checkRecordPrivilege,
    isSolutionOwner,
    recordOwnedByOrganization,
    checkLicenses,
    hasLicense,
    checkPrivileges,
    checkEntityPrivilege,
    checkPrivilege,
    isReader,
    isAuthor,
    hasPrivilege
} from './libs/auth';

export {
    getRecordDisplay,
    getRecordMedia,
    getRecordContent,
    getRecordAbstract,
    getRecordFullName,
    getRecordEmailAddress,
    getRecordAddress,
    getRecordPageMetadata,
    applyRecordSlug
} from './libs/record';

export {
    getEntity,
    getEntityBySlug,
    getEntityTypeFromFileName
} from './libs/metadata';

export const colorByName = Colors.colorByName;
export const rgbToHex = Colors.rgbToHex;
export const isValidRGB = Colors.isValidRGB;
export const hexToRgb = Colors.hexToRgb;
export const isValidHex = Colors.isValidHex;
export const intToHex = Colors.intToHex;
export const APPTEXTCOLORS = Colors.APPTEXTCOLORS;
export const APPBGCOLORS = Colors.APPBGCOLORS;
export const APPCOLORS = Colors.APPCOLORS;
export const COLORS = Colors.COLORS;
export const BASECOLORS = Colors.BASECOLORS;

export const GUID_PRE = Constants.GUID_PRE;
export const GUID_EMPTY = Constants.GUID_EMPTY;
export const GUID_00001 = Constants.GUID_00001;
export const GUID_00002 = Constants.GUID_00002;
export const GUID_00003 = Constants.GUID_00003;
export const GUID_00004 = Constants.GUID_00004;
export const GUID_00005 = Constants.GUID_00005;
export const GUID_00010 = Constants.GUID_00010;
export const GUID_00020 = Constants.GUID_00020;
export const GUID_00030 = Constants.GUID_00030;
export const GUID_00040 = Constants.GUID_00040;
export const GUID_00050 = Constants.GUID_00050;