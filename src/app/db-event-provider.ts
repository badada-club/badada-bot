import { BadadaEvent } from '../common/event';
import { Event as DBEvent, PrismaClient as DB } from '../db/prisma/badada/generated';

const db = new DB({
    log: [{
        emit: 'event',
        level: 'query',
    }],
});

db.$on('query', (e) => {
    console.log(`
executed query: ${e.query}
with parameters: ${e.params}
    `);
});

export async function get(fromUtc: Date, toUtc?: Date): Promise<BadadaEvent[]> {
    let dbEvents: DBEvent[];
    if(toUtc)
        dbEvents = await db.event.findMany({
            where: {
                AND: [
                    { date: { gte: fromUtc } },
                    { date: { lt: toUtc } },
                ]
            }
        });
    else
        dbEvents = await db.event.findMany({
            where:  { date: { gte: fromUtc } }
        });
    return dbEvents.map(dbEvent => {
        return {
            date: dbEvent.date,
            cost: dbEvent.cost ?? undefined
        };
    });
}