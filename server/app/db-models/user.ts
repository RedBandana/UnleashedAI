import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";
import { Chat, ChatSchema, LiteChatDto } from "./user.chat";

export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  creationTime: Date;
  chats: { [chatId: string]: Chat };
  getChats: (page: number, count: number) => LiteChatDto[];
}

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

export const UserModel = mongoose.model<User>(DBModelName.USER, UserSchema);