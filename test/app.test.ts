import request from 'supertest';
import { app } from '../src/app';
import { TELEGRAM_API_TOKEN } from '../src/config';
import { getWebHookAction } from '../src/telegram-utils';

jest.mock('axios', () => {
    const actual = jest.requireActual('axios');
    return {
        ...actual,
        post: jest.fn()
    };        
});

describe('app', () => {
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
    describe('On /start request', () => {
        it('Should return 200', async () => {
            const update = {
                message: {
                    message_id: 123,
                    chat: { id: 123 },
                    text: '/start'
                }
            };
            const response = await request(app)
                .post(`/${getWebHookAction(TELEGRAM_API_TOKEN)}`)
                .send(update);
            expect(response.statusCode).toStrictEqual(200);
        });    
    });

});