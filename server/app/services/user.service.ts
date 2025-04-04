import { Service } from 'typedi';
import { DatabaseService } from './database.service';
import { DBCollectionService } from './db-collection.service';
import { DBModelName } from "@app/enums/db-model-name";
import { UserModel } from '@app/db-models/user';
import { IChat, IChatDto, IChatRequest, IMessage, IMessageDto } from '@app/db-models/chat';
import { ChatUtils } from '@app/utils/chat.utils';
import { UserPipeline, UserProjection } from '@app/db-models/dto/user.dto';
import { Converter } from '@app/utils/converter';
import { UserType } from '@app/enums/usertypes';
import { createHashedPassword } from '@app/utils/functions';

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

    async getChats(userId: string, page: number, count: number): Promise<IChatDto[]> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.chats(userId, page, count));
        const chats: [] = user.chats;
        chats.forEach(c => Converter.chatToChatDtoNoReturn(c));
        return chats;
    }

    async getChatByIndex(userId: string, chatIndex: number): Promise<IChatDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.chatIndex(userId, chatIndex));
        Converter.chatToChatDtoNoReturn(user.chat);
        return user.chat;
    }

    async getChatLatest(userId: string): Promise<IChatDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.chatLatest(userId));
        Converter.chatToChatDtoNoReturn(user.chat);
        return user.chat;
    }

    async getMessages(userId: string, chatIndex: number, page: number, count: number): Promise<IMessageDto[]> {
        const userTemp = await this.getOneDocumentByAggregate(UserPipeline.chatIndexMessageCount(userId, chatIndex));
        const messageCount = userTemp.chat.messageCount ?? 0;
        const maxPage = Math.ceil(messageCount / count);
        if (page > maxPage) {
            return [];
        }

        let finalCount = count;
        if (page == maxPage) {
            const missingElements = messageCount % count;
            if (missingElements !== 0) {
                finalCount = missingElements;
            }
        }

        const startIndex = (page - 1) * count;
        const user = await this.getOneDocumentByAggregate(UserPipeline.messages(userId, chatIndex, startIndex, finalCount));
        const messages: [] = user.messages;
        messages.forEach(m => Converter.messageToDtoNoReturn(m));
        return messages;
    }

    async getMessageByIndex(userId: string, chatIndex: number, messageIndex: number): Promise<IMessageDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.messageIndex(userId, chatIndex, messageIndex));
        Converter.messageToDtoNoReturn(user.message);
        return user.message;
    }

    async getMessageByIndexAllFields(userId: string, chatIndex: number, messageIndex: number): Promise<IMessage> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.messageIndex(userId, chatIndex, messageIndex));
        return user.message;
    }

    async getMessageLatest(userId: string, chatIndex: number): Promise<IMessageDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.messageLatest(userId, chatIndex));
        Converter.messageToDtoNoReturn(user.message);
        return user.message;
    }

    async getMessageChoices(userId: string, chatIndex: number, messageIndex: number): Promise<IMessage> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.messageIndexChoices(userId, chatIndex, messageIndex));
        return user.choices;
    }

    async createUser(email: string, password: string) {
        const user = new UserModel({
            email,
            password,
            name: '',
            type: UserType.NORMAL,
            createdOn: Date.now(),
            chats: ChatUtils.getDefaultChat(0)
        });
        await user.save();
        return user;
    }

    async createGuest() {
        const user = new UserModel({
            name: '',
            email: '',
            type: UserType.GUEST,
            createdOn: Date.now(),
        });
        await user.save();
        return user;
    }

    async updateUser(userId: string, updateRequest: any): Promise<any> {
        const updatedFields: any = {};

        if (updateRequest.newPassword) {
            updatedFields['password'] = await createHashedPassword(updateRequest.newPassword);
        }

        if (updateRequest.newEmail) {
            updatedFields['email'] = updateRequest.newEmail;
        }

        this.query = this.model.updateOne(
            { _id: userId },
            { $set: updatedFields }
        );
        await this.query.lean().exec();
        const newUser = await this.getDocumentByIdLean(userId, UserProjection.user);
        return newUser;
    }

    async updateUserForce(userId: string, updatedFields: any): Promise<any> {
        if (updatedFields.password) {
            updatedFields.password = await createHashedPassword(updatedFields.password);
        }

        this.query = this.model.updateOne(
            { _id: userId },
            { $set: updatedFields }
        );
        await this.query.lean().exec();
        const newUser = await this.getDocumentByIdLean(userId, UserProjection.user);
        return newUser;
    }

    async createChat(userId: string): Promise<IChatDto> {
        const user: any = await this.getDocumentByIdLean(userId, UserProjection.allChatCount);
        const chatIndex = user.chatCount ?? 0;
        const chat: IChat = ChatUtils.getDefaultChat(chatIndex);
        this.query = this.model.updateOne({ _id: userId }, { $push: { chats: chat } });
        await this.query.lean().exec();

        const newChat = await this.getChatByIndex(userId, chatIndex);
        return newChat;
    }

    async updateChat(userId: string, chatIndex: number, chat: IChatRequest): Promise<IChatDto> {
        const updateOperations: any = {};

        if (chat.title) {
            updateOperations[`chats.${chatIndex}.title`] = chat.title;
        }

        if (chat.settings) {
            const anySettings: any = chat.settings;
            Object.keys(chat.settings).forEach((settingsKey) => {
                if (anySettings.hasOwnProperty(settingsKey)) {
                    updateOperations[`chats.${chatIndex}.settings.${settingsKey}`] = anySettings[settingsKey];
                }
            })
        }

        this.query = this.model.updateOne(
            { _id: userId },
            { $set: updateOperations }
        );
        await this.query.lean().exec();
        const newChat = await this.getChatByIndex(userId, chatIndex);
        return newChat;
    }

    async updateChatForce(userId: string, chatIndex: number, chat: any): Promise<IChatDto> {
        this.query = this.model.updateOne(
            { _id: userId },
            { $set: chat }
        );
        await this.query.lean().exec();
        const newChat = await this.getChatByIndex(userId, chatIndex);
        return newChat;
    }

    async updateMessageChoice(userId: string, chatIndex: number, messageIndex: number, choiceIndex: number): Promise<void> {
        const updateOperations: any = {};
        updateOperations[`chats.${chatIndex}.messages.${messageIndex}.choiceIndex`] = choiceIndex;
        this.query = this.model.updateOne(
            { _id: userId },
            { $set: updateOperations }
        );
        await this.query.lean().exec();
    }

    async createMessage(userId: string, chatIndex: number, content: string, replyMessage: any): Promise<IMessageDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.chatIndexAllMessageCount(userId, chatIndex));
        const messageIndex = user.chat.messageCount ?? 0;
        const message = ChatUtils.getDefaultUserMessage(messageIndex, content);

        if (replyMessage) {
            const replyText = replyMessage.isUser ? replyMessage.content : replyMessage.choices[replyMessage.choiceIndex];
            message.replyTo = {
                messageId: replyMessage._id as any,
                messageIndex: replyMessage.index,
                messageContent: replyText,
                messageIsUser: replyMessage.isUser,
            };
        }

        this.query = this.model.updateOne(
            { _id: userId },
            { $push: { [`chats.${chatIndex}.messages`]: message } }
        );

        await this.query.lean().exec();
        const newMessage: any = await this.getMessageByIndex(userId, chatIndex, messageIndex);
        return newMessage;
    }

    async createBotMessage(userId: string, chatIndex: number, choices: string[]): Promise<IMessageDto> {
        const user = await this.getOneDocumentByAggregate(UserPipeline.chatIndexAllMessageCount(userId, chatIndex));
        const messageIndex = user.chat.messageCount;
        const message = ChatUtils.getDefaultBotMessage(messageIndex, choices);

        this.query = this.model.updateOne(
            { _id: userId },
            { $push: { [`chats.${chatIndex}.messages`]: message } }
        );

        await this.query.lean().exec();
        const newMessage: any = await this.getMessageByIndex(userId, chatIndex, messageIndex);
        return newMessage;
    }

    async deleteChats(userId: string): Promise<void> {
        this.query = this.model.updateOne(
            { _id: userId },
            { $set: { "chats.$[].isActive": false } }
        );
        await this.query.lean().exec();
    }

    async deleteChat(userId: string, chatIndex: number): Promise<void> {
        this.query = this.model.updateOne(
            { _id: userId },
            { $set: { [`chats.${chatIndex}.isActive`]: false } }
        );
        await this.query.lean().exec();
    }

    async deleteMessage(userId: string, chatIndex: number, messageIndex: number): Promise<void> {
        this.query = this.model.updateOne(
            { _id: userId },
            { $set: { [`chats.${chatIndex}.messages.${messageIndex}.isActive`]: false } }
        );
        await this.query.lean().exec();
    }

    protected setDefaultQueryPipeline() { }

    protected setSingleDocumentQuery() { }
}
