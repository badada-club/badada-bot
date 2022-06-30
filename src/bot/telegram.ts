import { sendMessage } from '../telegram/telegram-utils';

export class Telegram {
    private readonly _token: string;
    private readonly _chatId: number;

    constructor(token: string, chatId: number) {
        this._token = token;
        this._chatId = chatId;
    }
    async sendMessage(message: string): Promise<void> {
        await sendMessage(this._token, this._chatId, message);
    }
}