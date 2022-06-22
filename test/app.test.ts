import request from 'supertest';
import { app } from '../src/app';
import { WEBHOOK_ACTION } from '../src/config';

describe('Request pipeline handling', () => {
    test('POST requests to actions other then that of Telegram webhook should still return 200 for Telegram to stop resending the incorrect message', async () => {
        const response = await request(app).post('/someaction');
        expect(response.statusCode).toStrictEqual(200);
        expect(response.text).toContain('404'); // The error code is sent in message body instead
    });
    test('GET requests to Telegram webhook action should still return 200 for Telegram to stop resending the incorrect message', async () => {
        const response = await request(app).get(`/${WEBHOOK_ACTION}`);
        expect(response.statusCode).toStrictEqual(200);
        expect(response.text).toContain('404'); // The error code is sent in message body instead
    });
});