export class RequestBuilder {
    _status = 'down';
    _request;
    _messageId;

    get status() { return this._status; }
    get request() { return this._request; }
    get messageId() { return this._messageId; }

    constructor(messageId) {
        this._messageId = messageId;
    }
    
    async start(arg) { }
    async addMessage(message) { }
    async addCommand(command) { }
}