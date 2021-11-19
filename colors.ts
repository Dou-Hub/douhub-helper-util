//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isNumber } from 'lodash';
import { isIntString, isFloatString } from './core';

export const intToHex = (int: number): string => {
    const hex = int.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export const isValidHex = (hex: string): boolean => {
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/ /g, ''))?true:false;
}

export const hexToRgb = (hex: string, alpha: string, string: boolean): {
    r: number,
    g: number,
    b: number,
    a: number
} | null | string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/ /g, ''));
    if (!result) return null;

    if (string) {
        return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${isNumber(alpha) ? alpha : 1})`;
    }
    else {
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: isNumber(alpha) ? alpha : 1
        };
    }
}

export const isValidRGB = (v: string): boolean => {
    v = v.replace(/ /g, '').replace('rgba', '').replace('rgb', '').replace('(', '').replace(')', '');
    const s: Array<string> = v.split(',');
    if (s.length < 3 || s.length > 4) return false;
    for (let i = 0; i < s.length; i++) {
        if (i < 3) {
            if (!isIntString(s[i])) return false;
            const sint: number = parseInt(s[i]);
            if (!(sint >= 0 && sint <= 255)) return false;
            s[i] = `${sint}`;
        }
        else {
            if (!isFloatString(s[i])) return false;
            const sfloat: number = parseFloat(s[i]);
            if (!(sfloat >= 0 && sfloat <= 1)) return false;
        }
    }

    return true;
}

export const rgbToHex = (rgb: string): string | null => {
    rgb = rgb.replace(/ /g, '').replace('rgba', '').replace('rgb', '').replace('(', '').replace(')', '');
    const s: Array<string> = rgb.split(',');
    if (s.length < 3 || s.length > 4) return null;
    for (let i = 0; i < s.length; i++) {
        if (i < 3) {
            if (!isIntString(s[i])) return null;
            const sint = parseInt(s[i]);
            if (!(sint >= 0 && sint <= 255)) return null;
            s[i] = `${sint}`;
        }
    }
    return `#${intToHex(parseInt(s[0]))}${intToHex(parseInt(s[1]))}${intToHex(parseInt(s[2]))}`;
}

