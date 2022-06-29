import { Cron } from './cron';

export class NodeCron extends Cron {
    private _interval: NodeJS.Timer;

    override start(): void {
        this._interval = setInterval(() => this._action && this._action(), 10000);
    }
    override stop(): void {
        clearInterval(this._interval);
    }
}