import { RequestBuilder } from "./request-builder.js";

export class StartRequestBuilder extends RequestBuilder {
    _chatId = null;

    constructor(messageId, chatId) {
        super(messageId);
        this._chatId = chatId;
    }

    async start(arg) {
        this._status = 'ready';
        this._request = {
            resource: 'message',
            method: 'post',
            data: {
                chatId: this._chatId,
                text: 'Hey Badada Buddy!'
            }
        }
    }
}