export const BASECOLORS: Record<string, any> = {
    red: {
        c_50: 'ffebee',
        c_100: 'ffcdd2',
        c_200: 'ef9a9a',
        c_300: 'e57373',
        c_400: 'ef5350',
        c_500: 'f44336',
        c_600: 'e53935',
        c_700: 'd32f2f',
        c_800: 'c62828',
        c_900: 'b71c1c'
    },
    pink: {
        c_50: 'fce4ec',
        c_100: 'f8bbd0',
        c_200: 'f48fb1',
        c_300: 'f06292',
        c_400: 'ec407a',
        c_500: 'e91e63',
        c_600: 'd81b60',
        c_700: 'c2185b',
        c_800: 'ad1457',
        c_900: '880e4f'
    },
    purple: {
        c_50: 'f3e5f5',
        c_100: 'e1bee7',
        c_200: 'ce93d8',
        c_300: 'ba68c8',
        c_400: 'ab47bc',
        c_500: '9c27b0',
        c_600: '8e24aa',
        c_700: '7b1fa2',
        c_800: '6a1b9a',
        c_900: '4a148c'
    },
    deepPurple:
    {
        c_50: 'ede7f6',
        c_100: 'd1c4e9',
        c_200: 'b39ddb',
        c_300: '9575cd',
        c_400: '7e57c2',
        c_500: '673ab7',
        c_600: '5e35b1',
        c_700: '512da8',
        c_800: '4527a0',
        c_900: '311b92'
    }
    ,
    indigo:
    {
        c_50: 'e8eaf6',
        c_100: 'c5cae9',
        c_200: '9fa8da',
        c_300: '7986cb',
        c_400: '5c6bc0',
        c_500: '3f51b5',
        c_600: '3949ab',
        c_700: '303f9f',
        c_800: '283593',
        c_900: '1a237e'
    },
    blue: {
        c_50: 'e3f2fd',
        c_100: 'bbdefb',
        c_200: '90caf9',
        c_300: '64b5f6',
        c_400: '42a5f5',
        c_500: '2196f3',
        c_600: '1e88e5',
        c_700: '1976d2',
        c_800: '1565c0',
        c_900: '0d47a1'
    },
    lightBlue: {
        c_50: 'e1f5fe',
        c_100: 'b3e5fc',
        c_200: '81d4fa',
        c_300: '4fc3f7',
        c_400: '29b6f6',
        c_500: '03a9f4',
        c_600: '039be5',
        c_700: '0288d1',
        c_800: '0277bd',
        c_900: '01579b',
        c_1000: '01447a'
    },
    cyan: {
        c_50: 'e0f7fa',
        c_100: 'b2ebf2',
        c_200: '80deea',
        c_300: '4dd0e1',
        c_400: '26c6da',
        c_500: '00bcd4',
        c_600: '00acc1',
        c_700: '0097a7',
        c_800: '00838f',
        c_900: '006064'
    },
    teal: {
        c_50: 'e0f2f1',
        c_100: 'b2dfdb',
        c_200: '80cbc4',
        c_300: '4db6ac',
        c_400: '26a69a',
        c_500: '009688',
        c_600: '00897b',
        c_700: '00796b',
        c_800: '00695c',
        c_900: '004d40'
    },
    green: {
        c_50: 'e8f5e9',
        c_100: 'c8e6c9',
        c_200: 'a5d6a7',
        c_300: '81c784',
        c_400: '66bb6a',
        c_500: '4caf50',
        c_600: '43a047',
        c_700: '388e3c',
        c_800: '2e7d32',
        c_900: '1b5e20'
    },
    lightGreen: {

        c_50: 'f1f8e9',
        c_100: 'dcedc8',
        c_200: 'c5e1a5',
        c_300: 'aed581',
        c_400: '9ccc65',
        c_500: '8bc34a',
        c_600: '7cb342',
        c_700: '689f38',
        c_800: '558b2f',
        c_900: '33691e'
    },
    lime: {
        c_50: 'f9fbe7',
        c_100: 'f0f4c3',
        c_200: 'e6ee9c',
        c_300: 'dce775',
        c_400: 'd4e157',
        c_500: 'cddc39',
        c_600: 'c0ca33',
        c_700: 'afb42b',
        c_800: '9e9d24',
        c_900: '827717'
    },
    yellow: {
        c_50: 'fffde7',
        c_100: 'fff9c4',
        c_200: 'fff59d',
        c_300: 'fff176',
        c_400: 'ffee58',
        c_500: 'ffeb3b',
        c_600: 'fdd835',
        c_700: 'fbc02d',
        c_800: 'f9a825',
        c_900: 'f57f17'
    },
    amber: {
        c_50: 'fff8e1',
        c_100: 'ffecb3',
        c_200: 'ffe082',
        c_300: 'ffd54f',
        c_400: 'ffca28',
        c_500: 'ffc107',
        c_600: 'ffb300',
        c_700: 'ffa000',
        c_800: 'ff8f00',
        c_900: 'ff6f00'
    },
    orange: {
        c_50: 'fff3e0',
        c_100: 'ffe0b2',
        c_200: 'ffcc80',
        c_300: 'ffb74d',
        c_400: 'ffa726',
        c_500: 'ff9800',
        c_600: 'fb8c00',
        c_700: 'f57c00',
        c_800: 'ef6c00',
        c_900: 'e65100'
    },
    deepOrange: {
        c_50: 'fbe9e7',
        c_100: 'ffccbc',
        c_200: 'ffab91',
        c_300: 'ff8a65',
        c_400: 'ff7043',
        c_500: 'ff5722',
        c_600: 'f4511e',
        c_700: 'e64a19',
        c_800: 'd84315',
        c_900: 'bf360c'
    },
    brown: {
        c_50: 'efebe9',
        c_100: 'd7ccc8',
        c_200: 'bcaaa4',
        c_300: 'a1887f',
        c_400: '8d6e63',
        c_500: '795548',
        c_600: '6d4c41',
        c_700: '5d4037',
        c_800: '4e342e',
        c_900: '3e2723',
    },
    gray: {
        c_50: 'fafafa',
        c_100: 'f5f5f5',
        c_200: 'eeeeee',
        c_300: 'e0e0e0',
        c_400: 'bdbdbd',
        c_500: '9e9e9e',
        c_600: '757575',
        c_700: '616161',
        c_800: '424242',
        c_900: '212121',
    },
    deepGray: {
        c_50: 'eceff1',
        c_100: 'cfd8dc',
        c_200: 'b0bec5',
        c_300: '90a4ae',
        c_400: '78909c',
        c_500: '607d8b',
        c_600: '546e7a',
        c_700: '455a64',
        c_800: '37474f',
        c_900: '263238',
    }
}

