import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { DBModelName } from "@app/enums/db-model-name";
import { UserModel } from '@app/db-models/user';

const COLLECTION_NAME = DBModelName.USER;

@Service()
export class UserService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = UserModel;
    }

    async getDocumentByEmail(email: string): Promise<Document | null> {
        this.query = this.model.find({ email: email });
        this.setSingleDocumentQuery();
        return await this.query.lean().exec();
    }

    async createUser(name: string, email: string) {
        const user = new UserModel({
            name,
            email,
            creationTime: Date.now(),
        });
        await user.save();
        return user;
    }

    protected setDefaultQueryPipeline() {}

    protected setSingleDocumentQuery() {}
}
