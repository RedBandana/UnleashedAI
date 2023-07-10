import { Schema } from 'mongoose';

export interface ChatbotMessage {
  role: string;
  content: string;
}

export interface ChatbotResponseChoice {
  index: number;
  message: ChatbotMessage;
  finish_reason: string;
}

export const ChatbotMessageSchema = new Schema<ChatbotMessage>({
  role: { type: String, required: true },
  content: { type: String, required: true },
});

export const ChatbotResponseChoiceSchema = new Schema<ChatbotResponseChoice>({
  index: { type: Number, required: true },
  message: { type: ChatbotMessageSchema, required: true },
  finish_reason: { type: String, required: true },
});

export interface ChatbotResponse {
  id: string;
  object: string;
  created: number;
  choices: ChatbotResponseChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const ChatbotResponseSchema = new Schema<ChatbotResponse>({
  id: { type: String, required: true },
  object: { type: String, required: true },
  created: { type: Number, required: true },
  choices: { type: [ChatbotResponseChoiceSchema], required: true },
  usage: {
    prompt_tokens: { type: Number, required: true },
    completion_tokens: { type: Number, required: true },
    total_tokens: { type: Number, required: true },
  },
});

export interface ChatbotSettings {
  model: string;
  system: string;
  temperature: number;
  messages: ChatbotMessage[];
  top_p: number;
  n: number;
  stream: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: { [key: string]: number };
  user?: string;
}

export const ChatbotSettingsSchema = new Schema<ChatbotSettings>({
  model: { type: String, required: true },
  system: { type: String, required: true },
  temperature: { type: Number, required: true },
  messages: {
      type: [ChatbotMessageSchema], required: true
  },
  top_p: { type: Number, required: true },
  n: { type: Number, required: true },
  stream: { type: Boolean, required: true },
  stop: { type: [String] },
  max_tokens: { type: Number },
  presence_penalty: { type: Number },
  frequency_penalty: { type: Number },
  logit_bias: { type: Map, of: Number },
  user: { type: String },
});
