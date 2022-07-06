import { BotCommand } from '../telegram/telegram-types';
import { sendMessage, setMyCommands } from '../telegram/telegram-utils';

export interface TelegramApi {
    sendMessage: (message: string) => Promise<void>;
    setMyCommands: (commands: BotCommand[]) => Promise<void>;
}
export class Telegram implements TelegramApi {
    private readonly _token: string;
    private readonly _chatId: number;

    constructor(token: string, chatId: number) {
        this._token = token;
        this._chatId = chatId;
    }
    async sendMessage(message: string): Promise<void> {
        await sendMessage(this._token, this._chatId, message);
    }
    async setMyCommands(commands: BotCommand[]): Promise<void> {
        await setMyCommands(this._token, commands);
    }

}