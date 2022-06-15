'use strict'

export const Guard = {
    requires: (condition, message) => {
        if(!condition)
            console.error(message ?? 'The required code condition is not met.');
    }
}

export function tryParseJSON(json) {
    try {
        return JSON.parse(json);
    } catch {
        return undefined;
    }
}