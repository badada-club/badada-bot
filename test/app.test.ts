import request from 'supertest';
import { app } from '../src/app';

describe('Request pipeline handling', () => {
    test('POST requests to actions other then that of Telegram webhook should fail with 404', async () => {
        const response = await request(app).post('/someaction');
        expect(response.statusCode).toStrictEqual(404);
    });
});