import 'dotenv/config';

export const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN as string;
export const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME as string;
export const HEROKU_APP_NAME = process.env.APP_NAME as string;
export const EVENTS_CHANNEL_ID = parseInt(process.env.EVENTS_CHANNEL_ID as string);
