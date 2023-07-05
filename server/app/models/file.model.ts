import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  name: string;
  originalName: string;
  mimetype: string;
  path: string;
  size: number;
  createdAt: Date;
}

const FileSchema: Schema = new Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFile>('File', FileSchema);