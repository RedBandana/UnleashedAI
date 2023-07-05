import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";

export interface User extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  creationTime: Date;
}

const UserSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationTime: { type: Date, default: Date.now, required: true },
});

export const UserModel = mongoose.model(DBModelName.USER, UserSchema);