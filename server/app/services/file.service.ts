import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { File, FileModel } from '@app/db-models/file';
import { DBModelName } from "@app/enums/db-model-name";

const COLLECTION_NAME = DBModelName.FILE;

@Service()
export class FileService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = FileModel;
    }

    async uploadFile(file: Express.Multer.File): Promise<File> {
        const { filename, path, originalname, mimetype } = file;
        const newFile = new FileModel({
            filename,
            path,
            originalName: originalname,
            mimeType: mimetype,
        });
        await newFile.save();
        return newFile;
    }

    async deleteFile(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
