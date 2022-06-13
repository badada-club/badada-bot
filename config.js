import 'dotenv/config'

export const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN
export const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME
export const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME

export const TELEGRAM_URI = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`
export const WEBHOOK_ACTION = `telegram-webhook-message-${TELEGRAM_API_TOKEN}`
export const APP_URI = `https://${HEROKU_APP_NAME}.herokuapp.com`