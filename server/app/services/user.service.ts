import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { DBModelName } from "@app/enums/db-model-name";
import { User, UserModel } from '@app/db-models/user';
import { Utils } from '@app/utils/utils';
import { Converter } from '@app/utils/converter';
import { Chat } from '@app/db-models/chat';

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

    async createChat(userId: string) {
        const user = await this.getOneDocumentFullInfo(userId) as User;
        const newId = Utils.getUniqueId(user.chats);
        const chat: Chat = {
            chatId: newId,
            title: `Chat ${user.chats.length}`,
            messages: {},
            settings: {
                system: 'You are a helpful assistant',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                memory: 10,
                devOptions: false
            }
        }
        chat.chatId = newId;
        user.chats[chat.chatId] = chat;
        await user.save();
        return chat;
    }

    async createMessage(user: User, chat: Chat, choices: string[], isUser: boolean) {
        const messageId = Utils.getUniqueId(chat.messages);
        const message = {
            messageId: messageId, choices: Converter.stringsToChoices(choices),
            isUser: isUser, creationTime: new Date()
        }

        chat.messages[messageId] = message;
        await user.save()
        return message;
    }

    async deleteChat(userId: string, chatId: string) {
        const user = await this.getOneDocumentFullInfo(userId) as User;
        delete user.chats[chatId];
        user.save();
    }

    async deleteMessage(userId: string, chatId: string, messageId: string) {
        const user = await this.getOneDocumentFullInfo(userId) as User;
        delete user.chats[chatId].messages[messageId];
        user.save();
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
