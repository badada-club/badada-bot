import { RequestBuilder } from "./request-builder.js";

export class StartRequestBuilder extends RequestBuilder {
    constructor(chatId) {
        super(chatId);
    }

    async addMessage(arg) {
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