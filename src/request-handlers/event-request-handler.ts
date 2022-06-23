import { EVENTS_CHANNEL_ID } from '../config';
import { Command, commands, sendMessage } from '../telegram-utils';
import { Guard } from '../utils';
import { Question } from './interview-request-handler';
import { RequestHandler } from './request-handler';

export class EventRequestHandler extends RequestHandler {
    private _questions: Question<EventRequestHandler>[] = [
        {
            question: 'Укажи дату в формате YYYY-MM-DD (по московскому времени), пожалуйста.',
            apply: async (builder: EventRequestHandler, answer: string) => {
                // TODO: People will enter MSK dates, but Date.parse threats them as 'local time'.
                // What 'local time' is depends on the time zone settings of a machine the app runs at.
                // That's why we must parse the date ourselves (or enter it in some other way).
                const milliseconds = Date.parse(answer);
                if(Number.isNaN(milliseconds)) {
                    await sendMessage(this.chatId, 'Это не похоже на дату. Пожалуйста, укажи дату в формате YYYY-MM-DD.');
                    return false;
                } else if(milliseconds < Date.now()) {
                    await sendMessage(this.chatId, 'Эта дата уже в прошлом. Пожалуйста, введи будущую дату.');
                    return false;
                }
                builder._date = new Date(milliseconds);
                return true;
            }
        },
        {
            question: 'Укажи стоимость.',
            apply: async (builder: EventRequestHandler, answer: string) => {
                const cost = parseInt(answer);
                if(Number.isNaN(cost)) {
                    await sendMessage(this.chatId, 'Это не похоже на число. Пожалуйста, укажи корректную стоимость.');
                    return false;
                } else {
                    builder._cost = cost;
                    return true;
                }
            }
        }
    ];

    private _date: Date;
    private _cost: number;
    private _currentIndex = 0;

    constructor(chatId: number) {
        super(chatId);
    }

    override async start(arg?: string): Promise<boolean> {
        this._currentIndex = 0;
        this._ask(0);
        return this._currentIndex >= this._questions.length;
    }
    override async addCommand(command: Command): Promise<boolean> {
        switch(command) {
            case commands.cancel:
                this._currentIndex = this._questions.length;
                return true;
        }
        return false;
    }
    override async addMessage(message: string): Promise<boolean> {
        if(this._currentIndex >= this._questions.length)
            return true;
        if(await this._questions[this._currentIndex].apply(this, message)) {
            if(this._currentIndex >= this._questions.length - 1) {
                await this._apply();
                this._currentIndex++;
                return true;
            } else {
                await this._ask(this._currentIndex + 1);
                this._currentIndex++;
                return false;
            }
        } else {
            return false;
        }
    }

    private async _ask(questionId: number) {
        Guard.requires(questionId >= 0 && questionId < this._questions.length);
        await sendMessage(this._chatId, this._questions[questionId].question);
    }
    private async _apply() {
        console.log('Applying new event...');
        await sendMessage(EVENTS_CHANNEL_ID as number, JSON.stringify({
            date: this._date,
            cost: this._cost
        }));
    }
    // async terminate() {
    //     await sendMessage('Извини, друг, сервер отключился... Начни заново, пожалуйста.');
    // }
}
