import axios from 'axios';
import { APP_URI, TELEGRAM_API_URI, WEBHOOK_ACTION } from './config';

export async function setWebHook(): Promise<boolean> {
    const setWebhookResponse = await axios.post(`${TELEGRAM_API_URI}/setWebhook`, {
        url: `${APP_URI}/${WEBHOOK_ACTION}`
    });
    return setWebhookResponse.status == 200;
}