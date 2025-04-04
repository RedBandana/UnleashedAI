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
  createdOn: Date;
  replyTo?: IReplyTo;
}

export interface IMessageDto {
  id: number;
  content: string;
  choiceIndex?: number;
  choiceCount?: number;
  isUser: boolean;
  createdOn: Date;
  replyTo?: IReplyToDto;
}

export interface IMessageRequest {
  content: string;
  replyToId: number;
}

export interface IReplyTo {
  _id?: ObjectId;
  messageId: ObjectId;
  messageIndex: number;
  messageContent: string;
  messageIsUser: boolean;
}

export interface IReplyToDto {
  id: number;
  text: string;
  isUser: boolean;
}

export interface IChat {
  _id?: ObjectId;
  index: number;
  isActive: boolean;
  title: string;
  settings: ISettings;
  messages: IMessage[];
  createdOn: Date;
  latestMessageCreatedOn: Date;
}

export interface IChatDto {
  id: number;
  title: string;
  settings?: ISettings;
  createdOn?: Date;
  messageCount?: number;
}

export interface IChatRequest {
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
  model: { type: String, required: true, default: "gpt-4o-mini" },
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

export const ReplyToSchema = new Schema<IReplyTo>({
  messageIndex: { type: Number, required: true },
  messageId: { type: Schema.Types.ObjectId, required: true },
  messageContent: { type: String, required: true },
  messageIsUser: { type: Boolean, required: true },
})

export const MessageSchema = new Schema<IMessage>({
  choices: { type: [String] },
  choiceIndex: { type: Number },
  content: { type: String },
  index: { type: Number, required: true },
  replyTo: { type: ReplyToSchema },
  isActive: { type: Boolean, required: true, default: true },
  isUser: { type: Boolean, required: true },
  createdOn: { type: Date, required: true, default: Date.now },
});

export const ChatSchema = new Schema<IChat>({
  title: { type: String, required: true },
  index: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
  settings: { type: SettingsSchema, required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
  createdOn: { type: Date, required: true, default: Date.now },
  latestMessageCreatedOn: { type: Date, required: true, default: Date.now },
});

