import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface IMessage {
    _id?: ObjectId;
    choices?: string[];
    content: string;
    isUser: boolean;
    creationTime: Date;
}

export interface IChat {
    _id?: ObjectId;
    title: string;
    settings: ISettings;
    messages: IMessage[];
    creationTime: Date;
}

export interface IChatDto {
    _id?: ObjectId;
    title: string;
    settings: ISettings;
}

export interface ISettings {
    _id?: ObjectId;
    model: string;
    system: string;
    temperature: number;
    memory: number;
    devOptions: boolean;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
}

const SettingsSchema = new Schema<ISettings>({
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

export const MessageSchema = new Schema<IMessage>({
    choices: { type: [String] },
    content: { type: String, required: true },
    isUser: { type: Boolean, required: true },
    creationTime: { type: Date, required: true, default: Date.now },
});

export const ChatSchema = new Schema<IChat>({
    title: { type: String },
    settings: { type: SettingsSchema, required: true },
    messages: { type: [MessageSchema], required: true, default: [] },
    creationTime: { type: Date, required: true, default: Date.now },
});
