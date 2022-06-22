import express, { Express, NextFunction, Request, Response } from 'express';
import { TELEGRAM_URI, WEBHOOK_ACTION } from './config';
import { RequestHandler } from './request-handlers/request-handler';
import { RequestHandlerFactory } from './request-handlers/request-handler-factory';
import { CallbackQuery as TelegramCallbackQuery, Message as TelegramMessage } from './telegram-types';
import { Command, getChatId, getCommand, sendMessage } from './telegram-utils';
import { Guard } from './utils';

export const app: Express = express();

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
        res.status(200 /*400*/).send('400: The request does not contain entities the bot is able to handle.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Exception thrown while handling the request...');
    if(err) {
        console.error(err.toString());
        console.error(err.stack);    
    }
    res.status(200 /*500*/).send('500: Exception thrown while handling the request.');
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(200 /*404*/).send('404: Unknown route.');
});

const requestHandlerCache = new Map<number, RequestHandler>();

async function handleMessage(message: TelegramMessage, res: Response) {
    Guard.requires(!!message);
    console.log('handleMessage: ' + JSON.stringify(message));

    if(message.via_bot)
        return res.sendStatus(200);
    const chatId = getChatId(message);
    if(!chatId)
        return res.status(200 /*400*/).send('400: The received message does not contain the chat id.');
    const text = message.text;
    if(!text)
        return res.status(200 /*400*/).send('400: The text of the received message is empty.');
    const trimmedText = text.trimStart();
    let command: Command | undefined = undefined;
    let commandArg: string | undefined = undefined;
    if(trimmedText.startsWith('/')) {
        command = getCommand(trimmedText);
        if(command)
            commandArg = trimmedText.substring(command.length + 1);
    }
    const handler = requestHandlerCache.get(chatId);
    if(handler) {
        let additionResult = false;
        if(command)
            additionResult = await handler.addCommand(command, commandArg);
        else
            additionResult = await handler.addMessage(text);
        if(additionResult)
            requestHandlerCache.delete(chatId);
    } else {
        if(command) {
            const newHandler = RequestHandlerFactory.create(command, chatId);
            if(newHandler) {
                if(!(await newHandler.start(commandArg)))
                    requestHandlerCache.set(chatId, newHandler);
            }   
        } else {
            await sendMessage(chatId, 'Введи какую-нибудь команду, пожалуйста.');
        }
    }
    return res.sendStatus(200);
}

async function handleCallbackQuery(callback_query: TelegramCallbackQuery, res: Response) {
    console.log('Webhook callback_query received: ' + JSON.stringify(callback_query));

    const chatId = callback_query?.message?.chat?.id;
    if(chatId) {
        const requestHandler = requestHandlerCache.get(chatId);
        if(requestHandler) {
            if(await requestHandler.addQuery(callback_query))
                requestHandlerCache.delete(chatId);
        }   
    }

    return res.sendStatus(200);
}

// async function cleanup() {
//     console.log('Cleaning up...');
//     for(const handler of requestHandlerCache.values())
//         await handler.terminate();
//     requestHandlerCache.clear();
//     await new Promise<void>((resolve, reject) => {
//         if(server.listening)
//             server.close((err) => err ? reject() : resolve());
//     });
//     console.log('Done.');
// }

// process.on('uncaughtExceptionMonitor', async (e) => {
//     console.error('Process terminated due an uncaught exception...');
//     if(e) {
//         console.error(e.toString());
//         console.error(e.stack);
//     }
//     await cleanup();
// });

// ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((eventType) => {
//     process.on(eventType, async (e) => {
//         console.error(`Process terminated due to ${eventType} signal.`);
//         try {
//             await cleanup();
//         } finally {
//             process.exit();
//         }
//     });
// });