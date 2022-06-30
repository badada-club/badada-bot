import { BADADA_EVENTS_CHANNEL_ID, TELEGRAM_API_TOKEN } from '../../config';
import { sendMessage } from '../../telegram/telegram-utils';
import { TelegramEvent } from '../telegram-event';
import { EventCommitter } from './event-committer';

export class MessageToChannelEventCommitter implements EventCommitter {
    async commit(event: TelegramEvent): Promise<void> {
        await sendMessage(TELEGRAM_API_TOKEN, BADADA_EVENTS_CHANNEL_ID, JSON.stringify(event));
    }
}