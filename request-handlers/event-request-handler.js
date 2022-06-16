import { sendMessage } from "../telegram.js";
import { RequestHandler } from "./request-handler.js";

export class EventsRequestHandler extends RequestHandler {
    async post(request) {
        await sendMessage(request.data.chatId, JSON.stringify(request));
    }
}

