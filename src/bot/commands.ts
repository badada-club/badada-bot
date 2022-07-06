import { BotCommand } from '../telegram/telegram-types';

export const commands: { [name: string]: BotCommand } = {
    start: { command: 'start', description: 'Запуск бота.'},
    echo: { command: 'echo', description: 'Отсылает в чат, из которого вызвана команда, её аргумент.'},
    new_event: { command: 'new_event', description: 'Создание нового мероприятия.'},
    events_today: { command: 'events_today', description: 'Мероприятия, планирующиеся сегодня.'},
};