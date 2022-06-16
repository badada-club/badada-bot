import { sendMessage } from "../telegram-methods.js";
import { TelegramRequest } from "../utils.js";
import { RequestHandler } from "./request-handler.js";

export interface EventRequestData {
    chatId: number
}
export interface EventRequest extends TelegramRequest {
    data: EventRequestData
}

export class EventsRequestHandler extends RequestHandler {
    override async post(request: EventRequest) {
        await sendMessage(request.data.chatId, JSON.stringify(request));
    }
}

