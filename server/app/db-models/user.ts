import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";
import { IChat, ChatSchema } from "./chat";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  type: number,
  createdOn: Date;
  chats: IChat[];
}

export interface IUserRequest {
  password: string;
  newEmail: string;
  newPassword: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  createdOn: { type: Date, default: Date.now, required: true },
  type: { type: Number, default: 0, required: true },
  chats: { type: [ChatSchema], required: true, default: [] },
});

export const UserModel = mongoose.model<IUser>(DBModelName.USER, UserSchema);