import { BadadaEvent } from '../common/event';
import { Event as DBEvent, PrismaClient as DB } from '../db/prisma/badada/generated';

const db = new DB({
    log: [{
        emit: 'event',
        level: 'query',
    }],
});

db.$on('query', async (e) => {
    console.log(`
executed query: ${e.query}
with parameters: ${e.params}
    `);
});

export async function get(from: Date, to?: Date): Promise<BadadaEvent[]> {
    let dbEvents: DBEvent[];
    if(to)
        dbEvents = await db.event.findMany({
            where: {
                AND: [
                    { date: { gte: from } },
                    { date: { lte: to } },
                ]
            }
        });
    else
        dbEvents = await db.event.findMany({
            where:  { date: { gte: from } }
        });
    return dbEvents.map(dbEvent => {
        return {
            date: dbEvent.date,
            cost: dbEvent.cost ?? undefined
        };
    });
}