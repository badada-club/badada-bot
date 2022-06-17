import { Resource } from '../utils.js';
import { EventsRequestHandler } from './event-request-handler.js';
import { MessageRequestHandler } from './message-request-handler.js';
import { RequestHandler } from './request-handler.js';

export const RequestHandlerFactory = {
    create: (resource: Resource): RequestHandler => {
        switch(resource) {
            case 'events':
                return new EventsRequestHandler();
            case 'message':
                return new MessageRequestHandler();
            default:
                throw new Error();
        }
    }
};