import { addHours, tryParseUtcIsoDateValue } from '../src/utils';

describe('tryParseUtcIsoDateValue', () => {
    describe('On incorrect date', () => {
        it('Should return undefined', () => {
            expect(tryParseUtcIsoDateValue('abc')).not.toBeDefined();
        });
    });
    describe('On correct date', () => {
        it('Should correctly parse it', () => {
            expect(tryParseUtcIsoDateValue('2020-01-01')).toEqual(new Date(Date.UTC(2020, 0, 1)).valueOf());
        });
    });
});

describe('addHours', () => {
    describe('On correct date', () => {
        it('Should add hours', () => {
            expect(addHours(new Date(2020, 0, 1), 3).valueOf()).toEqual(new Date(2020, 0, 1, 3).valueOf());
            expect(addHours(new Date(Date.UTC(2020, 0, 1)), 3).valueOf()).toEqual(new Date(Date.UTC(2020, 0, 1, 3)).valueOf());
        });
    });
});