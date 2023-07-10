import { Schema } from "mongoose";
import { Message, MessageSchema } from "./message";

export interface Chat {
    chatId: string;
    title: string;
    settings: Settings;
    messages: { [messageId: string]: Message };
}

export interface LiteChatDto {
    chatId: string;
    title: string;
}

export interface ChatDto {
    chatId: string;
    title: string;
    settings: Settings;
}

export interface Settings {
    model: string;
    system: string;
    temperature: number;
    memory: number;
    devOptions: boolean;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
}

const SettingsSchema = new Schema<Settings>({
    model: { type: String, required: true, default: 'gpt-3.5-turbo' },
    system: { type: String, required: true, default: 'You are a helpful assistant' },
    temperature: { type: Number, required: true, default: 0.7 },
    memory: { type: Number, required: true, default: 10 },
    devOptions: { type: Boolean, required: true, default: false },
    stream: { type: Boolean },
    top_p: { type: Number },
    n: { type: Number },
    stop: { type: [String] },
    max_tokens: { type: Number },
    presence_penalty: { type: Number },
    frequency_penalty: { type: Number },
    logit_bias: { type: Map, of: Number },
    user: { type: String },
});

export const ChatSchema = new Schema<Chat>({
    chatId: { type: String, required: true },
    title: { type: String, required: true },
    settings: { type: SettingsSchema },
    messages: { type: Map, of: MessageSchema },
});
