import { Service } from 'typedi';
import { Configuration, OpenAIApi, CreateChatCompletionRequest, CreateCompletionRequest } from "openai";

@Service()
export class ChatService {

    protected openai: OpenAIApi;

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY!,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async sendChatCompletion(settings: {
        system: string;
        history: { isUser: boolean; texts: string[] }[];
        model: string;
        temperature: number;
        topP: number;
        quantity: number;
        stream: boolean;
        stop?: string | string[];
        maxTokens?: number;
        presencePenalty?: number;
        frequencyPenalty?: number;
        logitBias?: { [key: string]: number };
        user?: string;
    }): Promise<string[]> {
        let apiMessages: { role: string; content: string }[] = [];
        apiMessages.push({ role: "system", content: settings.system });

        settings.history.forEach(message => {
            const role = message.isUser ? "user" : "assistant";
            message.texts.forEach(text => {
                apiMessages.push({ role: role, content: text });
            });
        });

        const completion = await this.openai.createChatCompletion({
            model: settings.model,
            messages: apiMessages,
            temperature: settings.temperature,
            topP: settings.topP,
            n: settings.quantity,
            stream: settings.stream,
            stop: settings.stop,
            maxTokens: settings.maxTokens,
            presencePenalty: settings.presencePenalty,
            frequencyPenalty: settings.frequencyPenalty,
            logitBias: settings.logitBias,
            user: settings.user,
        } as CreateChatCompletionRequest);

        let responses: string[] = [];
        completion.data.choices.forEach(choice => {
            if (choice.message?.content) {
                responses.push(choice.message.content);
            }
        });

        return responses;
    }

    async sendCompletion(settings: { model: string; prompt: string; temperature: number; maxTokens: number }): Promise<string> {
        const completion = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: settings.prompt,
            temperature: 0,
            maxTokens: 7,
        } as CreateCompletionRequest);

        const response = completion.data.choices[0].text ?? '';
        return response;
    }

    async trySendRequest(callback: (param: any) => Promise<any>, param1: any): Promise<string[]> {
        try {
            let response = await callback(param1);

            if (response == null) response = ["Error: Something went wrong."];

            return response;
        } catch (error) {
            this.handleError(error);

            return [`Error: ${error.message}`];
        }
    }

    handleError(error: any): void {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}