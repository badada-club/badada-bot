import cors from 'cors';
import { Express, Request, Response } from 'express';
import { CRON_ORIGIN } from '../config';
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
        app.put('/cron', cors({ origin: CRON_ORIGIN }), async (req: Request, res: Response) => {
            this._active && this._action && await this._action();
            res.sendStatus(200);
        });
    }
}