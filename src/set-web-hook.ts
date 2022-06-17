import axios from 'axios'
import { TELEGRAM_API_URI, WEBHOOK_ACTION, APP_URI } from './config.js'

async function run() {
    let setWebhookResponse = await axios.post(`${TELEGRAM_API_URI}/setWebhook`, {
        url: `${APP_URI}/${WEBHOOK_ACTION}`
    });
    process.exitCode = setWebhookResponse.status == 200 ? 0 : 1
}

run();
