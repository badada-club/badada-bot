import express, { Express, NextFunction, Request, Response } from 'express';
import { TELEGRAM_BOT_USERNAME, TELEGRAM_URI, WEBHOOK_ACTION } from './config.js';
import { RequestBuilderFactory } from './request-builders/request-builder-factory.js';
import { RequestBuilder } from './request-builders/request-builder.js';
import { RequestHandlerFactory } from './request-handlers/request-handler-factory.js';
import { CallbackQuery as TelegramCallbackQuery, Message as TelegramMessage } from './telegram-types.js';
import { Command, Guard, TelegramRequest, tryParseJSON } from './utils.js';

const PORT: string | number = process.env.PORT || 3000;

const app: Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', TELEGRAM_URI);
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post(`/${WEBHOOK_ACTION}`, async (req: Request, res: Response) => {
    const { message, callback_query } = req.body;
    if(message)
        await handleMessage(message, res);
    else if(callback_query)
        await handleCallbackQuery(callback_query, res);
    else
        res.sendStatus(400);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Exception thrown while handling the request...');
    if(err) {
        console.error(err.toString());
        console.error(err.stack);    
    }
    res.status(500);
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
}); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

const rbCache = new Map();

async function handleMessage(message: TelegramMessage, res: Response) {
    Guard.requires(!!message);
    console.log('handleMessage: ' + JSON.stringify(message));

    if(message.via_bot)
        return res.sendStatus(200);
    const text = message.text;
    if(!text)
        return res.status(400).send('The text of the received message is empty.');
    const chatId = message.chat?.id;
    if(!chatId)
        return res.status(400).send('The received message does not contain the chat id.');

    const request = await buildRequest(chatId, text);
    if(request)
        await handleRequest(request, res);

    res.sendStatus(200);
}

async function buildRequest(chatId: number, text: string) {
    let requestBuilder = rbCache.get(chatId);
    const trimmedText = text.trimStart();
    let command: Command | null = null;
    if(trimmedText.startsWith('/'))
        command = getCommand(trimmedText);
    if(requestBuilder) {
        if(command) {
            await requestBuilder.addCommand(command);
            return getRequest(requestBuilder);
        } else {
            await requestBuilder.addMessage(trimmedText);
            return getRequest(requestBuilder);    
        }
    } else if(command) {
        requestBuilder = RequestBuilderFactory.create(command, chatId);
        if(requestBuilder) {
            await requestBuilder.addMessage(trimmedText.substring(command.length + 1));
            const request = getRequest(requestBuilder);
            if(!request)
                rbCache.set(chatId, requestBuilder);
            return request;
        }    
    } else {
        return tryParseJSON(trimmedText);
    }
}

async function handleRequest(request: TelegramRequest, res: Response) {
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

function getRequest(requestBuilder: RequestBuilder): TelegramRequest | undefined {
    switch(requestBuilder.status) {
        case 'ready':
        case 'canceled':
        case 'terminated':
            rbCache.delete(requestBuilder.chatId);
            return requestBuilder.request;
    }
}

function getCommand(messageText: string): Command {
    const trimmedText = messageText.trimStart();
    let firstSpace = trimmedText.indexOf(' ');
    if(firstSpace === -1)
        firstSpace = trimmedText.length;
    const firstParam = trimmedText.substring(0, firstSpace);
    const atLocation = firstParam.lastIndexOf('@'); // Commands may end with the bot's name, see https://core.telegram.org/bots#commands
    const botName = atLocation !== -1 ? firstParam.substring(atLocation + 1) : null;
    const command = firstParam.substring(1, botName === TELEGRAM_BOT_USERNAME ? atLocation : firstParam.length) as Command;
    return command;
}

async function handleCallbackQuery(callback_query: TelegramCallbackQuery, res: Response) {
    console.log('Webhook callback_query received:' + JSON.stringify(callback_query));

    const chatId = callback_query?.message?.chat?.id;
    if(chatId) {
        const requestBuilder = rbCache.get(chatId);
        if(requestBuilder) {
            await requestBuilder.addQuery(callback_query);
            const request = getRequest(requestBuilder);
            if(request)
                await handleRequest(request, res);
        }   
    }

    res.send('OK');
}

// async function cleanup() {
//     console.log('Cleaning up...');
//     for(builder of rbCache.values())
//         await builder.terminate();
//     rbCache.clear();
//     console.log('Done.');
// }

// process.on('uncaughtExceptionMonitor', async (e) => {
//     console.error(`Process terminated due an uncaught exception...`);
//     if(e) {
//         console.error(e.toString());
//         console.error(e.stack);
//     }
//     await cleanup();
// });

// [`SIGINT`, `SIGTERM`, 'SIGHUP'].forEach((eventType) => {
//     process.on(eventType, async (e) => {
//         console.error(`Process terminated due to ${eventType} signal.`);
//         try {
//             await cleanup();
//         } finally {
//             process.exit();
//         }
//     });
// });