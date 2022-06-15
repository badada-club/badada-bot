import { EventRequestHandler } from './event-request-handler.js'
import { MessageRequestHandler } from './message-request-handler.js'

export const RequestHandlerFactory = {
    get: (resource) => {
        switch(resource) {
            case 'event':
                return new EventRequestHandler();
            case 'message':
                return new MessageRequestHandler();
            default:
                throw new Error();
        }
    }
}