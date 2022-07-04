import { addHours, getUtcDayStart, tryParseIsoDate } from '../src/utils';

describe('tryParseUtcIsoDateValue', () => {
    describe('On incorrect date', () => {
        it('Should return undefined', () => {
            expect(tryParseIsoDate('abc', 0)).not.toBeDefined();
        });
    });
    describe('On correct date', () => {
        it('Should correctly parse it', () => {
            const date = tryParseIsoDate('2020-01-01', 0) as Date;
            expect(date.valueOf()).toEqual(new Date(Date.UTC(2020, 0, 1)).valueOf());
            const date1 = tryParseIsoDate('2020-01-01', 1) as Date;
            expect(date1.valueOf()).toEqual(new Date(Date.UTC(2019, 11, 31, 23)).valueOf());
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

describe('getUtcDayStart', () => {
    describe('On correct date', () => {
        it('Should return date start in UTC', () => {
            expect(getUtcDayStart(new Date(Date.UTC(2020, 0, 1)), 0)).toEqual(new Date(Date.UTC(2020, 0, 1)));
            expect(getUtcDayStart(new Date(Date.UTC(2020, 0, 1)), 3)).toEqual(new Date(Date.UTC(2019, 11, 31, 21)));
        });
    });
});
