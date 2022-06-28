import { Prisma } from '@prisma/client';
import { BadadaEvent } from '../event';
import { EventCommitter } from '../event-committer';
import { PrismaClient as BadadaDB } from './prisma/badada/generated';

const badadaDB = new BadadaDB({
    log: [
        {
            emit: 'event',
            level: 'query',
        }
    ],
});
  
badadaDB.$on('query', (e: Prisma.QueryEvent) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
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
