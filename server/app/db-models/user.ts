import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";
import { IChat, ChatSchema } from "./chat";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  creationTime: Date;
  chats: IChat[];
}

export interface IUserDto {
  _id: ObjectId;
  name: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationTime: { type: Date, default: Date.now, required: true },
  chats: { type: [ChatSchema], required: true, default: [] },
});

export const UserModel = mongoose.model<IUser>(DBModelName.USER, UserSchema);

export class UserProjection {
  static user: { [key: string]: number } = {
    "_id": 1,
    "name": 1,
    "email": 1,
  } 

  static chats: { [key: string]: number } = {
    "_id": 1,
    "chats": 1,
  }

  static chatsLean: { [key: string]: number } = {
    "_id": 1,
    "chats._id": 1,
    "chats.title": 1,
  }

  static chat: { [key: string]: number } = {
    "_id": 1,
    "chats._id": 1,
    "chats.title": 1,
    "chats.settings": 1,
  }
}