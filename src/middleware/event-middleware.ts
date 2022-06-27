import { EVENTS_CHANNEL_ID, TELEGRAM_API_TOKEN } from '../config';
import { Context, Middleware, Pipeline } from '../pipeline';
import { Update } from '../telegram-types';
import { commands, sendMessage } from '../telegram-utils';

export class EventMiddleware implements Middleware {
    private readonly _indicies = new Map<number, number>();
    private readonly _event: EventSeed = {};

    filter(update: Update, ctx: Context): boolean {
        return ctx.command === commands.new_event || this._indicies.has(ctx.chatId);
    }
    async handle(update: Update, ctx: Context): Promise<boolean> {
        console.log(
            `Event middleware handle
                update: ${JSON.stringify(update)}`
        );
        if(ctx.command === commands.new_event) {
            console.log('Event middleware handle new command');
            await ctx.telegram.sendMessage(questions[0].question);            
            this._indicies.set(ctx.chatId, 0);
        } else {
            const questionId: number = this._indicies.get(ctx.chatId) as number;
            console.log(`
                Event middleware handle
                    questionId: ${questionId}
                `);
            if(!await questions[questionId].checks.handle(update, ctx)) {
                await questions[questionId].apply(update, ctx, this._event);
                this._indicies.delete(ctx.chatId);
                if(questionId + 1 >= questions.length)
                    await this._commit();
                else
                    this._indicies.set(ctx.chatId, questionId + 1);
            } else {
                await ctx.telegram.sendMessage(questions[questionId].question);                
            }
        }
        return true;
    }
    private async _commit(): Promise<void> {
        console.log('Applying new event...');
        await sendMessage(TELEGRAM_API_TOKEN, EVENTS_CHANNEL_ID, JSON.stringify(this._event));
    }
}

interface Question {
    question: string;
    checks: Pipeline,
    apply: (update: Update, ctx: Context, event: EventSeed) => void,
}

const questions: Question[] = [
    {
        question: 'Укажи дату в формате YYYY-MM-DD (по московскому времени).',
        checks: Pipeline.create(
            {
                filter: (update: Update, ctx: Context) => Number.isNaN(Date.parse(update.message?.text as string)),
                handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на дату.'); return true; }
            },
            {
                filter: (update: Update, ctx: Context) => Date.parse(update.message?.text as string) < Date.now(),
                handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Эта дата уже в прошлом.'); return true; }
            },

        ),
        apply: (update: Update, ctx: Context, event: EventSeed): void => {
            event.date = new Date(update.message?.text as string);
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
        apply: (update: Update, ctx: Context, event: EventSeed): void => {
            event.cost = parseInt(update.message?.text as string);
        }
    }
];

interface EventSeed {
    date?: Date;
    cost?: number;
}