export const Guard = {
    requires: (condition: boolean, message?: string): void => {
        if(!condition)
            console.error(message ?? 'The required code condition is not met.');
    }
};

export function tryParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return undefined;
    }
}

export function tryParseIsoDate(dateStr: string, timezone: number): Date | undefined {
    Guard.requires(typeof timezone === 'number');
    if(!dateStr)
        return undefined;
    // eslint-disable-next-line no-useless-escape
    const regExp = /^(\d{4})\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/g;
    const match = regExp.exec(dateStr);
    if(!match)
        return undefined;
    const year = parseInt(match[1]);
    const month = parseInt(match[2]);
    const day = parseInt(match[3]);
    const utcPlusOffset = new Date(Date.UTC(year, month - 1, day));
    return addHours(utcPlusOffset, -timezone);
}
export function addHours(date: Date, n: number): Date {
    if(!date)
        throw new Error(`Cannot add hours to the falsy '${date}' Date.`);
    date.setUTCHours(date.getUTCHours() + n);
    return date;
}
export function addDays(date: Date, n: number): Date {
    if(!date)
        throw new Error(`Cannot add days to the falsy '${date}' Date.`);
    date.setUTCDate(date.getUTCDate() + n);
    return date;
}
export function getUtcDateValue(date: Date): number {
    if(!date)
        throw new Error(`Cannot extract date from the falsy '${date}' Date.`);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
export function getNow(): Date {
    return new Date(Date.now());
}
export function getUtcDayStart(date: Date, timezone: number): Date {
    const utcDateValue = getUtcDateValue(date);
    return addHours(new Date(utcDateValue), -timezone);
}