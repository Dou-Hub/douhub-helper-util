
const supertest = require('supertest');
const {isNonEmptyString} = require('../build/index');

describe('isNonEmptyString', () => {
    it('good string', async () => {
        expect(isNonEmptyString('aaa')).toBe(true);
    });

    it('empty string', async () => {
        expect(isNonEmptyString('')).toBe(false);
    });

    it('number', async () => {
        expect(isNonEmptyString(1)).toBe(false);
        expect(isNonEmptyString(1.0)).toBe(false);
        expect(isNonEmptyString(NaN)).toBe(false);
    });

    it('other types', async () => {
        expect(isNonEmptyString({a:1})).toBe(false);
        expect(isNonEmptyString(null)).toBe(false);
        expect(isNonEmptyString(undefined)).toBe(false);
        expect(isNonEmptyString([1])).toBe(false);
    });
})

