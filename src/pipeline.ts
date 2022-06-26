import { Update } from './telegram-types';
import { Command } from './telegram-utils';

export class Pipeline implements UpdateHandler {
    static create(...middlewares: Middleware[]) {
        const pipeline = new Pipeline();
        for(const middleware of middlewares)
            pipeline.use(middleware);
        return pipeline;
    }

    private _items: Middleware[] = [];

    async handle(update: Update, ctx: Context): Promise<boolean> {
        for(const item of this._items) {
            if(item.filter(update, ctx) && await item.handle(update, ctx))
                return true;
        }
        return false;
    }

    on(filter: FilterUpdate, handle: HandleUpdate) {
        this.use({ filter, handle });
    }
    use(middleware: Middleware) {
        this._items.push(middleware);
    }
}

export type HandleUpdate = (update: Update, ctx: Context) => Promise<boolean>;
export interface UpdateHandler {
    handle: HandleUpdate
}
export type FilterUpdate = (update: Update, ctx: Context) => boolean;
export interface UpdateFilter {
    filter: FilterUpdate
}
export type Middleware = UpdateHandler & UpdateFilter;

export interface Context {
    chatId: number;
    telegram: Telegram;
    command?: Command;
    commandArg?: string;
}
export interface Telegram {
    sendMessage: (message: string) => Promise<void>;
}