import { Context, Middleware } from '../pipeline';
import { Update } from '../telegram-types';
import { commands } from '../telegram-utils';

export class EchoMiddleware implements Middleware {
    filter(update: Update, ctx: Context) {
        return !!update.message && ctx.command === commands.echo;
    }
    async handle(update: Update, ctx: Context): Promise<boolean> {
        if(ctx.commandArg)
            await ctx.telegram.sendMessage(ctx.commandArg);
        return true;
    }
}