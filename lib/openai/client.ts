import { SYSTEM_PROMPT } from '../../constants/prompt';
import { type SimpleChatMessage, type MinimalChatCompletionResponse } from '../../types/opeanai';

export const createChatCompletion = async (
  apiKey: string,
  messages: SimpleChatMessage[],
  locale: string = 'en'
) => {
  const systemMessage = `${SYSTEM_PROMPT}\nPlease respond in ${locale === 'ko' ? 'Korean' : locale === 'ja' ? 'Japanese' : 'English'}.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'system', content: systemMessage }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'An error occurred while calling OpenAI API.');
  }

  const data: MinimalChatCompletionResponse = await response.json();
  return data.choices[0].message.content;
};
