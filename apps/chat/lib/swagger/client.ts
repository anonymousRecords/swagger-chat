import { OpenApiV3_1 } from '@samchon/openapi';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

function isReference(schema: any): schema is OpenApiV3_1.IJsonSchema.IReference {
  return typeof schema === 'object' && schema !== null && '$ref' in schema;
}

function isBaseSchema(schema: any): schema is OpenApiV3_1.IJsonSchema.__ISignificant<string> {
  return typeof schema === 'object' && schema !== null;
}

interface SchemaType {
  type?: string | string[];
  items?: SchemaType;
  properties?: Record<string, SchemaType>;
  required?: string[];
  description?: string;
  format?: string;
  enum?: string[];
  const?: unknown;
  $ref?: string;
  anyOf?: SchemaType[];
  oneOf?: SchemaType[];
}

class SwaggerParser {
  private static readonly HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch'];

  static normalizeType(type?: unknown): string | string[] | undefined {
    if (!type) return undefined;
    
    if (Array.isArray(type)) {
      return type.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
    }
    
    return typeof type === 'string' && type.trim().length > 0 ? type : undefined;
  }

  static normalizeEnum(enumValues?: unknown[]): string[] | undefined {
    if (!enumValues?.length) return undefined;
    return enumValues.filter((value): value is string =>
      typeof value === 'string' && value.trim().length > 0
    );
  }

  static convertProperties(
    properties?: Record<string, any>
  ): Record<string, SchemaType> | undefined {
    if (!properties) return undefined;

    const result: Record<string, SchemaType> = {};
    for (const [key, value] of Object.entries(properties)) {
      const converted = this.convertToSchemaType(value);
      if (converted) {
        result[key] = converted;
      }
    }
    return Object.keys(result).length ? result : undefined;
  }

  static convertToSchemaType(
    schema?: OpenApiV3_1.IJsonSchema | OpenApiV3_1.IJsonSchema.IReference
  ): SchemaType | undefined {
    if (!schema) return undefined;

    try {
      const result: SchemaType = {};

      if (isReference(schema)) {
        result.$ref = schema.$ref;
        return result;
      }

      if (isBaseSchema(schema)) {
        if ('type' in schema) {
          const normalizedType = this.normalizeType(schema.type);
          if (normalizedType) {
            result.type = normalizedType;
          }
        }

        if ('items' in schema && schema.items) {
          const items = Array.isArray(schema.items) ? schema.items[0] : schema.items;
          const convertedItems = this.convertToSchemaType(items);
          if (convertedItems) {
            result.items = convertedItems;
          }
        }

        if ('properties' in schema && schema.properties) {
          const convertedProperties = this.convertProperties(schema.properties);
          if (convertedProperties) {
            result.properties = convertedProperties;
          }
        }

        if ('required' in schema && Array.isArray(schema.required)) {
          result.required = schema.required.filter(Boolean);
        }

        if ('description' in schema && schema.description) {
          result.description = String(schema.description);
        }

        if ('format' in schema && schema.format) {
          result.format = String(schema.format);
        }

        if ('enum' in schema && Array.isArray(schema.enum)) {
          const normalizedEnum = this.normalizeEnum(schema.enum);
          if (normalizedEnum?.length) {
            result.enum = normalizedEnum;
          }
        }

        if ('const' in schema && schema.const !== undefined) {
          result.const = schema.const;
        }

        if ('anyOf' in schema && Array.isArray(schema.anyOf)) {
          const convertedAnyOf = schema.anyOf
            .map(s => this.convertToSchemaType(s))
            .filter(Boolean) as SchemaType[];
          if (convertedAnyOf.length) {
            result.anyOf = convertedAnyOf;
          }
        }

        if ('oneOf' in schema && Array.isArray(schema.oneOf)) {
          const convertedOneOf = schema.oneOf
            .map(s => this.convertToSchemaType(s))
            .filter(Boolean) as SchemaType[];
          if (convertedOneOf.length) {
            result.oneOf = convertedOneOf;
          }
        }
      }

      return Object.keys(result).length ? result : undefined;
    } catch (error) {
      console.warn('Error converting schema:', error);
      return undefined;
    }
  }

  static extractSchemaType(schema: SchemaType): string {
    if (!schema) return 'unknown';

    if (schema.type) {
      const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
      return type || 'unknown';
    }

    if (schema.$ref) {
      return schema.$ref.split('/').pop() || 'unknown';
    }

    if (schema.anyOf?.length) {
      return this.extractSchemaType(schema.anyOf[0]);
    }

    if (schema.oneOf?.length) {
      return this.extractSchemaType(schema.oneOf[0]);
    }

    return 'unknown';
  }
}

export const convertToSchemaType = SwaggerParser.convertToSchemaType;
export const extractSchemaType = SwaggerParser.extractSchemaType;