import { Express, Request, Response } from 'express';
import { HEROKU_APP_NAME } from '../config';
import { getAppUri } from '../heroku-utils';
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
        app.put(`${getAppUri(HEROKU_APP_NAME)}/cron`, async (req: Request, res: Response) => {
            this._active && this._action && await this._action();
        });
    }
}