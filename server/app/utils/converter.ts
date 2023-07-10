import { ChatbotMessage, ChatbotSettings } from "@app/db-models/chatbot";
import { Chat, Message } from "@app/db-models/user.chat";
import { Utils } from "./utils";

export class Converter {
    
    static MessageToChatbotMessage = (message: Message): ChatbotMessage => {
        const chatbotMessages: ChatbotMessage = {
            role: message.isUser ? "user" : "assistant",
            content: message.texts.find(t => t.isDisplayed)?.value ?? ""
        };
        return chatbotMessages;
    }

    static ChatToChatbotSettings = (chat: Chat): any => {
        const partialChatbotSettings = chat.settings as Partial<ChatbotSettings>;
            const messages = Utils.getRequestMessages(chat);

        const chatbotMessages = [];
        chatbotMessages.push({ role: "system", content: partialChatbotSettings.system });
        chatbotMessages.push(messages.map(message => this.MessageToChatbotMessage(message)));
        const ChatbotSettings = { ...partialChatbotSettings, messages: chatbotMessages };

        return ChatbotSettings;
    }
}