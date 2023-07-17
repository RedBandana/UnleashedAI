import { ChatbotMessage, ChatbotSettings } from "@app/db-models/chatbot";
import { ISettings, IMessageDto } from "@app/db-models/chat";

export class Converter {

    static objectToProjected(baseObject: any, projection: { [key: string]: boolean }) {
        const projectedObject: any = {};
        for (const key in projection) {
            if (projection.hasOwnProperty(key) && projection[key] && baseObject[key]) {
                projectedObject[key] = baseObject[key];
            }
        }

        return projectedObject;
    }

    static userToUserDtoNoReturn = (user: any) => {
        user.id = user._id;
        delete user._id;
    }

    static chatToChatDtoNoReturn = (chat: any) => {
        chat.id = chat.index;
        delete chat._id;
        delete chat.index;

        if (chat.settings) {
            delete chat.settings._id;
        }
    }

    static messageToChatbotMessage = (message: IMessageDto): ChatbotMessage => {
        const chatbotMessages: ChatbotMessage = {
            role: message.isUser ? "user" : "assistant",
            content: message.content
        };
        return chatbotMessages;
    }

    static messageToDtoNoReturn(message: any): void {
        if (message.isUser) {
            delete message.choiceIndex;
        }
        else {
            message.content = message.choices[message.choiceIndex];
            if (message.choiceCount === 1) {
                delete message.choiceCount;
                delete message.choiceIndex;
            }
            else {
                message.choiceCount = message.choices.length;
            }
        }
        message.id = message.index;

        delete message._id;
        delete message.index;
        delete message.choices;

        return message;
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

    static chatToChatbotSettings = (settings: ISettings): any => {
        const chatbotSettings = this.settingsToChatbotSettings(settings);
        chatbotSettings.messages.push({ role: "system", content: settings.system });

        return chatbotSettings;
    }

    static getPageCount = function (array: any[], page: number, count: number) {
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const chatsCount = array.slice(startIndex, endIndex);
        return chatsCount;
    };
}
