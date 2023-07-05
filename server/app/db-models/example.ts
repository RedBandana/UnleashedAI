/*

import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { DBModelName, DBStatus } from "./enums";


export interface Post {
    subjects: ObjectId[],
    content: string,
    imagesUrl: string[],
    reactions: string[],
    reactionsCount: number,
    trendingFactor: number,
    controversialFactor: number,
}

export interface Thread extends Document {
    _id: ObjectId,
    creator: ObjectId,
    parent?: ObjectId,
    post: Post,
    subThreads: Thread[],
    followers: ObjectId[],
    creationTime: Date,
    status: String,
}

const ThreadSchema = new mongoose.Schema<Thread>({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: DBModelName.USER, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: DBModelName.THREAD },
    post: {
        type: {
            subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: DBModelName.SUBJECT,required: true }],
            content: { type: String, required: true },
            imagesUrl: [{ type: String }],
            reactions: { type: [String], default: []},
            reactionsCount: { type: Number, default: 0, required: true },
            trendingFactor: { type: Number, default: 0, required: true },
            controversialFactor: { type: Number, default: 0, required: true },
        },
    },
    subThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: DBModelName.THREAD, default: [] }],
    creationTime: { type: Date, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: DBModelName.USER, default: [] }],
    status: {
        type: String,
        enum: {
          values: [DBStatus.ACTIVE, DBStatus.PENDING, DBStatus.DELETED],
          message: `The status can only be 'ACTIVE', 'PENDING' or 'DELETED', got {VALUE} instead`,
        },
        default: DBStatus.ACTIVE,
        required: true,
      },
});

export const ThreadModel = mongoose.model<Thread>(DBModelName.THREAD, ThreadSchema);

*/