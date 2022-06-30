export const commands = {
    start: 'start',
    echo: 'echo',
    new_event: 'new_event',
    events_today: 'events_today'
};
export type Command = keyof typeof commands;
