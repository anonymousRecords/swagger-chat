import { OpenApi } from '@samchon/openapi';

import { SYSTEM_PROMPT } from '../../constants/prompt';
import { createChatCompletion } from '../openai/client';

import type { SimpleChatMessage, SimpleChatRole } from '../../types/opeanai';

export class ChatService {
  private swaggerDoc: OpenApi.IDocument | null = null;
  private parsedDoc: string | null = null;
  private messages: SimpleChatMessage[] = [];
  private locale: string;

  constructor(
    private apiKey: string,
    private swaggerUrl: string,
    locale: string = 'en'
  ) {
    this.locale = locale.toLowerCase().split('-')[0];
  }

  async initialize() {
    if (!this.swaggerDoc) {
      this.swaggerDoc = await this.fetchSwaggerDoc();
      this.parsedDoc = this.parseSwaggerDoc(this.swaggerDoc);

      this.messages = [
        { role: 'system' as SimpleChatRole, content: SYSTEM_PROMPT },
        { role: 'system' as SimpleChatRole, content: `API Documentation:\n${this.parsedDoc}` },
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
    const hasValidEndpoints = Object.values(paths).every(path => {
      if (!path || typeof path !== 'object') return false;
      const methods = Object.keys(path as object);
      return methods.some(method => validMethods.includes(method.toLowerCase()));
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
            operation.parameters.forEach(param => {
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

    this.messages.push({ role: 'user' as SimpleChatRole, content: userMessage });

    try {
      const assistantMessage = await createChatCompletion(this.apiKey, this.messages, this.locale);
      this.messages.push({ role: 'assistant' as SimpleChatRole, content: assistantMessage });
      return assistantMessage;
    } catch (error) {
      this.messages.pop();

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An error occurred while calling OpenAI API.');
    }
  }
}
