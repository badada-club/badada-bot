import { sendMessage } from "../telegram.js";
import { Guard } from "../utils.js";
import { RequestBuilder } from "./request-builder.js";

export class EventRequestBuilder extends RequestBuilder {
    _questions = [
        {
            question: 'Укажи дату в формате YYYY-MM-DD, пожалуйста.',
            apply: async (builder, answer) => {
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
            apply: async (builder, answer) => {
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

    _date;
    _cost;
    _currentIndex = -1;

    constructor(chatId) {
        super(chatId);
    }
    async addMessage(message) {
        if(this._status === 'down') {
            this._status = 'up';
            this._currentIndex = 0;    
        }
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
                        date: this._date,
                        cost: this._cost
                    }
                }
            }
        }

    }
    async addCommand(command) {
        switch(command) {
            case 'cancel':
                this._status = 'canceled';
        }
    }
    // async terminate() {
    //     await sendMessage('Извини, друг, сервер отключился... Начни заново, пожалуйста.');
    // }
}