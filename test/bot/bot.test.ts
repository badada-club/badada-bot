import express, { Express } from 'express';
import request from 'supertest';
import { Bot } from '../../src/bot/bot';
import { commands } from '../../src/bot/commands';
import { Update } from '../../src/telegram/telegram-types';
import { getWebHookAction } from '../../src/telegram/telegram-utils';

jest.mock('axios', () => {
    const actual = jest.requireActual('axios');
    return {
        ...actual,
        post: jest.fn()
    };        
});

const token = 'token';

describe('Bot', () => {
    let bot: Bot;
    let app: Express;
    beforeAll(() => {
        bot = new Bot(token);
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        bot.setExpressWebHook(app);
    });
    describe('On /start request', () => {
        let update: Update;
        beforeAll(() => {
            update = {
                message: {
                    message_id: 123,
                    chat: { id: 123 },
                    text: `/${commands.start.command}`
                }
            };
        });
        it('Should return 200', async () => {
            const response = await request(app)
                .post(`/${getWebHookAction(token)}`)
                .send(update);
            expect(response.statusCode).toStrictEqual(200);
        });    
    });
    describe('On unknown request', () => {
        let update: Update;
        beforeAll(() => {
            update = {
                message: {
                    message_id: 123,
                    chat: { id: 123 },
                    text: 'some strange request'
                }
            };
        });
        it('Should return 200', async () => {
            const response = await request(app)
                .post(`/${getWebHookAction(token)}`)
                .send(update);
            expect(response.statusCode).toStrictEqual(200);
        });    
    });
    describe('On incorrect Update', () => {
        let update: Update;
        beforeAll(() => {
            update = {
            };
        });
        it('Should return 200', async () => {
            const response = await request(app)
                .post(`/${getWebHookAction(token)}`)
                .send(update);
            expect(response.statusCode).toStrictEqual(200);
        });    
    });
});