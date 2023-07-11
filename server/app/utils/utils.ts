import { Chat, Message } from "@app/db-models/chat";
import { ObjectId } from "mongodb";

export class Utils {

    static DEFAULT_COUNT = 50;

    static getMessagesTokens = (messages: Message[]) => {
        let totalTokens = 0;
        for (let message of messages) {
            totalTokens += message.content.length;
        }
        return totalTokens;
    }

    static getModelMaxTokens = (model: string) => {
        if (model === 'gpt-4') {
            return 8192;
        }
        else if (model === 'gpt-4-32k') {
            return 32768;
        }
        else if (model === 'gpt-3.5-turbo') {
            return 4096;
        }
        else if (model === 'code-davinci-002') {
            return 80001;
        }
        else if (model === 'gpt-3.5-turbo-16k') {
            return 16384;
        }
        else {
            return 4096;
        }
    }

    static getRequestMessages = (chat: Chat) => {
        const memorizedMessages = chat.messages.slice(-chat.settings.memory);
        const modelMaxToken = this.getModelMaxTokens(chat.settings.model);
        const tokenSafeDelta = 2000;

        while (memorizedMessages.length > 1 && this.getMessagesTokens(memorizedMessages) > modelMaxToken - tokenSafeDelta) {
            memorizedMessages.splice(0, 1);
        }

        return memorizedMessages;
    }


    static getUniqueId = (collection: { [id: string]: any }) => {
        let tryCount = 0;
        let id = new ObjectId().toString();

        if (!collection) {
            return id;
        }

        while (collection[id]) {
            if (tryCount > 100) {
                throw new Error('Id already used.');
            }
            id = new ObjectId().toString();
            tryCount++;
        }

        return id;
    }

    static getDefaultChat = () => {
        const chat: Chat =
        {
            title: '',
            messages: [],
            settings: {
                system: 'You are a helpful assistant',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                memory: 10,
                devOptions: false
            }
        }
        return chat;
    }
}