import { EVENTS_CHANNEL_ID, TELEGRAM_API_TOKEN } from '../../src/config';
import { EventMiddleware } from '../../src/middleware/event-middleware';
import { sendMessage } from '../../src/telegram-utils';
import { toMocked } from '../test-utils';

jest.mock('../../src/telegram-utils', () => {
    const actual = jest.requireActual('../../src/telegram-utils');
    return {
        ...actual,
        sendMessage: jest.fn()
    };        
});
const mockedSendMessage = toMocked(sendMessage);

describe('EventMiddleware', () => {
    let middleware: EventMiddleware;

    beforeEach(() => {
        mockedSendMessage.mockClear();
        middleware = new EventMiddleware();
    });

    describe('On creation of a new event', () => {
        it('Should send a message to events channel', async () => {
            await expect(middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
            await expect(middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
            await expect(middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
    
            expect(mockedSendMessage).toHaveBeenCalledTimes(1);
            expect(mockedSendMessage).toHaveBeenCalledWith(
                TELEGRAM_API_TOKEN, EVENTS_CHANNEL_ID,
                JSON.stringify({
                    date: new Date('2030-01-01'),
                    cost: 123
                })
            );
        });
    });

    describe('On incorrect date', () => {
        it('Should ask to re-enter the date', async () => {
            await expect(middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
            await expect(middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: 'incorrect date' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
            await expect(middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
            await expect(middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            )).resolves.toStrictEqual(true);
    
            expect(mockedSendMessage).toHaveBeenCalledTimes(1);
            expect(mockedSendMessage).toHaveBeenCalledWith(
                TELEGRAM_API_TOKEN, EVENTS_CHANNEL_ID,
                JSON.stringify({
                    date: new Date('2030-01-01'),
                    cost: 123
                })
            );
        });
    });
});