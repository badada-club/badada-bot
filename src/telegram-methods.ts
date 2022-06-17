import axios from 'axios'
import { TELEGRAM_API_URI } from './config.js'
import { Method as TelegramMethod } from './telegram-types.js';

export async function sendMessage(chatId: number, message: string) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message
        });
}
export async function sendReplyKeyboardMessage(chatId: number, message: string, replyButtons: any[]) {
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
export async function sendInlineKeyboardMessage(chatId: number, message: string, inlineButtons: any[]) {
    if(message) // Telegram does no accept empty messages
        await sendRequest('sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                inline_keyboard : [inlineButtons]
            }
        });
}
export async function sendRequest(method: TelegramMethod, params: any) {
    let url = `${TELEGRAM_API_URI}/${method}`;
    await axios.post(url, params);
}
