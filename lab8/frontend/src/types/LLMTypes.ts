export type ChatMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export interface LLMConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AssistantContext {
  services: Array<{
    name: string;
    description: string;
    complexity: string;
  }>;
}