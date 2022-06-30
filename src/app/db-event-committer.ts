import { EventCommitter } from '../bot/event-committer/event-committer';
import { TelegramEvent } from '../bot/telegram-event';
import { PrismaClient as DB } from '../db/prisma/badada/generated';

const db = new DB({
    log: ['query'],
});

export class DataBaseEventCommitter implements EventCommitter {
    async commit(event: TelegramEvent): Promise<void> {
        await db.event.create({
            data: {
                date: event.event.date,
                cost: event.event.cost,
                telegramEvent: {
                    create: {
                        creatorChatId: event.creatorChatId
                    }
                }
            }
        });
    }
}