import * as yaml from 'js-yaml';

/**
 * Result type for validation operations
 */
type ValidationResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Configuration for Swagger validation
 */
const CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  validFileExtensions: ['.json', '.yaml', '.yml'] as const,
  validUrlEndpoints: ['/swagger.json', '/api-docs', '/openapi.json'] as const
} as const;

/**
 * Validates a URL string for Swagger/OpenAPI documentation
 * @param url URL to validate
 */
export const validateSwaggerUrl = (url: string): ValidationResult => {
  if (!url) {
    return { success: false, error: 'URL is required' };
  }

  // Swagger document URL pattern validation
  const hasValidEndpoint = CONFIG.validUrlEndpoints.some(endpoint =>
    url.toLowerCase().includes(endpoint.toLowerCase())
  );

  return hasValidEndpoint
    ? { success: true }
    : { success: false, error: 'URL must point to a Swagger/OpenAPI documentation' };
};

/**
 * File metadata for logging
 */
interface FileMetadata {
  name: string;
  type: string;
  size: number;
  extension: string;
}

/**
 * Extracts metadata from a file
 * @param file File to extract metadata from
 */
const getFileMetadata = (file: File): FileMetadata => ({
  name: file.name,
  type: file.type,
  size: file.size,
  extension: '.' + file.name.split('.').pop()?.toLowerCase()
});

/**
 * Validates a file for Swagger/OpenAPI documentation
 * @param file File to validate
 */
export const validateSwaggerFile = (file: File): ValidationResult => {
  if (!file) {
    return { success: false, error: 'File is required' };
  }

  const metadata = getFileMetadata(file);

  // Size validation
  if (metadata.size > CONFIG.maxFileSize) {
    const error = `File size exceeds ${CONFIG.maxFileSize / 1024 / 1024}MB`;
    console.warn(error);
    return { success: false, error };
  }

  // Extension validation
  const hasValidExtension = CONFIG.validFileExtensions.some(ext =>
    metadata.extension === ext
  );

  return hasValidExtension
    ? { success: true }
    : { success: false, error: `File must have one of these extensions: ${CONFIG.validFileExtensions.join(', ')}` };
};

/**
 * Parse file content based on file extension
 * @param content File content as string
 * @param fileName Name of the file (used to determine the format)
 */
export const parseFileContent = (content: string, fileName: string): unknown => {
  const isYaml = fileName.toLowerCase().endsWith('.yml') ||
    fileName.toLowerCase().endsWith('.yaml');

  return isYaml ? yaml.load(content) : JSON.parse(content);
};

/**
 * Validates basic structure of a Swagger/OpenAPI document
 * @param doc Document to validate
 */
export const validateSwaggerDocument = (doc: unknown): boolean => {
  if (!doc || typeof doc !== 'object') {
    return false;
  }

  const swagger = doc as Record<string, unknown>;

  return (
    // Must have either swagger or openapi version
    (('swagger' in swagger) || ('openapi' in swagger)) &&
    // Must have paths object
    'paths' in swagger &&
    typeof swagger.paths === 'object'
  );
};