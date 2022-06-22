import { RequestHandler } from './request-handler';

export interface Question<THandler extends RequestHandler> {
    question: string,
    apply: (builder: THandler, answer: string) => Promise<boolean>
}