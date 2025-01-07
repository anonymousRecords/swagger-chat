import { create } from "zustand"
import { validateSwaggerUrl, validateSwaggerFile, validateSwaggerDocument, parseFileContent } from "@/lib/utils/validation"

/**
 * Type of Swagger document input
 */
type SwaggerType = 'url' | 'file';

/**
 * Swagger store state
 */
interface SwaggerState {
  /**
   * Input type (URL or File)
   */
  type: SwaggerType
  /**
   * Swagger URL
   */
  url: string
  /**
   * Swagger file
   */
  file: File | null
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Error message
   */
  error: string | null
}

/**
 * Swagger store actions
 */
interface SwaggerActions {
  setType: (type: SwaggerType) => void
  setUrl: (url: string) => void
  setFile: (file: File | null) => void
  reset: () => void
  submitSwagger: () => Promise<boolean>
}

/**
 * Store for managing Swagger document state and operations
 * @example
 * ```ts
 * const { url, setUrl, submitSwagger } = useSwaggerStore();
 * await submitSwagger();
 * ```
 */
export const useSwaggerStore = create<SwaggerState & SwaggerActions>((set, get) => ({
  // State
  type: 'url',
  url: '',
  file: null,
  isLoading: false,
  error: null,

  // Actions
  setType: (type) => set({ type }),
  setUrl: (url) => {
    const validation = validateSwaggerUrl(url);
    if (!validation.success) {
      set({ error: validation.error });
      return;
    }
    set({ url, error: null });
  },
  setFile: (file) => {
    if (!file) {
      set({ file: null, error: null });
      return;
    }

    const validation = validateSwaggerFile(file);
    if (!validation.success) {
      set({ error: validation.error });
      return;
    }

    set({ file, error: null });
  },
  reset: () => set({
    url: '',
    file: null,
    error: null,
    isLoading: false
  }),
  submitSwagger: async () => {
    const { type, url, file } = get();
    set({ isLoading: true, error: null });

    if (type === 'url') {
      const response = await fetch(url);
      const data = await response.json();

      if (!validateSwaggerDocument(data)) {
        set({ error: 'Invalid Swagger/OpenAPI document' });
        set({ isLoading: false });
        return false;
      }

      set({ isLoading: false });
      return true;
    }

    if (file) {
      const content = await file.text();
      const data = parseFileContent(content, file.name);

      if (!validateSwaggerDocument(data)) {
        set({ error: 'Invalid Swagger/OpenAPI document' });
        set({ isLoading: false });
        return false;
      }

      set({ isLoading: false });
      return true;
    }

    set({ isLoading: false });
    return false;
  }
}))