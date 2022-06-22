import { CallbackQuery } from '../telegram-types';
import { Command } from '../telegram-utils';

export class RequestHandler {
    _chatId: number;

    get chatId() { return this._chatId; }

    constructor(chatId: number) {
        this._chatId = chatId;
    }

    async start(arg: string | undefined): Promise<boolean> { return false; }

    async addMessage(message: string): Promise<boolean> { return false; }
    async addCommand(command: Command | undefined, arg: string | undefined): Promise<boolean> { return false; }
    async addQuery(query: CallbackQuery): Promise<boolean> { return false; }

    // async terminate(arg: string | undefined): Promise<void> { }
}