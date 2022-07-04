import { EventCommitter } from '../../../src/bot/event-committer/event-committer';
import { EventMiddleware } from '../../../src/bot/middleware/event-middleware';
import { eventDateToUtc } from '../../../src/utils';

const now = new Date(Date.UTC(2022, 6, 4));
jest.mock('../../../src/utils', () => {
    const actual = jest.requireActual('../../../src/utils');
    return {
        ...actual,
        getNow: jest.fn().mockImplementation(() => now)
    };        
});

describe('EventMiddleware', () => {
    let middleware: EventMiddleware;
    let commitSpy: jest.Mock;

    beforeEach(() => {
        commitSpy = jest.fn();
        const committerStub: EventCommitter = {
            commit: commitSpy
        };
        middleware = new EventMiddleware(committerStub);
    });

    describe('On correct creation of a new event', () => {
        it('All messages should be handled', async () => {
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
        });
        it('Should send a message to events channel', async () => {
            await middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
    
            expect(commitSpy).toHaveBeenCalledTimes(1);
            expect(commitSpy).toHaveBeenCalledWith(
                {
                    creatorChatId: 123,
                    event: {
                        date: eventDateToUtc(new Date('2030-01-01')),
                        cost: 123
                    }
                }
            );
        });
        it('Should ask questions', async () => {
            const newEventStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: newEventStub } }
            );
            expect(newEventStub).toHaveBeenCalledTimes(1);

            const dateStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: dateStub } }
            );
            expect(dateStub).toHaveBeenCalledTimes(1);
            
            const costStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: costStub } }
            );
            expect(costStub).toHaveBeenCalledTimes(0);
        });
    });

    describe('On incorrect date', () => {
        it('All messages should be handled', async () => {
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
        });
        it('Should ask to re-enter the date', async () => {
            const newEventStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: newEventStub } }
            );
            expect(newEventStub).toHaveBeenCalledTimes(1);

            const incorrectDateStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: 'incorrect date' } },
                { chatId: 123, telegram: { sendMessage: incorrectDateStub } }
            );
            expect(incorrectDateStub).toHaveBeenCalledTimes(2);

            const dateStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: dateStub } }
            );
            expect(dateStub).toHaveBeenCalledTimes(1);
            
            const costStub = jest.fn().mockReturnValue(Promise<void>.resolve());
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: costStub } }
            );
            expect(costStub).toHaveBeenCalledTimes(0);
        });
        it('Should finally send a message to events channel', async () => {
            await middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: 'incorrect date' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '2030-01-01' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
    
            expect(commitSpy).toHaveBeenCalledTimes(1);
            expect(commitSpy).toHaveBeenCalledWith(
                {
                    creatorChatId: 123,
                    event: {
                        date: eventDateToUtc(new Date('2030-01-01')),
                        cost: 123
                    }
                }
            );
        });

    });

    describe('On today date', () => {
        it('Should accept it', async () => {
            await middleware.handle(
                { message: { message_id: 1, chat: { id: 123 }, text: '/new_event' } },
                { chatId: 123, command: 'new_event', telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}` } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
            await middleware.handle(
                { message: { message_id: 2, chat: { id: 123 }, text: '123' } },
                { chatId: 123, telegram: { sendMessage: jest.fn().mockReturnValue(Promise<void>.resolve()) } }
            );
    
            expect(commitSpy).toHaveBeenCalledTimes(1);
            expect(commitSpy).toHaveBeenCalledWith(
                {
                    creatorChatId: 123,
                    event: {
                        date: eventDateToUtc(now),
                        cost: 123
                    }
                }
            );
        });

    });
});