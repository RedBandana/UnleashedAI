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

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationTime: { type: Date, default: Date.now, required: true },
  chats: { type: [ChatSchema], required: true, default: [] },
});

export const UserModel = mongoose.model<IUser>(DBModelName.USER, UserSchema);