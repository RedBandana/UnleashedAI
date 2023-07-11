import { ChatbotMessage, ChatbotSettings } from "@app/db-models/chatbot";
import { IChat, ISettings, IMessage } from "@app/db-models/chat";
import { ChatUtils } from "./chat.utils";

export class Converter {

    static objectToProjected(baseObject: any, projection: { [key: string]: number }) {
        const projectedObject: any = {};
        for (const key in projection) {
            if (projection.hasOwnProperty(key) && projection[key] === 1 && baseObject[key]) {
                projectedObject[key] = baseObject[key];
            }
        }

        return projectedObject;
    }

    static messageToChatbotMessage = (message: IMessage): ChatbotMessage => {
        const chatbotMessages: ChatbotMessage = {
            role: message.isUser ? "user" : "assistant",
            content: message.content
        };
        return chatbotMessages;
    }

    static settingsToChatbotSettings(settings: ISettings): ChatbotSettings {
        const chatbotSettings: ChatbotSettings = {
            model: settings.model,
            temperature: settings.temperature,
            top_p: settings.top_p,
            n: settings.n,
            stream: settings.stream,
            stop: settings.stop?.length === 0 ? undefined : settings.stop,
            max_tokens: settings.max_tokens,
            presence_penalty: settings.presence_penalty,
            frequency_penalty: settings.presence_penalty,
            logit_bias: settings.logit_bias,
            user: settings.user,
            messages: []
        }

        const cleanSettings: any = {};
        const anyChatbotSettings: any = chatbotSettings;
        for (const key in chatbotSettings) {
            if (chatbotSettings.hasOwnProperty(key) && anyChatbotSettings[key]) {
                cleanSettings[key] = anyChatbotSettings[key];
            }
        }

        return cleanSettings;
    }

    static chatToChatbotSettings = (chat: IChat): any => {
        const chatbotSettings = this.settingsToChatbotSettings(chat.settings);
        chatbotSettings.messages.push({ role: "system", content: chat.settings.system });
        const messages = ChatUtils.getRequestMessages(chat);
        messages.forEach(m => chatbotSettings.messages.push(this.messageToChatbotMessage(m)))

        return chatbotSettings;
    }

    static getPageCount = function (array: any[], page: number, count: number) {
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const chatsCount = array.slice(startIndex, endIndex);
        return chatsCount;
    };
}
