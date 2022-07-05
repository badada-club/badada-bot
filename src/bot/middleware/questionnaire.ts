import { Update } from '../../telegram/telegram-types';
import { Context, Middleware, Pipeline } from '../pipeline';

export class Questionnaire<T> implements Middleware {
    private readonly _sessions = new Map<number, QuestionnaireSession<T>>();
    private readonly _command: string;
    private readonly _questions: Question<T>[];
    private readonly _commit: (ctx: Context, answer: T) => void;

    constructor(command: string, questions: Question<T>[], commit: (ctx: Context, answer: T) => void) {
        this._command = command;
        this._questions = questions;
        this._commit = commit;
    }

    filter(upd: Update, ctx: Context): boolean {
        return ctx.command === this._command || this._sessions.has(ctx.chatId);
    }
    async handle(upd: Update, ctx: Context): Promise<boolean> {
        let session: QuestionnaireSession<T>;
        if(ctx.command === this._command) {
            await this._startSession(ctx, { seed: {} as T, questionId: 0 });
        } else {
            session = this._sessions.get(ctx.chatId) as QuestionnaireSession<T>;
            const question = this._questions[session.questionId];
            if(await question.answer(upd, ctx, session.seed)) {
                this._endSession(ctx);
                if(session.questionId + 1 < this._questions.length)
                    await this._startSession(ctx, { seed: session.seed, questionId: session.questionId + 1 });
                else
                    this._commit(ctx, session.seed);
            } else {
                await question.ask(ctx);
            }  
        }
        return true;
    }
    private async _startSession(ctx: Context, session: QuestionnaireSession<T>): Promise<void> {
        this._sessions.set(ctx.chatId, session);
        await this._questions[session.questionId].ask(ctx);
    }
    private _endSession(ctx: Context): void {
        this._sessions.delete(ctx.chatId);
    }
}

export type QuestionnaireSession<T> = {
    questionId: number,
    seed: T
}

export class Question<T> {
    private readonly _question: string;
    private readonly _checks: Pipeline;
    private readonly _apply: (upd: Update, ctx: Context, seed: T) => void;

    constructor(question: string, checks: Pipeline, apply: (upd: Update, ctx: Context, seed: T) => void) {
        this._question = question;
        this._checks = checks;
        this._apply = apply;
    }

    async ask(ctx: Context): Promise<void> {
        await ctx.telegram.sendMessage(this._question);
    }

    async answer(upd: Update, ctx: Context, seed: T): Promise<boolean> {
        if(!await this._checks.handle(upd, ctx)) {
            this._apply(upd, ctx, seed);
            return true;
        } else {
            return false;
        }
    }
}