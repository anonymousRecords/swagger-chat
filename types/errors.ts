export class SwaggerChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
    this.name = 'SwaggerChatError';
  }
}

export class OpenAIError extends SwaggerChatError {
  constructor(message: string) {
    super(
      message,
      'OPENAI_ERROR',
      'OpenAI API 호출 중 오류가 발생했습니다. API 키를 확인해주세요.'
    );
  }
}

export class SwaggerDocError extends SwaggerChatError {
  constructor(message: string) {
    super(
      message,
      'SWAGGER_DOC_ERROR',
      'Swagger 문서를 불러오는데 실패했습니다. URL을 확인해주세요.'
    );
  }
}

export class ValidationError extends SwaggerChatError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', '입력값이 올바르지 않습니다. 다시 확인해주세요.');
  }
}
