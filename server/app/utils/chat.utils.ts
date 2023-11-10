import { IChat, IMessage, IMessageDto, ISettings } from "@app/db-models/chat";

export class ChatUtils {
    static DEFAULT_COUNT = 50;

    static getDefaultChat = (index: number) => {
        const chat: IChat = {
            title: `new chat`,
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
            createdOn: new Date(),
            latestMessageCreatedOn: new Date(),
        }
        return chat;
    }

    static getDefaultUserMessage(index: number, content: string): IMessage {
        const message: IMessage = {
            content: content,
            index: index,
            isActive: true,
            isUser: true,
            createdOn: new Date()
        }

        return message;
    }

    static getDefaultBotMessage(index: number, choices: string[]): IMessage {
        const message: IMessage = {
            choices: choices,
            index: index,
            isActive: true,
            choiceIndex: 0,
            isUser: false,
            createdOn: new Date()
        }

        return message;
    }

    static getMessagesTokens = (messages: IMessageDto[]) => {
        let totalTokens = 0;
        for (let message of messages) {
            totalTokens += message.content.length;
        }
        return totalTokens;
    }

    static getModelMaxTokens = (model: string) => {
        if (model === 'gpt-4-1106-preview') {
            return 128000;
        }
        else if (model === 'gpt-4-vision-preview') {
            return 128000;
        }
        else if (model === 'gpt-4') {
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

    static getRequestMessages = (messages: IMessageDto[], settings: ISettings) => {
        const modelMaxToken = this.getModelMaxTokens(settings.model);
        const tokenSafeDelta = 2000;

        while (messages.length > 1 && this.getMessagesTokens(messages) > modelMaxToken - tokenSafeDelta) {
            messages.splice(0, 1);
        }

        return messages;
    }
}