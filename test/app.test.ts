import axios from 'axios';
import request from 'supertest';
import { app } from '../src/app/app';
import { commands } from '../src/bot/commands';
import { TELEGRAM_API_TOKEN } from '../src/config';
import { getWebHookAction } from '../src/telegram/telegram-utils';
import { toMocked } from './test-utils';

describe('express setup', () => {
    describe('On POST request to actions other then that of Telegram webhook', () => {
        it('Should still return 200 for Telegram to stop resending the incorrect message', async () => {
            const response = await request(app).post('/someaction');
            expect(response.statusCode).toStrictEqual(200);
            expect(response.text).toContain('404'); // The error code is sent in message body instead
        });
    });
    describe('On GET requests to Telegram webhook action', () => {
        it('Should still return 200 for Telegram to stop resending the incorrect message', async () => {
            const response = await request(app).get(`/${getWebHookAction(TELEGRAM_API_TOKEN)}`);
            expect(response.statusCode).toStrictEqual(200);
            expect(response.text).toContain('404'); // The error code is sent in message body instead
        });    
    });
});

jest.mock('axios', () => {
    const actual = jest.requireActual('axios');
    return {
        ...actual,
        post: jest.fn()
    };        
});
const mockedAxiosPost = toMocked(axios.post);

describe('bot setup', () => {
    beforeEach(() => {
        mockedAxiosPost.mockClear();
    });

    it('Questionnaire requests should be handled first in the bot pipeline', async () => {
        // Start a new event questionnaire
        await request(app)
            .post(`/${getWebHookAction(TELEGRAM_API_TOKEN)}`)
            .send({
                message: {
                    message_id: 123,
                    chat: { id: 123 },
                    text: `/${commands.new_event}`
                }
            });
        mockedAxiosPost.mockClear();
        
        // Issue a command that does not produce any output
        // if handled separately
        await request(app)
            .post(`/${getWebHookAction(TELEGRAM_API_TOKEN)}`)
            .send({
                message: {
                    message_id: 124,
                    chat: { id: 123 },
                    text: `/${commands.echo}`
                }
            });

        // Assert that the output is still produced (by the questionnaire handler)
        expect(mockedAxiosPost).toHaveBeenCalledTimes(2);
    });    
});