import { RequestBuilder } from "./request-builder.js";

export class StartRequestBuilder extends RequestBuilder {
    constructor(chatId: number) {
        super(chatId);
    }

    override async addMessage(message: string) {
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