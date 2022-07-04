import express, { Express, NextFunction, Request, Response } from 'express';
import { Bot } from '../bot/bot';
import { commands } from '../bot/commands';
import { EventCommitterChain } from '../bot/event-committer/event-committer';
import { MessageToChannelEventCommitter } from '../bot/event-committer/message-to-channel-event-committer';
import { EventMiddleware } from '../bot/middleware/event-middleware';
import { Context } from '../bot/pipeline';
import { BadadaEvent } from '../common/event';
import { BADADA_CLUB_CHAT_ID, TELEGRAM_API_TOKEN } from '../config';
import { CronJobCron } from '../cron/cron-job-cron';
import { Update } from '../telegram/telegram-types';
import { sendMessage } from '../telegram/telegram-utils';
import { addDays, getUtcToday } from '../utils';
import { DataBaseEventCommitter } from './db-event-committer';
import { get as eventProvider } from './db-event-provider';

export const bot = new Bot(TELEGRAM_API_TOKEN);
bot.pipeline.use(new EventMiddleware(new EventCommitterChain(new MessageToChannelEventCommitter(), new DataBaseEventCommitter())));
bot.pipeline.on(
    (upd: Update, ctx: Context) => ctx.command === commands.start,
    async (upd: Update, ctx: Context) => { await ctx.telegram.sendMessage('Привет!'); return true; }
);
bot.pipeline.on(
    (upd: Update, ctx: Context) => !!upd.message && ctx.command === commands.echo,
    async (upd: Update, ctx: Context) => { if(ctx.commandArg) await ctx.telegram.sendMessage(ctx.commandArg); return true; }
);
bot.pipeline.on(
    (upd: Update, ctx: Context) => ctx.command === commands.events_today,
    async (upd: Update, ctx: Context) => {
        await showTodayEvents(async (message: string) => await ctx.telegram.sendMessage(message));
        return true;
    }
);

async function getTodayEvents(): Promise<BadadaEvent[]> {
    return await eventProvider(getUtcToday(), addDays(getUtcToday(), 1));
}
async function showTodayEvents(sendMessage: (message: string) => Promise<void>): Promise<void> {
    await sendMessage('Сегодня планируются такие мероприятия:');
    (await getTodayEvents()).forEach(async event => await sendMessage(JSON.stringify(event)));
}

export const cron = new CronJobCron();
cron.on('tick', async () => {
    await showTodayEvents(async (message:string) => await sendMessage(TELEGRAM_API_TOKEN, BADADA_CLUB_CHAT_ID, message));
});

cron.start();

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

cron.setupExpress(app);

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
