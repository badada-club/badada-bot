import axios from 'axios';
import { BADADA_EVENTS_CHANNEL_ID, TELEGRAM_API_TOKEN, TELEGRAM_BOT_USERNAME } from '../config';
import { BadadaEvent } from '../event';
import { EventCommitter } from '../event-committer';
import { Message, Method as TelegramMethod } from './telegram-types';

export class Telegram {
    private readonly _token: string;
    private readonly _chatId: number;

    constructor(token: string, chatId: number) {
        this._token = token;
        this._chatId = chatId;
    }
    async sendMessage(message: string): Promise<void> {
        await sendMessage(this._token, this._chatId, message);
    }
}

export async function sendMessage(token: string, chatId: number, message: string): Promise<void> {
    console.log('Sending message...');
    console.log('  chatId: ' + chatId);
    console.log('  message: ' + message);
    if(message) // Telegram does no accept empty messages
        await sendRequest(token, 'sendMessage', {
            chat_id: chatId,
            text: message
        });
}
async function sendReplyKeyboardMessage(token: string, chatId: number, message: string, replyButtons: any[]): Promise<void> {
    if(message) // Telegram does no accept empty messages
        await sendRequest(token, 'sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                keyboard: [replyButtons],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
}
async function sendInlineKeyboardMessage(token: string, chatId: number, message: string, inlineButtons: any[]): Promise<void> {
    if(message) // Telegram does no accept empty messages
        await sendRequest(token, 'sendMessage', {
            chat_id: chatId,
            text: message,
            reply_markup: {
                inline_keyboard : [inlineButtons]
            }
        });
}
async function sendRequest(token: string, method: TelegramMethod, params: any): Promise<void> {
    const url = `${getTelegramApiUri(token)}/${method}`;
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

export const TELEGRAM_URI = 'https://api.telegram.org';
export function getTelegramApiUri(token: string): string {
    return `${TELEGRAM_URI}/bot${token}`;
}
export function getWebHookAction(token: string): string {
    return `telegram-webhook-message-${token}`;
}

export class MessageToChannelEventCommitter implements EventCommitter {
    async commit(event: BadadaEvent): Promise<void> {
        await sendMessage(TELEGRAM_API_TOKEN, BADADA_EVENTS_CHANNEL_ID, JSON.stringify(event));
    }
}
