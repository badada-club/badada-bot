import { EchoRequestBuilder } from "./echo-request-builder.js";
import { StartRequestBuilder } from "./start-request-builder.js";
import { EventRequestBuilder } from "./event-request-builder.js";

export const RequestBuilderFactory = {
    create: (command, chatId) => {
        switch(command) {
            case 'start':
                return new StartRequestBuilder(chatId);
            case 'echo':
                return new EchoRequestBuilder(chatId);
            case 'new_event':
                return new EventRequestBuilder(chatId);    
        }
    }
}