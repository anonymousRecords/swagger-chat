const SYSTEM_PROMPT = `당신은 Swagger/OpenAPI 문서를 기반으로 API 사용법을 안내하는 챗봇입니다.
주어진 API 문서를 기반으로 다음과 같은 도움을 제공해주세요:
1. API 엔드포인트의 존재 여부와 위치 확인
2. API 요청/응답 파라미터에 대한 설명
3. 간단한 API 사용 예시 제공
4. API 관련 일반적인 질문에 대한 답변

답변할 수 없는 내용이나 API 문서에 없는 내용에 대해서는 솔직히 모른다고 답변해주세요.`;

import { OpenApi } from '@samchon/openapi';

export class ChatService {
  private swaggerDoc: OpenApi.IDocument | null = null;
  private parsedDoc: string | null = null;
  private messages: Array<{ role: string; content: string }> = [];

  constructor(
    private apiKey: string,
    private swaggerUrl: string
  ) {}

  async initialize() {
    if (!this.swaggerDoc) {
      this.swaggerDoc = await this.fetchSwaggerDoc();
      this.parsedDoc = this.parseSwaggerDoc(this.swaggerDoc);

      this.messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `현재 API 문서 정보:\n${this.parsedDoc}` },
      ];
    }
  }

  private async fetchSwaggerDoc(): Promise<OpenApi.IDocument> {
    try {
      const response = await fetch(this.swaggerUrl);
      if (!response.ok) {
        throw new Error('Swagger 문서를 불러올 수 없습니다.');
      }

      const data = await response.json();
      if (!this.isValidSwaggerDoc(data)) {
        throw new Error('유효하지 않은 Swagger/OpenAPI 문서입니다.');
      }
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Swagger 문서 파싱 에러: ${err.message}`);
      }
      throw err;
    }
  }

  private isValidSwaggerDoc(doc: unknown): doc is OpenApi.IDocument {
    if (!doc || typeof doc !== 'object') return false;

    const typedDoc = doc as Record<string, unknown>;

    const version = typedDoc.swagger || typedDoc.openapi;
    if (typeof version !== 'string') return false;

    if (!typedDoc.paths || typeof typedDoc.paths !== 'object') return false;
    const paths = typedDoc.paths as Record<string, unknown>;

    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
    const hasValidEndpoints = Object.values(paths).every((path) => {
      if (!path || typeof path !== 'object') return false;
      const methods = Object.keys(path as object);
      return methods.some((method) => validMethods.includes(method.toLowerCase()));
    });
    if (!hasValidEndpoints) return false;

    if (!typedDoc.info || typeof typedDoc.info !== 'object') return false;
    const info = typedDoc.info as Record<string, unknown>;

    if (typeof info.title !== 'string' || typeof info.version !== 'string') return false;

    return true;
  }

  private parseSwaggerDoc(doc: OpenApi.IDocument): string {
    let result = '';

    if (doc.info) {
      result += `API 이름: ${doc.info.title}\n`;
      result += `버전: ${doc.info.version}\n`;
      if (doc.info.description) {
        result += `설명: ${doc.info.description}\n`;
      }
      result += '\n';
    }

    if (doc.paths) {
      for (const [path, pathItem] of Object.entries(doc.paths)) {
        if (!pathItem) continue;

        result += `경로: ${path}\n`;

        const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
        for (const method of methods) {
          const operation = pathItem[method];
          if (!operation) continue;

          result += `  ${method.toUpperCase()}\n`;
          if (operation.summary) result += `    요약: ${operation.summary}\n`;
          if (operation.description) result += `    설명: ${operation.description}\n`;

          if (operation.parameters?.length) {
            result += '    파라미터:\n';
            operation.parameters.forEach((param) => {
              if ('name' in param) {
                result += `      - ${param.name} (${param.in}) ${param.required ? '[필수]' : '[선택]'}\n`;
                if (param.description) result += `        설명: ${param.description}\n`;
              }
            });
          }

          result += '\n';
        }
      }
    }

    return result;
  }

  async sendMessage(userMessage: string): Promise<string> {
    await this.initialize();

    this.messages.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-0125',
          messages: this.messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        if (response.status === 429) {
          throw new Error(
            'API 사용량 제한에 도달했습니다. OpenAI 계정의 결제 설정을 확인해주세요.'
          );
        }

        if (response.status === 401) {
          throw new Error('API 키가 유효하지 않습니다. OpenAI API 키를 확인해주세요.');
        }

        throw new Error(
          error.error?.message || '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      this.messages.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      this.messages.pop();

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('OpenAI API 호출 중 오류가 발생했습니다.');
    }
  }
}
