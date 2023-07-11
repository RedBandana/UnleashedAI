import { Service } from 'typedi';
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";
import { ChatbotResponse, ChatbotSettings } from '@app/db-models/chatbot';

@Service()
export class OpenAIService {

    protected openai: OpenAIApi;

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.API_KEY,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async sendChatCompletion(settings: ChatbotSettings): Promise<string[]> {
        const completion = await this.openai.createChatCompletion(settings as CreateChatCompletionRequest);
        const responses: ChatbotResponse = completion.data as ChatbotResponse;
        const choices = responses.choices.map(c => c.message.content);

        return choices;
    }
}