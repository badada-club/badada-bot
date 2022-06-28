import { BadadaEvent } from './event';

export interface EventCommitter {
    commit(event: BadadaEvent): Promise<void>;
}
export class EventCommitterChain implements EventCommitter {
    private _committers: EventCommitter[];
    constructor(...committers: EventCommitter[]) {
        this._committers = committers;
    }
    async commit(event: BadadaEvent): Promise<void> {
        for(const committer of this._committers){
            await committer.commit(event);
        }
    }
}