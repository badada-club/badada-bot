import { MessageRequest } from '../request-handlers/message-request-handler.js';
import { RequestBuilder } from './request-builder.js';

export class EchoRequestBuilder extends RequestBuilder {
    override _request: MessageRequest;

    constructor(chatId: number) {
        super(chatId);
    }

    override async addMessage(arg: string) {
        this._status = 'ready';
        this._request = {
            resource: 'message',
            method: 'post',
            data: {
                chatId: this._chatId,
                text: arg
            }
        };
    }
}