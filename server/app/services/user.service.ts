import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { DBModelName } from "@app/enums/db-model-name";
import { IUser, UserModel } from '@app/db-models/user';
import { IChat, IMessage } from '@app/db-models/chat';
import { ChatUtils } from '@app/utils/chat.utils';
import { UserPipeline, UserProjection } from '@app/db-models/dto/user.dto';

const COLLECTION_NAME = DBModelName.USER;

@Service()
export class UserService extends DBCollectionService {
    constructor(databaseService: DatabaseService) {
        super(databaseService, COLLECTION_NAME);
        this.model = UserModel;
    }

    async getDocumentByEmail(email: string, projection?: { [key: string]: boolean }): Promise<Document | null> {
        this.query = this.model.findOne({ email: email });
        this.setSingleDocumentQuery();
        return await this.query.lean().select(projection).exec();
    }

    async createUser(name: string, email: string) {
        const user = new UserModel({
            name,
            email,
            creationTime: Date.now(),
            chats: ChatUtils.getDefaultChat()
        });
        await user.save();
        return user;
    }

    async createChat(userId: string): Promise<IChat> {
        const chat: IChat = ChatUtils.getDefaultChat();
        this.query = this.model.updateOne({ _id: userId }, { $push: { chats: chat } });
        await this.query.lean().exec();

        const result = await this.getOneDocumentByAggregate(UserPipeline.chatLatest(userId));
        const newChat = result.chat as IChat;

        return newChat;
    }

    async createMessage(userId: string, chatIndex: string, content: string): Promise<IMessage> {
        const message: IMessage = { content: content, isUser: true, creationTime: new Date() }
        this.query = this.model.updateOne({ _id: userId }, { $push: { [`chats.${chatIndex}.messages`]: message } });
        await this.query.lean().exec();

        const result = await this.getOneDocumentByAggregate(UserPipeline.messageLatest(userId, Number(chatIndex)));
        const newMessage = result.message;
        
        return newMessage;
    }

    async createBotMessage(userId: string, chatIndex: string, choices: string[]): Promise<IMessage> {
        const message: IMessage = { content: choices[0], isUser: false, creationTime: new Date() }
        if (choices.length > 1) {
            message.choices = choices;
        }

        this.query = this.model.updateOne({ _id: userId }, { $push: { [`chats.${chatIndex}.messages`]: message } });
        await this.query.lean().exec();

        return message;
    }

    async deleteChat(userId: string, chatIndex: string): Promise<void> {
        const user = await this.getDocumentByIdLean(userId, UserProjection.chat) as IUser;
        const chatNo = Number(chatIndex);
        const chatId = user.chats[chatNo]._id;

        this.query = this.model.updateOne(
            { _id: userId },
            { $pull: { chats: { _id: chatId } } }
        );
        await this.query.lean().exec();
    }

    async deleteMessage(userId: string, chatIndex: string, messageIndex: string): Promise<void> {
        const user = await this.getDocumentByIdLean(userId, UserProjection.chat) as IUser;
        const chatNo = Number(chatIndex);
        const messageNo = Number(messageIndex);
        const messageId = user.chats[chatNo].messages[messageNo]._id;

        this.query = this.model.updateOne(
            { _id: userId },
            { $pull: { [`chats.${chatIndex}.messages`]: { _id: messageId } } }
        );
        await this.query.lean().exec();
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
