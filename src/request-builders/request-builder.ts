import { Command, TelegramRequest } from "../utils.js";

export type RequestBuilderStatus = 'down' | 'up' | 'canceled' | 'terminated' | 'ready'

export class RequestBuilder {
    _status: RequestBuilderStatus = 'down';
    _request: TelegramRequest;
    _chatId: number;

    get status() { return this._status; }
    get request() { return this._request; }
    get chatId() { return this._chatId; }

    constructor(chatId: number) {
        this._chatId = chatId;
    }
    
    async addMessage(message: string) { }
    async addCommand(command: Command) { }
    // async terminate() {
    //     this._status = 'terminated';
    // }
}