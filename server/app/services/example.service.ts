/*

import { DBModelName, ThreadModel } from 'vpx-common';
import { DBRequestOptions } from 'vpx-common';
import { Document } from 'mongoose';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { Request } from 'express';

const COLLECTION_NAME = DBModelName.THREAD; // Thread (OLD NAME)

@Service()
export class ThreadsService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = ThreadModel;
    }

    async createThread(req: Request, imagesUrl: string[]) {
        const thread = new ThreadModel({
            creator: req.body.creatorId,
            post: {
                subjects: req.body.subjectId,
                content: req.body.content,
                imagesUrl: imagesUrl,
                reactions: [],
            },
            creationTime: Date.now(),
        });

        if (req.body.parentId) {
            const repliedThread = await this.model.findById(req.body.parentId);
            repliedThread.subThreads.push(thread._id);
            thread.parent = repliedThread._id;
            repliedThread.save();
        }

        await thread.save();

        return thread;
    }

    async getAll(option?: DBRequestOptions): Promise<Document[]> {
        return await this.filterBy({}, option);
    }

    async getThreadReplies(parentId: string, option?: DBRequestOptions): Promise<Document[]> {
        return await this.filterBy({ parent: parentId }, option);
    }

    async filterByThreadsSubjectsId(subjectId: string, option: DBRequestOptions): Promise<Document[]> {
        return await this.filterBy({ 'post.subjects': { $elemMatch: { $in: [subjectId] }}}, option);
    }

    protected setSingleDocumentQuery() {
        this.query.populate({ path: 'post.subjects', populate: { path: 'ratings' } }).populate('creator').populate({ path: 'parent', populate: { path: 'creator' } });
    }

    protected setDefaultQueryPipeline() {
        this.query.populate({ path: 'post.subjects', populate: { path: 'ratings' } }).populate('creator').populate({ path: 'parent', populate: { path: 'creator' } });
    }
}

*/