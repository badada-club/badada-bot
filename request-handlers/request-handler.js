import { RequestHandlerFactory } from './request-handler-factory.js'
export class RequestHandler {
    static async handle(request, res) {
        if(request && request.resource && request.method) {
            const handler = RequestHandlerFactory.create(request.resource);
            switch(request.method) {
                case 'post':
                    handler.post && await handler.post(request);
                    break;
                case 'get':
                    handler.get && await handler.get(request);
                    break;
                case 'put':
                    handler.put && await handler.put(request);
                    break;
                default:
                    return res.sendStatus(400);
            }
        }
    }

    async post(request) {
    }
    async get(request) {
    }
    async put(request) {
    }
}