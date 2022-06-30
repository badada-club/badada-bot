import { BadadaEvent } from './event';

export type EventProvider = (from: Date, to?: Date) => Promise<BadadaEvent[]>