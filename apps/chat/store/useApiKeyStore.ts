import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptApiKey, decryptApiKey } from '../utils/encryption';

interface SettingsState {
  encryptedApiKey: string;
  setApiKey: (key: string) => Promise<void>;
  getDecryptedApiKey: () => Promise<string>;
  clearApiKey: () => void;
}

export const useApiKeyStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      encryptedApiKey: '',
      setApiKey: async (key) => {
        const encryptedKey = await encryptApiKey(key);
        set({ encryptedApiKey: encryptedKey });
      },
      getDecryptedApiKey: async () => {
        const state = get();
        if (!state.encryptedApiKey) return '';
        return await decryptApiKey(state.encryptedApiKey);
      },
      clearApiKey: () => set({ encryptedApiKey: '' }),
    }),
    {
      name: 'swagger-chat-api-key',
      partialize: (state) => ({ encryptedApiKey: state.encryptedApiKey }),
    }
  )
);