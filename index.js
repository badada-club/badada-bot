'use strict'

import express from 'express'
import { TELEGRAM_BOT_USERNAME, WEBHOOK_ACTION } from './config.js'
import { Guard, tryParseJSON } from './utils.js'
import { RequestBuilderFactory } from './request-builders/request-builder-factory.js'
import { RequestHandlerFactory } from './request-handlers/request-handler-factory.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.post(`/${WEBHOOK_ACTION}`, async (req, res) => {
    const { message, callback_query } = req.body;
    if(message)
        await handleMessage(message, res);
    else if(callback_query)
        await handleCallbackQuery(callback_query, res);
    else
        res.sendStatus(400);
});

app.use((err, req, res, next) => {
    console.error(err.toString());
    console.error(err.stack);
    res.status(500);
});
app.use((req, res, next) => {
    res.sendStatus(404);
}); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
});

let rbCache = new Map();

async function handleMessage(message, res) {
    Guard.requires(!!message);
    console.log('handleMessage: ' + JSON.stringify(message));

    const messageId = message.message_id ?? message.reply_to_message?.message_id;
    if(!messageId)
        res.sendStatus(400);

    const text = message.text;
    if(!text)
        res.status(400).send('The text of the received message is empty.');

    const chat = message.chat;
    if(!chat)
        res.status(400).send('The received message does not contain the chat info.');

    const chatId = chat.id;
    if(!chatId)
        res.status(400).send('The chat info of the received message does not contain the chat id.');

    let request;
    let requestBuilder = rbCache.get(messageId);
    const trimmedText = text.trimStart();
    if(trimmedText.startsWith('/')) {
        const command = getCommand(trimmedText);
        if(command) {
            if(requestBuilder) {
                await requestBuilder.addCommand(command);
                request = getRequest(requestBuilder);
            } else {
                requestBuilder = RequestBuilderFactory.get(command, messageId, chatId);
                if(requestBuilder) {
                    await requestBuilder.start(trimmedText.substring(command.length + 1));
                    request = getRequest(requestBuilder);
                    if(!request)
                        rbCache.set(messageId, requestBuilder);
                }    
            }
        }
    } else if(message.reply_to_message) {
        if(requestBuilder) {
            requestBuilder.addMessage(trimmedText);
            request = getRequest(requestBuilder);
        }
    } else {
        request = tryParseJSON(trimmedText);
    }

    if(request)
        await handleRequest(request);

    res.sendStatus(200);
}

function getRequest(requestBuilder) {
    if(requestBuilder.status === 'ready') {
        rbCache.delete(requestBuilder.messageId);
        return requestBuilder.request;
    }
}

function getCommand(messageText) {
    const trimmedText = messageText.trimStart();
    let firstSpace = trimmedText.indexOf(' ');
    if(firstSpace === -1)
        firstSpace = trimmedText.length;
    const firstParam = trimmedText.substring(0, firstSpace);
    const atLocation = firstParam.lastIndexOf('@'); // Commands may end with the bot's name, see https://core.telegram.org/bots#commands
    const botName = atLocation !== -1 ? firstParam.substring(atLocation + 1) : null;
    const command = firstParam.substring(1, botName === TELEGRAM_BOT_USERNAME ? atLocation : firstParam.length);
    return command;
}

async function handleRequest(request, res) {
    if(request && request.resource && request.method) {
        const handler = RequestHandlerFactory.get(request.resource);
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
                res.sendStatus(400);
        }
    }
}

async function handleCallbackQuery(callback_query, res) {
    console.log('Webhook callback_query received:' + JSON.stringify(callback_query));
    console.log(callback_query.data);

    const messageId = callback_query?.message?.message_id ?? callback_query.inline_message_id;
    requestBuilder = rbCache.get(messageId);

    if(requestBuilder) {
        const rbState = await requestBuilder.addQuery(callback_query);
        if(rbState === 'ready') {
            rbCache.delete(messageId);
            await handleRequest(requestBuilder.request);
        }
    }

    res.send('OK');
}
