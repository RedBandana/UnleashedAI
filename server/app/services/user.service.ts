import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { DBModelName } from "@app/enums/db-model-name";
import { UserModel } from '@app/db-models/user';
import { Chat, Message } from '@app/db-models/chat';
import { Utils } from '@app/utils/utils';

const COLLECTION_NAME = DBModelName.USER;

@Service()
export class UserService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = UserModel;
    }

    async getUserById(id: string): Promise<any> {
        this.query = this.model.findById(id);
        return await this.query.lean().exec();
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
            chats: Utils.getDefaultChat()
        });
        await user.save();
        return user;
    }

    async createChat(userId: string) {
        const chat: Chat = Utils.getDefaultChat();
        this.query = this.model.updateOne({ _id: userId }, { $push: { chats: chat } });
        this.query.lean().exec();

        return chat;
    }

    async createMessage(userId: string, chatId: string, content: string) {
        const message: Message = { content: content, isUser: true, creationTime: new Date() }
        this.query = this.model.updateOne({ _id: userId }, { $push: { [`chats.${chatId}.messages`]: message } });
        this.query.lean().exec();

        return message;
    }

    async createBotMessage(userId: string, chatId: string, choices: string[]) {
        const message: Message = { content: choices[0], isUser: false, creationTime: new Date() }
        if (choices.length > 1) {
            message.choices = choices;
        }

        this.query = this.model.updateOne({ _id: userId }, { $push: { [`chats.${chatId}.messages`]: message } });
        this.query.lean().exec();

        return message;
    }

    async deleteChat(userId: string, chatIndex: string) {
        this.query = this.model.updateOne(
            { _id: userId },
            { $unset: { [`chats.${chatIndex}`]: 1 }, $pull: { chats: null } }
        );
        this.query.lean().exec();
    }

    async deleteMessage(userId: string, chatIndex: string, messageIndex: string) {
        this.query = this.model.updateOne(
            { _id: userId },
            { $unset: { [`chats.${chatIndex}.messages.${messageIndex}`]: 1 }, $pull: { [`chats.${chatIndex}.messages`]: null } }
        );
        this.query.lean().exec();
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
