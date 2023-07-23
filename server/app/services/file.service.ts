import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { IFile, FileModel } from '@app/db-models/file';
import { DBModelName } from "@app/enums/db-model-name";
import * as fs from "fs";

const COLLECTION_NAME = DBModelName.FILE;

@Service()
export class FileService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = FileModel;
    }

    async uploadFile(file: Express.Multer.File): Promise<IFile> {
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

    async deleteOldFiles(): Promise<void> {
        const tenMinutesAgo = new Date(Date.now() - 600000);
        const filesToDelete = await this.model.find({ createdOn: { $lt: tenMinutesAgo } });
        const fileIdsToDelete = filesToDelete.map((file) => file._id);

        for (const fileId of fileIdsToDelete) {
            await this.deleteFile(fileId.toString());
        }
    }

    async deleteFile(id: string): Promise<void> {
        const file = await this.model.findById(id);
        this.deleteFileOnPath(file);
        await this.model.findByIdAndDelete(id);
    }

    deleteFileOnPath(file: IFile) {
        fs.unlink(file.path, (error: NodeJS.ErrnoException) => {
            if (error) {
                console.error(`Error deleting file: ${error}`);
            }
        });
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
