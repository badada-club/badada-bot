import { sendMessage } from "../telegram-methods.js";
import { Command, Guard } from "../utils.js";
import { RequestBuilder } from "./request-builder.js";

export class EventRequestBuilder extends RequestBuilder {
    _questions: Question[] = [
        {
            question: 'Укажи дату в формате YYYY-MM-DD, пожалуйста.',
            apply: async (builder: EventRequestBuilder, answer: string) => {
                const ms = Date.parse(answer);
                if(!ms) {
                    await sendMessage(this.chatId, 'Это не похоже на дату. Пожалуйста, укажи дату в формате YYYY-MM-DD.');
                    return false;
                } else {
                    builder._date = new Date(ms);
                    return true;
                }
            }
        },
        {
            question: 'Укажи стоимость.',
            apply: async (builder: EventRequestBuilder, answer: string) => {
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

    _date: Date;
    _cost: number;
    _currentIndex = -1;

    constructor(chatId: number) {
        super(chatId);
    }
    override async addMessage(message: string) {
        if(this._status === 'down') {
            this._status = 'up';
            this._currentIndex = 0;
            sendMessage(this._chatId, this._questions[this._currentIndex].question);
        } else {
            Guard.requires(this._status === 'up');
            Guard.requires(this._currentIndex < this._questions.length);
            if(await this._questions[this._currentIndex].apply(this, message)) {
                this._currentIndex++;
                if(this._currentIndex >= this._questions.length) {
                    this._status = 'ready';
                    this._request = {
                        resource: 'events',
                        method: 'post',
                        data: {
                            chatId: this._chatId,
                            date: this._date,
                            cost: this._cost
                        }
                    }
                } else {
                    sendMessage(this._chatId, this._questions[this._currentIndex].question);
                }
            }    
        }
    }
    override async addCommand(command: Command) {
        switch(command) {
            case 'cancel':
                this._status = 'canceled';
        }
    }
    // async terminate() {
    //     await sendMessage('Извини, друг, сервер отключился... Начни заново, пожалуйста.');
    // }
}

export interface Question {
    question: string,
    apply: (builder: EventRequestBuilder, answer: string) => Promise<boolean>
}