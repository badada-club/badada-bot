import axios from 'axios';
import { TELEGRAM_API_URI, TELEGRAM_BOT_USERNAME } from './config';
import { Message, Method as TelegramMethod } from './telegram-types';

export async function sendMessage(chatId: number, message: string) {
    console.log('Sending message...');
    console.log('  chatId: ' + chatId);
    console.log('  message: ' + message);
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
    const url = `${TELEGRAM_API_URI}/${method}`;
    console.log('Sending request...');
    console.log('  method: ' + method);
    console.log('  with params: ' + JSON.stringify(params));
    await axios.post(url, params);
}

export function getChatId(message: Message): number {
    return message?.chat?.id;
}
export const commands = {
    start: 'start',
    echo: 'echo',
    new_event: 'new_event',
    cancel: 'cancel'
};
export type Command = keyof typeof commands;
export function getCommand(messageText: string): Command | undefined {
    const trimmedText = messageText.trimStart();
    let firstSpace = trimmedText.indexOf(' ');
    if(firstSpace === -1)
        firstSpace = trimmedText.length;
    const firstParam = trimmedText.substring(0, firstSpace);
    const atLocation = firstParam.lastIndexOf('@'); // Commands may end with the bot's name, see https://core.telegram.org/bots#commands
    const botName = atLocation !== -1 ? firstParam.substring(atLocation + 1) : null;
    const command = firstParam.substring(1, botName === TELEGRAM_BOT_USERNAME ? atLocation : firstParam.length);
    if(Object.values(commands).some(c => c === command))
        return command as Command;
    else
        return undefined;
}