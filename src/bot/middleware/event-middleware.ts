import { BadadaEvent, BadadaEventSeed } from '../../common/event';
import { EVENTS_INPUT_TIMEZONE } from '../../config';
import { Update } from '../../telegram/telegram-types';
import { addDays, getNow, tryParseIsoDate } from '../../utils';
import { commands } from '../commands';
import { EventCommitter } from '../event-committer/event-committer';
import { Context, Pipeline } from '../pipeline';
import { Question, Questionnaire } from './questionnaire';

export function createEventMiddleware(committer: EventCommitter): Questionnaire<BadadaEventSeed> {
    return new Questionnaire<BadadaEventSeed>(
        commands.new_event.command,
        [
            new Question<BadadaEventSeed>(
                'Укажи дату в формате YYYY-MM-DD (по московскому времени).',
                Pipeline.create(
                    {
                        filter: (update: Update, ctx: Context) => !tryParseIsoDate(update.message?.text as string, EVENTS_INPUT_TIMEZONE),
                        handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на дату.'); return true; }
                    },
                    {
                        filter: (update: Update, ctx: Context) => {
                            const date = tryParseIsoDate(update.message?.text as string, EVENTS_INPUT_TIMEZONE) as Date;
                            return addDays(date, 1).valueOf() < getNow().valueOf();
                        },
                        handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Эта дата уже в прошлом.'); return true; }
                    },
        
                ),
                (update: Update, ctx: Context, event: BadadaEventSeed): void => {
                    event.date = tryParseIsoDate(update.message?.text as string, EVENTS_INPUT_TIMEZONE) as Date;
                }
            ),
            new Question<BadadaEventSeed>(
                'Укажи стоимость.',
                Pipeline.create(
                    {
                        filter: (update: Update, ctx: Context) => Number.isNaN(parseInt(update.message?.text as string)),
                        handle: async (update: Update, ctx: Context) => { await ctx.telegram.sendMessage('Это не похоже на число.'); return true; }
                    },
                ),
                (update: Update, ctx: Context, event: BadadaEventSeed): void => {
                    event.cost = parseInt(update.message?.text as string);
                }
            )
        ],
        (ctx: Context, answer: BadadaEventSeed) => committer.commit({
            event: answer as BadadaEvent,
            creatorChatId: ctx.chatId,
        })
    );
}