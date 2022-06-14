import express from 'express'
import axios from 'axios'

import { TELEGRAM_URI, TELEGRAM_BOT_USERNAME, WEBHOOK_ACTION } from './config.js'
const PORT = process.env.PORT || 3000

async function sendMessage(chatId, message) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message
        });
}
async function sendReplyKeyboardMessage(chatId, message, replyButtonTexts) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                keyboard: [(replyButtonTexts || [])],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
}
async function sendInlineKeyboardMessage(chatId, message, inlineButtons) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                inline_keyboard : [inlineButtons]
            }
        });
}

async function sendRequest(method, params) {
    let url = `${TELEGRAM_URI}/${method}`;
    await axios.post(url, params);
}

const app = express()

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)

app.post(`/${WEBHOOK_ACTION}`, async (req, res) => {
    const { message } = req.body;

    console.log('Webhook message received:' + JSON.stringify(message));

    if(!message)
        return res.send('Failure');

    const text = message.text;
    if(!text)
        return res.send('Failure');

    const chat = message.chat;
    if(!chat)
        return res.send('Failure');

    const chatId = chat.id;
    if(!chatId)
        return res.send('Failure');

    const params = text.split(' ');

    if(!params[0])
        return;

    if(params[0].startsWith('/')) {
        const atLocation = params[0].lastIndexOf('@'); // Commands may end with the bot's name, see https://core.telegram.org/bots#commands
        const botName = atLocation !== -1 ? params[0].substring(atLocation + 1) : null;
        const command = params[0].substring(1, botName === TELEGRAM_BOT_USERNAME ? atLocation : params[0].length);
        switch(command) {
            case 'start':
                await sendMessage(chatId, 'Hey dude!');
                break;
            case 'echo':
                await sendMessage(chatId, text.substring(params[0].length + 1));
                break;
            case 'agree':
                await sendReplyKeyboardMessage(chatId, 'Do you agree?', ['yes', 'no']);
                break;
            case 'inline':
                await sendInlineKeyboardMessage(chatId, 'Select inline commands', [
                    {
                        text: 'Open Google',
                        url: 'http://www.google.com/'
                    },
                    {
                        text: 'Send callback',
                        callback_data: "Callback data"
                    }
                ]);
                break;
        }
    }

    res.send('Done');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})