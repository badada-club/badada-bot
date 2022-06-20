import { Command } from '../telegram-utils.js';
import { EchoRequestHandler } from './echo-request-handler.js';
import { EventRequestHandler } from './event-request-handler.js';
import { RequestHandler } from './request-handler.js';
import { StartRequestHandler } from './start-request-handler.js';

export const RequestHandlerFactory = {
    create: (command: Command, chatId: number): RequestHandler | undefined => {
        switch(command) {
            case 'start':
                return new StartRequestHandler(chatId);
            case 'echo':
                return new EchoRequestHandler(chatId);
            case 'new_event':
                return new EventRequestHandler(chatId);    
        }
    }
};