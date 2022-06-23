import { EVENTS_CHANNEL_ID } from '../../src/config';
import { EventRequestHandler } from '../../src/request-handlers/event-request-handler';
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

describe('EventRequestHandler', () => {
    let handler: EventRequestHandler;

    beforeEach(() => {
        mockedSendMessage.mockClear();
        handler = new EventRequestHandler(123);
    });

    describe('On creation of a new event', () => {
        it('Should send a message to events channel', async () => {
            mockedSendMessage.mockReturnValue(Promise<void>.resolve());
            await handler.start();
            await handler.addMessage('2030-01-01');
            mockedSendMessage.mockClear();
            
            await handler.addMessage('123');
    
            expect(mockedSendMessage).toHaveBeenCalledTimes(1);
            expect(mockedSendMessage).toHaveBeenCalledWith(EVENTS_CHANNEL_ID,
                JSON.stringify({
                    date: new Date('2030-01-01'),
                    cost: 123
                })
            );
        });
    });
});