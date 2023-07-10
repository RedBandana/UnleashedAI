import { Schema } from "mongoose";

export interface Settings {
    settingsId: string;
    model: string;
    system: string;
    temperature: number;
    memory: number;
    top_p: number;
    n: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
    devOptions: boolean;
}

const SettingsSchema = new Schema<Settings>({
    settingsId: { type: String, required: true },
    model: { type: String, required: true },
    system: { type: String, required: true },
    temperature: { type: Number, required: true },
    top_p: { type: Number, required: true },
    n: { type: Number, required: true },
    stream: { type: Boolean, required: true },
    stop: { type: [String] },
    max_tokens: { type: Number },
    presence_penalty: { type: Number },
    frequency_penalty: { type: Number },
    logit_bias: { type: Map, of: Number },
    user: { type: String },
    devOptions: { type: Boolean, required: true },
});


export interface Text {
    textId: string;
    isDisplayed: boolean;
    value: string;
}

const TextSchema = new Schema<Text>({
    textId: { type: String, required: true },
    isDisplayed: { type: Boolean, required: true },
    value: { type: String, required: true },
})

export interface Message {
    messageId: string;
    texts: Text[];
    isUser: boolean;
    timestamp: Date;
}

export const MessageSchema = new Schema<Message>({
    messageId: { type: String, required: true },
    texts: [{ type: [TextSchema], required: true }],
    isUser: { type: Boolean, required: true },
    timestamp: { type: Date, required: true },
});

export interface Chat {
    chatId: string;
    title: string;
    settings: Settings;
    messages: { [messageId: string]: Message };
    getMessages(page: number, count: number): () => Message[];
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

export const ChatSchema = new Schema<Chat>({
    chatId: { type: String, required: true },
    title: { type: String, required: true },
    settings: { type: SettingsSchema },
    messages: { type: Map, of: MessageSchema },
});

ChatSchema.methods.getMessages = function (page: number, count: number): Message[] {
    const allMessages = Object.values(this.messages);
    const startIndex = (page - 1) * count;
    const endIndex = startIndex + count;
    const messages = allMessages.slice(startIndex, endIndex) as Message[];

    return messages;
};
