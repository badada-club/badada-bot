'use strict'

import axios from 'axios'
import { TELEGRAM_URI } from './config.js'

export async function sendMessage(chatId, message) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message
        });
}
export async function sendReplyKeyboardMessage(chatId, message, replyButtons) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                keyboard: [replyButtons],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
}
export async function sendInlineKeyboardMessage(chatId, message, inlineButtons) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                inline_keyboard : [inlineButtons]
            }
        });
}
export async function sendRequest(method, params) {
    let url = `${TELEGRAM_URI}/${method}`;
    await axios.post(url, params);
}
