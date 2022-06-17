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

export type Command = 'start' | 'echo' | 'new_event' | 'cancel';
export type Method = 'post' | 'get' | 'put';
export type Resource = 'events' | 'message';
export interface TelegramRequest {
    resource: Resource,
    method: Method,
    data?: any
}