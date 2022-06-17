export type Method = 'sendMessage'
export interface Message {
    message_id: number,
    chat: Chat,
    via_bot: any,
    text: string
}
export interface Chat {
    id: number
}
export interface CallbackQuery {
    message: Message
}