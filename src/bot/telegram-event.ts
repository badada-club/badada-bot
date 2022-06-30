import { BadadaEvent } from '../common/event';

export interface TelegramEvent {
    event: BadadaEvent,
    creatorChatId: number
}