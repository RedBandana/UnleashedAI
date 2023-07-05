import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";

export interface File extends Document {
    _id: ObjectId,
    creationTime: Date,
}

const SubjectSchema = new mongoose.Schema<File>({
    creationTime: { type: Date, required: true },
});

export const FileModel = mongoose.model(DBModelName.FILE, SubjectSchema)