export const COLORS: Record<string, string> = {
    white: 'rgba(255, 255, 255, 1)',
    whiteA095: 'rgba(255, 255, 255, 0.95)',
    whiteA09: 'rgba(255, 255, 255, 0.9)',
    whiteA085: 'rgba(255, 255, 255, 0.85)',
    whiteA08: 'rgba(255, 255, 255, 0.8)',
    whiteA07: 'rgba(255, 255, 255, 0.7)',
    whiteA06: 'rgba(255, 255, 255, 0.6)',
    whiteA05: 'rgba(255, 255, 255, 0.5)',
    whiteA04: 'rgba(255, 255, 255, 0.4)',
    whiteA03: 'rgba(255, 255, 255, 0.3)',
    whiteA02: 'rgba(255, 255, 255, 0.2)',
    whiteA015: 'rgba(255, 255, 255, 0.15)',
    whiteA01: 'rgba(255, 255, 255, 0.1)',
    whiteA0005: 'rgba(255, 255, 255, 0.005)',
    whiteA001: 'rgba(255, 255, 255, 0.01)',
    whiteA002: 'rgba(255, 255, 255, 0.02)',
    whiteA003: 'rgba(255, 255, 255, 0.03)',
    whiteA004: 'rgba(255, 255, 255, 0.04)',
    whiteA005: 'rgba(255, 255, 255, 0.05)',
    whiteA006: 'rgba(255, 255, 255, 0.06)',
    whiteA007: 'rgba(255, 255, 255, 0.07)',
    whiteA008: 'rgba(255, 255, 255, 0.08)',
    whiteA009: 'rgba(255, 255, 255, 0.09)',

    red: 'rgba(255, 0, 0, 1)',
    redA095: 'rgba(255, 0, 0, 0.95)',
    redA09: 'rgba(255, 0, 0, 0.9)',
    redA085: 'rgba(255, 0, 0, 0.85)',
    redA08: 'rgba(255, 0, 0, 0.8)',
    redA07: 'rgba(255, 0, 0, 0.7)',
    redA06: 'rgba(255, 0, 0, 0.6)',
    redA05: 'rgba(255, 0, 0, 0.5)',
    redA04: 'rgba(255, 0, 0, 0.4)',
    redA03: 'rgba(255, 0, 0, 0.3)',
    redA02: 'rgba(255, 0, 0, 0.2)',
    redA015: 'rgba(255, 0, 0, 0.15)',
    redA01: 'rgba(255, 0, 0, 0.1)',
    redA0005: 'rgba(255, 0, 0, 0.005)',
    redA001: 'rgba(255, 0, 0, 0.01)',
    redA002: 'rgba(255, 0, 0, 0.02)',
    redA003: 'rgba(255, 0, 0, 0.03)',
    redA004: 'rgba(255, 0, 0, 0.04)',
    redA005: 'rgba(255, 0, 0, 0.05)',
    redA006: 'rgba(255, 0, 0, 0.06)',
    redA007: 'rgba(255, 0, 0, 0.07)',
    redA008: 'rgba(255, 0, 0, 0.08)',
    redA009: 'rgba(255, 0, 0, 0.09)',

    green: 'rgba(0,255,  0, 1)',
    greenA09: 'rgba(0, 255, 0, 0.9)',
    greenA08: 'rgba(0, 255, 0, 0.8)',
    greenA07: 'rgba(0, 255, 0, 0.7)',
    greenA06: 'rgba(0, 255, 0, 0.6)',
    greenA05: 'rgba(0, 255, 0, 0.5)',
    greenA04: 'rgba(0, 255, 0, 0.4)',
    greenA03: 'rgba(0, 255, 0, 0.3)',
    greenA02: 'rgba(0, 255, 0, 0.2)',
    greenA015: 'rgba(0, 255, 0, 0.15)',
    greenA01: 'rgba(0, 255, 0, 0.1)',
    greenA001: 'rgba(0, 255, 0, 0.01)',
    greenA002: 'rgba(0, 255, 0, 0.02)',
    greenA003: 'rgba(0, 255, 0, 0.03)',
    greenA004: 'rgba(0, 255, 0, 0.04)',
    greenA005: 'rgba(0, 255, 0, 0.05)',
    greenA006: 'rgba(0, 255, 0, 0.06)',
    greenA007: 'rgba(0, 255, 0, 0.07)',
    greenA008: 'rgba(0, 255, 0, 0.08)',
    greenA009: 'rgba(0, 255, 0, 0.09)',

    black: 'rgba(0,0, 0, 1)',
    blackA09: 'rgba(0, 0, 0, 0.9)',
    blackA08: 'rgba(0, 0, 0, 0.8)',
    blackA07: 'rgba(0, 0, 0, 0.7)',
    blackA06: 'rgba(0, 0, 0, 0.6)',
    blackA05: 'rgba(0, 0, 0, 0.5)',
    blackA04: 'rgba(0, 0, 0, 0.4)',
    blackA03: 'rgba(0, 0, 0, 0.3)',
    blackA02: 'rgba(0, 0, 0, 0.2)',
    blackA015: 'rgba(0, 0, 0, 0.15)',
    blackA01: 'rgba(0, 0, 0, 0.1)',
    blackA001: 'rgba(0, 0, 0, 0.01)',
    blackA002: 'rgba(0, 0, 0, 0.02)',
    blackA003: 'rgba(0, 0, 0, 0.03)',
    blackA004: 'rgba(0, 0, 0, 0.04)',
    blackA005: 'rgba(0, 0, 0, 0.05)',
    blackA006: 'rgba(0, 0, 0, 0.06)',
    blackA007: 'rgba(0, 0, 0, 0.07)',
    blackA008: 'rgba(0, 0, 0, 0.08)',
    blackA009: 'rgba(0, 0, 0, 0.09)',

    blue: 'rgba(33,150, 243, 1)',
    blueA09: 'rgba(33,150, 243, 0.9)',
    blueA08: 'rgba(33,150, 243, 0.8)',
    blueA07: 'rgba(33,150, 243, 0.7)',
    blueA06: 'rgba(33,150, 243, 0.6)',
    blueA05: 'rgba(33,150, 243, 0.5)',
    blueA04: 'rgba(33,150, 243, 0.4)',
    blueA03: 'rgba(33,150, 243, 0.3)',
    blueA02: 'rgba(33,150, 243, 0.2)',
    blueA015: 'rgba(33,150, 243, 0.15)',
    blueA01: 'rgba(33,150, 243, 0.1)',
    blueA001: 'rgba(33,150, 243, 0.01)',
    blueA002: 'rgba(33,150, 243, 0.02)',
    blueA003: 'rgba(33,150, 243, 0.03)',
    blueA004: 'rgba(33,150, 243, 0.04)',
    blueA005: 'rgba(33,150, 243, 0.05)',
    blueA006: 'rgba(33,150, 243, 0.06)',
    blueA007: 'rgba(33,150, 243, 0.07)',
    blueA008: 'rgba(33,150, 243, 0.08)',
    blueA009: 'rgba(33,150, 243, 0.09)',

    transparent: 'rgba(0, 0, 0, 0)',


}

