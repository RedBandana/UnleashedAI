import { Schema } from "mongoose";

export interface Message {
    messageId: string;
    choices: Choice[];
    isUser: boolean;
    creationTime: Date;
}

export interface LiteMessageDto {
    messageId: string;
    choices: string[];
    isUser: boolean;
    creationTime: Date;
}

export interface Choice {
    index: number;
    isDisplayed: boolean;
    content: string;
}

const ChoiceSchema = new Schema<Choice>({
    index: { type: Number, required: true },
    isDisplayed: { type: Boolean, required: true },
    content: { type: String, required: true },
})

export const MessageSchema = new Schema<Message>({
    messageId: { type: String, required: true },
    choices: [{ type: [ChoiceSchema], required: true }],
    isUser: { type: Boolean, required: true },
    creationTime: { type: Date, required: true },
});
