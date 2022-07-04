import { BadadaEvent, BadadaEventSeed } from '../../common/event';
import { EVENTS_INPUT_TIMEZONE } from '../../config';
import { Update } from '../../telegram/telegram-types';
import { addHours, getUtcToday, tryParseUtcIsoDate, tryParseUtcIsoDateValue } from '../../utils';
import { commands } from '../commands';
import { EventCommitter } from '../event-committer/event-committer';
import { Context, Middleware, Pipeline } from '../pipeline';

export class EventMiddleware implements Middleware {
    private readonly _sessions = new Map<number, EventMiddlewareSession>();
    private _committer: EventCommitter;

    constructor(committer: EventCommitter) {
        this._committer = committer;
    }

    filter(update: Update, ctx: Context): boolean {
        return ctx.command === commands.new_event || this._sessions.has(ctx.chatId);
    }
    async handle(update: Update, ctx: Context): Promise<boolean> {
        console.log(
            `Event middleware handle
                update: ${JSON.stringify(update)}`
        );
        if(ctx.command === commands.new_event) {
            console.log('Event middleware handle new command');
            await ctx.telegram.sendMessage(questions[0].question);            
            this._sessions.set(ctx.chatId, {
                seed: { },
                questionId: 0
            });
        } else {
            const session: EventMiddlewareSession = this._sessions.get(ctx.chatId) as EventMiddlewareSession;
            console.log(`
                Event middleware handle
                    session: ${JSON.stringify(session)}
                `);
            if(!await questions[session.questionId].checks.handle(update, ctx)) {
                await questions[session.questionId].apply(update, ctx, session.seed);
                this._sessions.delete(ctx.chatId);
                if(session.questionId + 1 >= questions.length) {
                    console.log('Applying new event...');
                    await this._committer.commit({
                        event: session.seed as BadadaEvent,
                        creatorChatId: ctx.chatId,
                    });
                } else {
                    await ctx.telegram.sendMessage(questions[session.questionId + 1].question);
                    this._sessions.set(ctx.chatId, {
                        seed: session.seed,
                        questionId: session.questionId + 1
                    });
                }
            } else {
                await ctx.telegram.sendMessage(questions[session.questionId].question);                
            }
        }
        return true;
    }
}

interface Question {
    question: string;
    checks: Pipeline,
    apply: (update: Update, ctx: Context, event: BadadaEventSeed) => void,
}

const questions: Question[] = [
    {
        question: 'Укажи дату в формате YYYY-MM-DD (по московскому времени).',
        checks: Pipeline.create(
            {
                filter: (update: Update, ctx: Context) => !tryParseUtcIsoDateValue(update.message?.text as string),
                handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на дату.'); return true; }
            },
            {
                filter: (update: Update, ctx: Context) =>
                    addHours(tryParseUtcIsoDate(update.message?.text as string) as Date, -EVENTS_INPUT_TIMEZONE).valueOf() < getUtcToday().valueOf(),
                handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Эта дата уже в прошлом.'); return true; }
            },

        ),
        apply: (update: Update, ctx: Context, event: BadadaEventSeed): void => {
            event.date = addHours(tryParseUtcIsoDate(update.message?.text as string) as Date, -EVENTS_INPUT_TIMEZONE);
        }
    },
    {
        question: 'Укажи стоимость.',
        checks: Pipeline.create(
            {
                filter: (update: Update, ctx: Context) => Number.isNaN(parseInt(update.message?.text as string)),
                handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на число.'); return true; }
            },
        ),
        apply: (update: Update, ctx: Context, event: BadadaEventSeed): void => {
            event.cost = parseInt(update.message?.text as string);
        }
    }
];

type EventMiddlewareSession = {
    seed: BadadaEventSeed
    questionId: number
};