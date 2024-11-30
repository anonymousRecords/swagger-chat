import { type SimpleChatMessage, type MinimalChatCompletionResponse } from '../../types/opeanai';

const SYSTEM_PROMPT = `당신은 Swagger/OpenAPI 문서를 기반으로 API 사용법을 안내하는 챗봇입니다.
주어진 API 문서를 기반으로 다음과 같은 도움을 제공해주세요:
1. API 엔드포인트의 존재 여부와 위치 확인
2. API 요청/응답 파라미터에 대한 설명
3. 간단한 API 사용 예시 제공
4. API 관련 일반적인 질문에 대한 답변

답변할 수 없는 내용이나 API 문서에 없는 내용에 대해서는 솔직히 모른다고 답변해주세요.`;

export const createChatCompletion = async (apiKey: string, messages: SimpleChatMessage[]) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'OpenAI API 호출 중 오류가 발생했습니다.');
  }

  const data: MinimalChatCompletionResponse = await response.json();
  return data.choices[0].message.content;
};
