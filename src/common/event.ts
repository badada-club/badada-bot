export interface BadadaEventSeed {
    date?: Date;
    cost?: number;
}
export interface BadadaEvent extends BadadaEventSeed {
    date: Date;
}