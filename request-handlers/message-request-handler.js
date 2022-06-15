import { RequestHandler } from "./request-handler.js";
import { sendMessage } from "../telegram.js";

export class MessageRequestHandler extends RequestHandler {
    async post(request) {
        await sendMessage(request.data.chatId, request.data.text);
    }
}

