import { BadadaEvent } from '../event';
import { EventCommitter } from '../event-committer';
import { PrismaClient as BadadaDB } from './prisma/badada/generated';

const badadaDB = new BadadaDB({
    log: ['query'],
});

export class DataBaseEventCommitter implements EventCommitter {
    async commit(event: BadadaEvent): Promise<void> {
        await badadaDB.event.create({
            data: {
                creator_chat_id: event.creator_chat_id,
                date: event.date,
                cost: event.cost,
            }
        });
    }
}
