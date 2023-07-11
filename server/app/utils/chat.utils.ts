import { IChat, IMessage } from "@app/db-models/chat";

export class ChatUtils {
    static DEFAULT_COUNT = 50;

    static getDefaultChat = () => {
        const chat: IChat =
        {
            title: '',
            messages: [],
            settings: {
                system: 'You are a helpful assistant',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                memory: 10,
                devOptions: false
            },
            creationTime: new Date()
        }
        return chat;
    }

    static getMessagesTokens = (messages: IMessage[]) => {
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

    static getRequestMessages = (chat: IChat) => {
        const memorizedMessages = chat.messages.slice(-chat.settings.memory);
        const modelMaxToken = this.getModelMaxTokens(chat.settings.model);
        const tokenSafeDelta = 2000;

        while (memorizedMessages.length > 1 && this.getMessagesTokens(memorizedMessages) > modelMaxToken - tokenSafeDelta) {
            memorizedMessages.splice(0, 1);
        }

        return memorizedMessages;
    }
}