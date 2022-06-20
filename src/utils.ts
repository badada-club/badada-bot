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