export const APPCOLORS: Record<string, string> = {
    danger: '#dc3545',
    info: '#3298dc',
    success: '#28a745',
    warning: '#ffc107',
    primary: '#007bff',
    secondary: '#6c757d',
    light: '#EFEFEF'
}

export const APPBGCOLORS: Record<string, string> = {
    danger: '#f8d7da',
    info: '#d1ecf1',
    success: '#d4edda',
    warning: '#fff3cd',
    primary: '#cce5ff',
    secondary: '#e2e3e5',
    light: '#fefefe'
}

export const APPTEXTCOLORS: Record<string, string> = {
    danger: '#721c24',
    info: '#0c5460',
    success: '#155724',
    warning: '#856404',
    primary: '#004085',
    secondary: '#383d41',
    light: '#818182'
}

export const colorByName = (name: string, lvl: number, alpha: string) => {
    if (!lvl) lvl = 500;
    let color = BASECOLORS[name];
    if (!color) color = BASECOLORS['lightBlue'];

    let result = color['c_' + lvl];
    if (lvl > 900 && !result) result = color['c_900'];
    if (!result) result = color['c_700'];
    if (!result) result = '000000';

    return isNumber(alpha) && alpha <= 1 && alpha >= 0 ? hexToRgb(`#${result}`, alpha, true) : `#${result}`;
}

export default {
    colorByName, rgbToHex, isValidRGB, hexToRgb, isValidHex, intToHex,
    APPTEXTCOLORS, APPBGCOLORS, APPCOLORS, COLORS, BASECOLORS,
}