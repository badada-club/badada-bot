import axios from 'axios';
import { APP_URI, TELEGRAM_API_URI, WEBHOOK_ACTION } from './config.js';

async function run() {
    const setWebhookResponse = await axios.post(`${TELEGRAM_API_URI}/setWebhook`, {
        url: `${APP_URI}/${WEBHOOK_ACTION}`
    });
    process.exitCode = setWebhookResponse.status == 200 ? 0 : 1;
}

run();
