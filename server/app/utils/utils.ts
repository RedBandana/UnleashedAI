import { Chat, Message } from "@app/db-models/user.chat";

export class Utils {
    static getMessagesTokens = (messages: Message[]) => {
        let totalTokens = 0;
        for (let message of messages) {
            totalTokens += message.texts.find(t => t.isDisplayed)?.value?.length ?? 0;
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
        const memorizedMessages = [...Object.values(chat.messages)].slice(-chat.settings.memory);
        const modelMaxToken = this.getModelMaxTokens(chat.settings.model);
        const tokenSafeDelta = 2000;

        while (memorizedMessages.length > 1 && this.getMessagesTokens(memorizedMessages) > modelMaxToken - tokenSafeDelta) {
            memorizedMessages.splice(0, 1);
        }

        return memorizedMessages;
    }

}