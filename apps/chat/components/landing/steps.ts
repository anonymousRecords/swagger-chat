export const STEPS = [
  { id: 1, description: 'Enter Swagger URL or upload file' },
  { id: 2, description: 'Review docs in familiar Swagger UI' },
  { id: 3, description: 'Chat with AI to explore APIs' },
] as const;

export type Step = typeof STEPS[number];
