import { EVENTS_CHANNEL_ID, TELEGRAM_API_TOKEN } from '../config';
import { Context, Middleware, Pipeline } from '../pipeline';
import { Update } from '../telegram-types';
import { commands, sendMessage } from '../telegram-utils';

export class EventMiddleware implements Middleware {
    private readonly _pipelines = new Map<number, Pipeline>();

    private readonly _event: EventUnderConstruction = {};
    private _currentIndex = 0;

    filter(update: Update, ctx: Context): boolean {
        return ctx.command === commands.new_event || this._pipelines.has(ctx.chatId);
    }
    async handle(update: Update, ctx: Context): Promise<boolean> {
        if(ctx.command === commands.new_event) {
            await this._ask(ctx, 0);
            return true;
        } else {
            const pipeline = this._pipelines.get(ctx.chatId);
            if(await pipeline?.handle(update, ctx)) {
                this._pipelines.delete(ctx.chatId);
                this._currentIndex++;
                if(this._currentIndex < _questions.length) {
                    await this._ask(ctx, this._currentIndex);
                } else {
                    this._commit(ctx);
                }
                return true;
            } else {
                return false;
            }
        }
    }
    private async _commit(ctx: Context) {
        console.log('Applying new event...');
        await sendMessage(TELEGRAM_API_TOKEN, EVENTS_CHANNEL_ID, JSON.stringify(this._event));
    }
    async _ask(ctx: Context, index: number) {
        await ctx.telegram.sendMessage(_questions[index].question);
        const pipeline = this._createAnswerHandler(index);
        this._pipelines.set(ctx.chatId, pipeline);
    }
    private _createAnswerHandler(questionId: number): Pipeline {
        const pipeline = new Pipeline();
        const question = _questions[questionId];
        for(const check of question.checks) {
            pipeline.on(check.check, check.apply);
        }
        pipeline.on(() => true, (upd, ctx) => question.apply(upd, ctx, this._event));
        return pipeline;
    }
}

interface Question {
    question: string;
    checks: Array<{
        check: (update: Update, ctx: Context) => boolean,
        apply: (update: Update, ctx: Context) => Promise<boolean>
    }>,
    apply: (update: Update, ctx: Context, event: EventUnderConstruction) => Promise<boolean>,
}

const _questions: Question[] = [
    {
        question: 'Укажи дату в формате YYYY-MM-DD (по московскому времени).',
        checks: [
            {
                check: (update: Update, ctx: Context) => Number.isNaN(Date.parse(update.message?.text as string)),
                apply: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на дату. Пожалуйста, укажи дату в формате YYYY-MM-DD.'); return true; }
            },
            {
                check: (update: Update, ctx: Context) => Date.parse(update.message?.text as string) < Date.now(),
                apply: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Эта дата уже в прошлом. Пожалуйста, введи будущую дату.'); return true; }
            },
        ],
        apply: async (update: Update, ctx: Context, event: EventUnderConstruction) => {
            event.date = new Date(update.message?.text as string);
            return true;
        }
    },
    {
        question: 'Укажи стоимость.',
        checks: [
            {
                check: (update: Update, ctx: Context) => Number.isNaN(parseInt(update.message?.text as string)),
                apply: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на число. Пожалуйста, укажи корректную стоимость.'); return true; }
            },
        ],
        apply: async (update: Update, ctx: Context, event: EventUnderConstruction) => {
            event.cost = parseInt(update.message?.text as string);
            return true;
        }
    }
];

interface EventUnderConstruction {
    date?: Date;
    cost?: number;
}
interface Event {
    date: Date;
    cost: number;
}