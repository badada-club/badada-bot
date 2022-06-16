import { EchoRequestBuilder } from "./echo-request-builder.js";
import { StartRequestBuilder } from "./start-request-builder.js";
import { EventRequestBuilder } from "./event-request-builder.js";
import { Command } from "../utils.js";
import { RequestBuilder } from "./request-builder.js";

export const RequestBuilderFactory = {
    create: (command: Command, chatId: number): RequestBuilder | undefined => {
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