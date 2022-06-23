import 'dotenv/config';

export const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;
export const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;
export const APP_NAME = process.env.APP_NAME;
const ENV_EVENTS_CHANNEL_ID = process.env.EVENTS_CHANNEL_ID;
export const EVENTS_CHANNEL_ID = ENV_EVENTS_CHANNEL_ID ? parseInt(ENV_EVENTS_CHANNEL_ID) : undefined;

export const TELEGRAM_URI = 'https://api.telegram.org';
export const TELEGRAM_API_URI = `${TELEGRAM_URI}/bot${TELEGRAM_API_TOKEN}`;
export const WEBHOOK_ACTION = `telegram-webhook-message-${TELEGRAM_API_TOKEN}`;
export const APP_URI = `https://${APP_NAME}.herokuapp.com`;