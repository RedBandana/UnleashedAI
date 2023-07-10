import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";

export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  creationTime: Date;
  chats: { [chatId: string]: Chat };
  getChats: (page: number, count: number) => LiteChatDto[];
}

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

export interface Settings {
  settingsId: string;
  model: string;
  system: string;
  temperature: number;
  memory: number;
  topP: number;
  quantity: number;
  stream: boolean;
  stop: string;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  user: string;
  devOptions: boolean;
}

export interface Message {
  messageId: string;
  replies: Reply[];
  isUser: boolean;
  timestamp: Date;
}

export interface Reply {
  replyId: string;
  textId: string;
}

const ReplySchema = new Schema<Reply>({
  replyId: { type: String, required: true },
  textId: { type: String, required: true },
});

const MessageSchema = new Schema<Message>({
  messageId: { type: String, required: true },
  replies: [{ type: ReplySchema, required: true }],
  isUser: { type: Boolean, required: true },
  timestamp: { type: Date, required: true },
});

const SettingsSchema = new Schema<Settings>({
  settingsId: { type: String, required: true },
  model: { type: String, required: true },
  system: { type: String, required: true },
  temperature: { type: Number, required: true },
  memory: { type: Number, required: true },
  topP: { type: Number, required: true },
  quantity: { type: Number, required: true },
  stream: { type: Boolean, required: true },
  stop: { type: String, required: true },
  maxTokens: { type: Number, required: true },
  presencePenalty: { type: Number, required: true },
  frequencyPenalty: { type: Number, required: true },
  user: { type: String, required: true },
  devOptions: { type: Boolean, required: true },
});

const ChatSchema = new Schema<Chat>({
  chatId: { type: String, required: true },
  title: { type: String, required: true },
  settings: { type: SettingsSchema },
  messages: { type: Map, of: MessageSchema },
});

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationTime: { type: Date, default: Date.now },
  chats: { type: Map, of: ChatSchema },
});

UserSchema.methods.getChats = function (page: number, count: number) {
  const allChats = Object.values(this.chats) as LiteChatDto[];
  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const chats = allChats.slice(startIndex, endIndex);

  return chats;
};

ChatSchema.methods.getMessages = function (page: number, count: number): Message[] {
  const allMessages = Object.values(this.messages);
  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const messages = allMessages.slice(startIndex, endIndex) as Message[];

  return messages;
};

ChatSchema.methods.getMessages = function (page: number, count: number): Message[] {
  const allMessages = Object.values(this.messages);
  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const messages = allMessages.slice(startIndex, endIndex) as Message[];

  return messages;
};

export const UserModel = mongoose.model<User>(DBModelName.USER, UserSchema);