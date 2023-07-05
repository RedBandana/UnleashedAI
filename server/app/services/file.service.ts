import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { FileModel } from '@app/db-models/file';

const COLLECTION_NAME = 'File';

@Service()
export class FileService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = FileModel;
    }

    protected setDefaultQueryPipeline() {}

    protected setSingleDocumentQuery() {}
}
