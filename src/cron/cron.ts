export abstract class Cron {
    _action: () => Promise<void>;
    on(event: 'tick', action: () => Promise<void>): void {
        this._action = action;
    }
    abstract start(): void;
    abstract stop(): void;
}