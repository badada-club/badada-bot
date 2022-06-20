import { sendMessage } from '../telegram-utils.js';
import { RequestHandler } from './request-handler.js';

export class EchoRequestHandler extends RequestHandler {
    constructor(chatId: number) {
        super(chatId);
    }

    override async start(arg: string): Promise<boolean> {
        await sendMessage(this._chatId, arg);
        return true;
    }
}