export class RequestBuilder {
    _status = 'down';
    _request;
    _chatId;

    get status() { return this._status; }
    get request() { return this._request; }
    get chatId() { return this._chatId; }

    constructor(chatId) {
        this._chatId = chatId;
    }
    
    async addMessage(message) { }
    async addCommand(command) { }
    // async terminate() {
    //     this._status = 'terminated';
    // }
}