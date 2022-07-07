import axios from 'axios';
import { BotCommand, Message, Method as TelegramMethod } from './telegram-types';

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

export async function setMyCommands(token: string, commands: BotCommand[]): Promise<void> {
    await sendRequest(token, 'setMyCommands', { commands });
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
export function getCommand(messageText: string): { command: string, botName: string, commandArg: string } | undefined {
    const regExp = /^\/(?<command>[a-zA-Z0-9_]+)(?:@(?<bot>[a-zA-Z0-9_]+))?(?:\s+(?<commandArg>.*))?$/g;
    const match = regExp.exec(messageText);
    if(!match)
        return undefined;
    return {
        command: match[1],
        botName: match[2],
        commandArg: match[3]
    };
}

export const TELEGRAM_URI = 'https://api.telegram.org';
export function getTelegramApiUri(token: string): string {
    return `${TELEGRAM_URI}/bot${token}`;
}
export function getWebHookAction(token: string): string {
    return `telegram-webhook-message-${token}`;
}