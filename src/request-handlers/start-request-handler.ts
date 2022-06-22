import { sendMessage } from '../telegram-utils';
import { RequestHandler } from './request-handler';

export class StartRequestHandler extends RequestHandler {
    constructor(chatId: number) {
        super(chatId);
    }

    override async start(arg: string): Promise<boolean> {
        await sendMessage(this._chatId, 'Привет, Бадада-друг!');
        return true;
    }
}