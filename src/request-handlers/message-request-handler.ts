import { sendMessage } from '../telegram-methods.js';
import { TelegramRequest } from '../utils.js';
import { RequestHandler } from './request-handler.js';

export interface MessageRequestData {
    chatId: number,
    text: string
}
export interface MessageRequest extends TelegramRequest {
    data: MessageRequestData
}

export class MessageRequestHandler extends RequestHandler {
    override async post(request: MessageRequest) {
        await sendMessage(request.data.chatId, request.data.text);
    }
}

