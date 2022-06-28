export interface BadadaEventSeed {
    creator_chat_id: number;
    date?: Date;
    cost?: number;
}
export interface BadadaEvent extends BadadaEventSeed {
    date: Date;
    cost: number;
}