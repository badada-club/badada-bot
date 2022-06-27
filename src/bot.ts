import axios from 'axios';
import { Express, Request, Response } from 'express';
import { Context, Pipeline } from './pipeline';
import { Update } from './telegram-types';
import { Command, getChatId, getCommand, getTelegramApiUri, getWebHookAction, Telegram } from './telegram-utils';

export class Bot {
    private readonly _token: string;
    readonly pipeline: Pipeline = new Pipeline();

    constructor(token: string) {
        this._token = token;
    }

    async setWebHook(thisUri: string): Promise<boolean> {
        const setWebhookResponse = await axios.post(`${getTelegramApiUri(this._token)}/setWebhook`, {
            url: `${thisUri}/${getWebHookAction(this._token)}`
        });
        return setWebhookResponse.status == 200;
    }

    setExpressWebHook(app: Express): void {
        app.post(`/${getWebHookAction(this._token)}`, async (req: Request, res: Response) => {
            const update: Update = req.body;
            try {
                await this._handle(update);
            } catch(e) {
                if(e instanceof CreateContextError) {
                    res.status(200 /*400*/).send(e.message);
                } else if(e instanceof HandleUpdateError) {
                    res.status(200 /*400*/).send(e.message);
                } else {
                    throw e;
                }
            }
            res.sendStatus(200);
        });
    }

    private async _handle(update: Update): Promise<boolean> {
        const ctx = this._createContext(update);
        return await this.pipeline.handle(update, ctx);
    }

    private _createContext(update: Update): Context {
        if(update.message) {
            const chatId = getChatId(update.message);
            if(!chatId)
                throw new CreateContextError('400: The received message does not contain the chat id.');
            const text = update.message.text;
            if(!text)
                throw new CreateContextError('400: The text of the received message is empty.');
            const trimmedText = text.trimStart();
            let command: Command | undefined = undefined;
            let commandArg: string | undefined = undefined;
            if(trimmedText.startsWith('/')) {
                command = getCommand(trimmedText);
                if(command)
                    commandArg = trimmedText.substring(command.length + 1);
            }
            return {
                chatId: chatId,
                command: command,
                commandArg: commandArg,
                telegram: new Telegram(this._token, chatId)
            };
        } else {
            throw new CreateContextError('500: Could not create Update context.');
        }
    }

    async terminate(): Promise<void> {

    }
}

class CreateContextError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CreateContextError';
    }
}
class HandleUpdateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HandleUpdateError';
    }
}