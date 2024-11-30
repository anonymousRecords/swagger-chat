import { OpenApi } from '@samchon/openapi';
import typia from 'typia';

export async function fetchSwaggerDoc(url: string): Promise<OpenApi.IDocument> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Swagger 문서를 불러올 수 없습니다.');
    }

    const data = await response.json();
    return typia.json.assertParse<OpenApi.IDocument>(data);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Swagger 문서 파싱 에러: ${err.message}`);
    }
    throw err;
  }
}

export function parseSwaggerDoc(doc: OpenApi.IDocument): string {
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
      result += `경로: ${path}\n`;

      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;
      for (const method of methods) {
        const operation = pathItem?.[method];
        if (!operation) continue;

        result += `  ${method.toUpperCase()}\n`;
        result += operation.summary ? `    요약: ${operation.summary}\n` : '';
        result += operation.description ? `    설명: ${operation.description}\n` : '';

        if (operation.parameters?.length) {
          result += '    파라미터:\n';
          operation.parameters.forEach(param => {
            if ('$ref' in param) return;
            if (!('name' in param)) return;

            result += `      - ${param.name} (${param.in}) ${param.required ? '[필수]' : '[선택]'}\n`;
            result += param.description ? `        설명: ${param.description}\n` : '';
            if ('schema' in param && param.schema) {
              result += `        타입: ${getSchemaType(param.schema)}\n`;
            }
          });
        }

        result += '\n';
      }
    }
  }

  return result;
}

type SchemaType = {
  type?: string;
  items?: SchemaType | RefType;
  properties?: Record<string, SchemaType | RefType>;
  required?: string[];
  description?: string;
  format?: string;
  enum?: string[];
};

type RefType = {
  $ref: string;
};

type Schema = SchemaType | RefType;

function getSchemaType(schema: Schema): string {
  if ('$ref' in schema) {
    return schema.$ref.split('/').pop() ?? 'unknown';
  }

  if (schema.type === 'array' && schema.items) {
    return `${getSchemaType(schema.items)}[]`;
  }

  return schema.type ?? 'unknown';
}
