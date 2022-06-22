import { Command } from '../telegram-utils';
import { EchoRequestHandler } from './echo-request-handler';
import { EventRequestHandler } from './event-request-handler';
import { RequestHandler } from './request-handler';
import { StartRequestHandler } from './start-request-handler';

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