import { ChatbotMessage, ChatbotSettings } from "@app/db-models/chatbot";
import { Chat, LiteChatDto } from "@app/db-models/chat";
import { Utils } from "./utils";
import { Choice, Message } from "@app/db-models/message";

export class Converter {

    static stringsToChoices = (texts: string[]): Choice[] => {
        const choices = texts.map((text, index) => ({ content: text, isDisplayed: false, index: index }))
        return choices;
    }

    static messageToChatbotMessage = (message: Message): ChatbotMessage => {
        const chatbotMessages: ChatbotMessage = {
            role: message.isUser ? "user" : "assistant",
            content: message.choices.find(t => t.isDisplayed)?.content ?? ""
        };
        return chatbotMessages;
    }

    static chatToChatbotSettings = (chat: Chat): any => {
        const partialChatbotSettings = chat.settings as Partial<ChatbotSettings>;
        const messages = Utils.getRequestMessages(chat);

        const chatbotMessages = [];
        chatbotMessages.push({ role: "system", content: partialChatbotSettings.system });
        chatbotMessages.push(messages.map(message => this.messageToChatbotMessage(message)));
        const ChatbotSettings = { ...partialChatbotSettings, messages: chatbotMessages };

        return ChatbotSettings;
    }

    static chatDictToArray = function (chats: { [chatId: string]: Chat }, page: number, count: number) {
        const allChats = Object.values(chats) as LiteChatDto[];
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const chatsCount = allChats.slice(startIndex, endIndex);

        return chatsCount;
    };

      
    static messageDictToArray = function (messages: { [messageId: string]: Message }, page: number, count: number): Message[] {
        const allMessages = Object.values(messages);
        const startIndex = (page - 1) * count;
        const endIndex = startIndex + count;
        const messagesCount = allMessages.slice(startIndex, endIndex) as Message[];

        return messagesCount;
    };
}
