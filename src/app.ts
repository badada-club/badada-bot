import express, { Express, NextFunction, Request, Response } from 'express';
import { Bot } from './bot';
import { TELEGRAM_API_TOKEN } from './config';
import { EchoMiddleware } from './middleware/echo-middleware';
import { EventMiddleware } from './middleware/event-middleware';
import { commands, TELEGRAM_URI } from './telegram-utils';

export const bot = new Bot(TELEGRAM_API_TOKEN);
bot.pipeline.use(new EventMiddleware());
bot.pipeline.on((upd, ctx) => ctx.command === commands.start, async (upd, ctx) => { await ctx.telegram.sendMessage('Привет!'); return true; });
bot.pipeline.use(new EchoMiddleware());

export const app: Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', TELEGRAM_URI);
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

bot.setExpressWebHook(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Exception thrown while handling the request...');
    if(err) {
        console.error(err.toString());
        console.error(err.stack);    
    }
    res.status(200 /*500*/).send('500: Exception thrown while handling the request.');
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(200 /*404*/).send('404: Unknown route.');
});
