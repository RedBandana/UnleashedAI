import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface IMessage {
  _id?: ObjectId;
  choices?: string[];
  choiceIndex?: number;
  content?: string;
  index: number;
  isActive: boolean;
  isUser: boolean;
  creationTime: Date;
}

export interface IMessageRequest {
  content: string;
}

export interface IMessageUser {
  _id?: ObjectId;
  index: number;
  isActive: boolean;
  content: string;
  isUser: boolean;
  creationTime: Date;
}

export interface IMessageBot {
  _id?: ObjectId;
  choices: string[];
  choiceIndex: number;
  isUser: boolean;
  creationTime: Date;
  index: number;
  isActive: boolean;
}

export interface IMessageLean {
  _id?: ObjectId;
  choiceCount?: number;
  choiceIndex?: number;
  index: number;
  content: string;
  isUser: boolean;
  creationTime: Date;
}

export interface IChat {
  _id?: ObjectId;
  index: number;
  isActive: boolean;
  title: string;
  settings: ISettings;
  messages: IMessage[];
  creationTime: Date;
}

export interface IChatDetail {
  _id: ObjectId;
  index: number;
  title: string;
  settings: ISettings;
  messageCount?: number;
}

export interface IChatLean {
  _id: ObjectId;
  index: number;
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
}

const SettingsSchema = new Schema<ISettings>({
  model: { type: String, required: true, default: "gpt-3.5-turbo" },
  system: {
    type: String,
    required: true,
    default: "You are a helpful assistant",
  },
  temperature: { type: Number, required: true, default: 1 },
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
});

export const MessageSchema = new Schema<IMessage>({
  choices: { type: [String] },
  choiceIndex: { type: Number },
  content: { type: String },
  index: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
  isUser: { type: Boolean, required: true },
  creationTime: { type: Date, required: true, default: Date.now },
});

export const ChatSchema = new Schema<IChat>({
  title: { type: String, required: true },
  index: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
  settings: { type: SettingsSchema, required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
  creationTime: { type: Date, required: true, default: Date.now },
});

