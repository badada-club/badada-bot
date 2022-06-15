import { EchoRequestBuilder } from "./echo-request-builder.js";
import { StartRequestBuilder } from "./start-request-builder.js";

export const RequestBuilderFactory = {
    get: (command, messageId, chatId) => {
        switch(command) {
            case 'start':
                return new StartRequestBuilder(messageId, chatId);
            case 'echo':
                return new EchoRequestBuilder(messageId, chatId);
        }
    }
}