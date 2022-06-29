import 'dotenv/config';

export const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN as string;
export const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME as string;
export const BADADA_EVENTS_CHANNEL_ID = parseInt(process.env.BADADA_EVENTS_CHANNEL_ID as string);
export const BADADA_CLUB_CHAT_ID = parseInt(process.env.BADADA_CLUB_CHAT_ID as string);

export const HEROKU_APP_NAME = process.env.APP_NAME as string;