import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";
import { DBModelName } from "@app/enums/db-model-name";

export interface IFile extends Document {
    _id: ObjectId,
    creationTime: Date,
    filename: string;
    path: string;
    originalName: string;
    mimeType: string;
}

const FileSchema = new mongoose.Schema<IFile>({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    creationTime: { type: Date, default: Date.now, required: true },
});

export const FileModel = mongoose.model(DBModelName.FILE, FileSchema)

export class FileProjection {
    static file: { [key: string]: number } = {
        "_id": 1,
        "filename": 1,
        "path": 1,
    }
}