import { ChatbotMessage, ChatbotSettings } from "@app/db-models/chatbot";
import { Chat, Settings, Message } from "@app/db-models/chat";
import { Utils } from "./utils";

export class Converter {

    static messageToChatbotMessage = (message: Message): ChatbotMessage => {
        const chatbotMessages: ChatbotMessage = {
            role: message.isUser ? "user" : "assistant",
            content: message.content
        };
        return chatbotMessages;
    }

    static settingsToChatbotSettings(settings: Settings): ChatbotSettings {
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
        for (let key in chatbotSettings) {
            if (chatbotSettings.hasOwnProperty(key) && anyChatbotSettings[key]) {
                cleanSettings[key] = anyChatbotSettings[key];
            }
        }

        return cleanSettings;
    }

    static chatToChatbotSettings = (chat: Chat): any => {
        const chatbotSettings = this.settingsToChatbotSettings(chat.settings);
        chatbotSettings.messages.push({ role: "system", content: chat.settings.system });
        const messages = Utils.getRequestMessages(chat);
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
