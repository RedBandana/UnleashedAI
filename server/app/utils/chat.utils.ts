import { IChat, IMessageBot, IMessageLean, IMessageUser, ISettings } from "@app/db-models/chat";

export class ChatUtils {
    static DEFAULT_COUNT = 50;

    static getDefaultChat = (index: number) => {
        const chat: IChat = {
            title: `Chat ${index + 1}`,
            isActive: true,
            index: index,
            messages: [],
            settings: {
                model: 'gpt-3.5-turbo',
                system: 'You are a helpful assistant',
                temperature: 1,
                memory: 10,
                devOptions: false,
                stream: false,
                top_p: 1,
                n: 1,
                stop: [],
                max_tokens: 0,
                presence_penalty: 0,
                frequency_penalty: 0,
                logit_bias: {}
            },
            creationTime: new Date()
        }
        return chat;
    }

    static getDefaultUserMessage(index: number, content: string): IMessageUser {
        const message: IMessageUser = {
            content: content,
            index: index,
            isActive: true,
            isUser: true,
            creationTime: new Date()
        }

        return message;
    }

    static getDefaultBotMessage(index: number, choices: string[]) {
        const message: IMessageBot = {
            choices: choices, 
            index: index,
            isActive: true,
            choiceIndex: 0, 
            isUser: false, 
            creationTime: new Date()
        }

        return message;
    }

    static getMessagesTokens = (messages: IMessageLean[]) => {
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

    static getRequestMessages = (messages: IMessageLean[], settings: ISettings) => {
        const memorizedMessages = messages.slice(-settings.memory);
        const modelMaxToken = this.getModelMaxTokens(settings.model);
        const tokenSafeDelta = 2000;

        while (memorizedMessages.length > 1 && this.getMessagesTokens(memorizedMessages) > modelMaxToken - tokenSafeDelta) {
            memorizedMessages.splice(0, 1);
        }

        return memorizedMessages;
    }
}