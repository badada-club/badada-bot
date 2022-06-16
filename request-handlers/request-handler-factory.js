import { EventsRequestHandler } from './event-request-handler.js'
import { MessageRequestHandler } from './message-request-handler.js'

export const RequestHandlerFactory = {
    create: (resource) => {
        switch(resource) {
            case 'events':
                return new EventsRequestHandler();
            case 'message':
                return new MessageRequestHandler();
            default:
                throw new Error();
        }
    }
}