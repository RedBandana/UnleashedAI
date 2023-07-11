import { Collection } from 'mongodb';
import { Model, Query, Document, PipelineStage } from 'mongoose';
import { DatabaseService } from './database.service';

export interface DBRequestOptions {
    from: number,
    limit: number
}

export abstract class DBCollectionService {
    aggregationStages: Document[];
    protected model: Model<any>;
    protected query: Query<any, any>;
    constructor(protected databaseService: DatabaseService, protected COLLECTION_NAME: string) {
        this.COLLECTION_NAME = COLLECTION_NAME;
        this.aggregationStages = [];
    }

    protected get collection(): Collection<any> {
        return this.databaseService.database.collection(this.COLLECTION_NAME);
    }

    async getDocumentById(documentId: string, projection?: { [key: string]: boolean }): Promise<Document | null> {
        return await this.model.findById(documentId).sort({ creationTime: -1 }).select(projection).lean();
    }

    async getDocumentByIdLean(documentId: string, projection?: { [key: string]: boolean }): Promise<Document> {
        this.query = this.model.findById(documentId);
        this.setSingleDocumentQuery();
        return await this.query.lean().sort({ creationTime: -1 }).select(projection).exec();
    }

    async getOneDocumentByAggregate(stages: PipelineStage[]): Promise<Document> {
        return (await this.model.aggregate(stages))[0];
    }

    async getDocumentByAggregate(stages: PipelineStage[]): Promise<Document[]> {
        return await this.model.aggregate(stages);
    }

    async filterBy(filter: any, option?: DBRequestOptions, projection?: { [key: string]: boolean }): Promise<Document[]> {
        this.query = this.model.find(filter);
        this.setQueryPipeline(option);
        return await this.query.lean().sort({ creationTime: -1 }).select(projection).exec();
    }

    // TODO: make sure that the pipeline: [{ $limit: 1 }] really improve performance
    async getAll(option?: DBRequestOptions, projection?: { [key: string]: boolean }): Promise<Document[]> {
        return await this.filterBy({}, option, projection);
    }

    private setQueryPipeline(option?: DBRequestOptions) {
        this.setOptionsToQuery(option);
        this.setDefaultQueryPipeline();
    }

    private setOptionsToQuery(option?: DBRequestOptions) {
        if (option) {
            if (option.from >= 0) this.query.skip(option.from);
            if (option.limit > 0) this.query.limit(option.limit);
        }
    }

    protected abstract setSingleDocumentQuery(): void;
    protected abstract setDefaultQueryPipeline(): void;
}
