import { OpenApiV3_1 } from '@samchon/openapi';
import { createChatCompletion } from '../openai/client';
import type { SimpleChatMessage, SimpleChatRole } from '../../types/openai';
import { convertToSchemaType, extractSchemaType } from '../swagger/client';
import { decryptApiKey } from '@/utils/encryption';

export class ChatService {
  private swaggerDoc: OpenApiV3_1.IDocument | null = null;
  private messages: SimpleChatMessage[] = [];
  private locale: string;
  private encryptedApiKey: string;

  constructor(
    encryptedApiKey: string,
    locale: string = 'en'
  ) {
    this.encryptedApiKey = encryptedApiKey;
    this.locale = locale.toLowerCase().split('-')[0];
  }

  private async getDecryptedApiKey(): Promise<string> {
    return await decryptApiKey(this.encryptedApiKey);
  }

  async initializeWithFile(file: File) {
    if (!this.isSwaggerFile(file)) {
      throw new Error('유효하지 않은 Swagger 파일 형식입니다.');
    }

    try {
      const swaggerContent = await this.readSwaggerFile(file);
      this.swaggerDoc = await this.parseSwaggerFile(swaggerContent);

      if (!this.isValidSwaggerDoc(this.swaggerDoc)) {
        throw new Error('유효하지 않은 Swagger/OpenAPI 문서입니다.');
      }

      const apiDocumentation = this.formatSwaggerDoc(this.swaggerDoc);

      this.messages = [
        {
          role: 'system' as SimpleChatRole,
          content: `You are an API documentation assistant. Please help users understand and use this API based on the following Swagger/OpenAPI documentation:

${apiDocumentation}

When explaining endpoints:
1. Always mention the full path and HTTP method
2. List all required parameters and their types
3. Describe expected responses and status codes
4. When relevant, provide example usage

Please provide detailed and accurate information based on this specific API documentation.`
        }
      ];

      return this.swaggerDoc;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Swagger 파일 처리 에러: ${err.message}`);
      }
      throw err;
    }
  }

  private formatSwaggerDoc(doc: OpenApiV3_1.IDocument): string {
    let documentation = '';

    if (doc.info) {
      documentation += `API Title: ${doc.info.title}\n`;
      documentation += `Version: ${doc.info.version}\n`;
      if (doc.info.description) {
        documentation += `Description: ${doc.info.description}\n`;
      }
      documentation += '\n';
    }

    if (doc.paths) {
      documentation += 'Endpoints:\n\n';

      for (const [path, pathItem] of Object.entries(doc.paths)) {
        if (!pathItem) continue;

        for (const method of ['get', 'post', 'put', 'delete', 'patch'] as const) {
          const operation = pathItem[method];
          if (!operation) continue;

          documentation += `${method.toUpperCase()} ${path}\n`;

          if (operation.summary) {
            documentation += `Summary: ${operation.summary}\n`;
          }
          if (operation.description) {
            documentation += `Description: ${operation.description}\n`;
          }

          // Parameters
          if (operation.parameters?.length) {
            documentation += 'Parameters:\n';
            for (const param of operation.parameters) {
              if ('name' in param) {
                const schema = param.schema;
                let type = 'any';
                if (schema) {
                  const schemaType = convertToSchemaType(schema);
                  if (schemaType) {
                    type = extractSchemaType(schemaType);
                  }
                }
                documentation += `- ${param.name} (${param.in}) ${param.required ? '(Required)' : '(Optional)'} - Type: ${type}\n`;
                if (param.description) {
                  documentation += `  Description: ${param.description}\n`;
                }
              }
            }
          }

          // Request Body
          if (operation.requestBody && 'content' in operation.requestBody && operation.requestBody.content) {
            documentation += 'Request Body:\n';
            const content = operation.requestBody.content;
            for (const [mediaType, mediaTypeObject] of Object.entries(content)) {
              if (mediaTypeObject.schema) {
                const schemaType = convertToSchemaType(mediaTypeObject.schema);
                if (schemaType) {
                  documentation += `- Media Type: ${mediaType}\n`;
                  documentation += `  Schema: ${extractSchemaType(schemaType)}\n`;
                }
              }
            }
          }

          // Responses
          if (operation.responses) {
            documentation += 'Responses:\n';
            for (const [status, response] of Object.entries(operation.responses)) {
              if (response && 'content' in response) {
                documentation += `- Status ${status}: ${response.description || ''}\n`;
                if (response.content) {
                  for (const [mediaType, mediaTypeObject] of Object.entries(response.content)) {
                    if (mediaTypeObject.schema) {
                      const schemaType = convertToSchemaType(mediaTypeObject.schema);
                      if (schemaType) {
                        documentation += `  ${mediaType}: ${extractSchemaType(schemaType)}\n`;
                      }
                    }
                  }
                }
              }
            }
          }

          documentation += '\n';
        }
      }
    }

    return documentation;
  }

  async initializeWithUrl(swaggerUrl: string) {
    try {
      const response = await fetch(swaggerUrl);
      if (!response.ok) {
        throw new Error('Swagger 문서를 불러올 수 없습니다.');
      }

      const blob = await response.blob();
      const file = new File([blob], 'swagger.json', { type: 'application/json' });

      return this.initializeWithFile(file);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Swagger URL 처리 에러: ${err.message}`);
      }
      throw err;
    }
  }

  private isSwaggerFile(file: File): boolean {
    const allowedTypes = [
      'application/json',
      'application/x-yaml',
      'text/yaml',
      'text/x-yaml',
      'application/yaml'
    ];
    return allowedTypes.includes(file.type) || file.name.endsWith('.json') || file.name.endsWith('.yaml') || file.name.endsWith('.yml');
  }

  private async readSwaggerFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('파일을 읽을 수 없습니다.'));
        }
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsText(file);
    });
  }

  private async parseSwaggerFile(content: string): Promise<OpenApiV3_1.IDocument> {
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('YAML 파싱은 별도의 라이브러리 설치가 필요합니다.');
    }
  }

  private isValidSwaggerDoc(doc: unknown): doc is OpenApiV3_1.IDocument {
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

    return typeof info.title === 'string' && typeof info.version === 'string';
  }

  async sendMessage(userMessage: string): Promise<string> {
    if (!this.swaggerDoc) {
      throw new Error('Swagger 문서가 초기화되지 않았습니다.');
    }

    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const decryptedApiKey = await this.getDecryptedApiKey();
      const response = await createChatCompletion(
        decryptedApiKey,
        this.messages,
        this.locale
      );

      this.messages.push({
        role: 'assistant',
        content: response,
      });

      return response;
    } catch (error) {
      console.error('Failed to get chat completion:', error);
      throw error;
    }
  }
}