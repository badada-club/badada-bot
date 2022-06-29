import { Express, Request, Response } from 'express';
import { Cron } from './cron';

export class CronJobCron extends Cron {
    private _active = false;

    start(): void {
        this._active = true;
    }
    stop(): void {
        this._active = false;
    }

    setupExpress(app: Express): void {
        app.put('/cron', async (req: Request, res: Response) => {
            this._active && this._action && await this._action();
        });
    }
}