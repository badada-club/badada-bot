import axios from 'axios';
import { Express, Request, Response } from 'express';
import { TELEGRAM_BOT_USERNAME } from '../config';
import { Update } from '../telegram/telegram-types';
import { getChatId, getCommand, getTelegramApiUri, getWebHookAction, setMyCommands } from '../telegram/telegram-utils';
import { commands } from './commands';
import { Context, Pipeline } from './pipeline';
import { Telegram } from './telegram';

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
            console.log('Update received: ' + JSON.stringify(update));
            try {
                await this._handle(update);
            } catch(e) {
                if(e instanceof CreateContextError) {
                    return res.status(200 /*400*/).send(e.message);
                } else if(e instanceof HandleUpdateError) {
                    return res.status(200 /*400*/).send(e.message);
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
            let command: string | undefined = undefined;
            let commandArg: string | undefined = undefined;
            const parseCommandResult = getCommand(text);
            if(parseCommandResult) {
                let botName;
                ({ command, botName, commandArg } = parseCommandResult);
                if(!!botName && botName !== TELEGRAM_BOT_USERNAME)
                    throw new CreateContextError('400: The command is issued to another bot.');
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
    async init(): Promise<void> {
        await setMyCommands(this._token, Object.values(commands));
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