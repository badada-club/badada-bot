import { TelegramEvent } from '../telegram-event';

export interface EventCommitter {
    commit(event: TelegramEvent): Promise<void>;
}
export class EventCommitterChain implements EventCommitter {
    private _committers: EventCommitter[];
    constructor(...committers: EventCommitter[]) {
        this._committers = committers;
    }
    async commit(event: TelegramEvent): Promise<void> {
        for(const committer of this._committers){
            await committer.commit(event);
        }
    }
}
