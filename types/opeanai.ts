// Open AI
export type OpenAIChatRole = 'system' | 'user' | 'assistant' | 'function';

export interface OpenAIChatMessage {
  role: OpenAIChatRole;
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface OpenAIChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIChatMessage;
    finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter' | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// MVP
export type SimpleChatRole = 'system' | 'user' | 'assistant';

export interface SimpleChatMessage {
  role: SimpleChatRole;
  content: string;
}

export interface MinimalChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
