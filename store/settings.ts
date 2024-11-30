import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  swaggerUrl: string;
  setApiKey: (key: string) => void;
  setSwaggerUrl: (url: string) => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      apiKey: '',
      swaggerUrl: '',
      setApiKey: key => set({ apiKey: key }),
      setSwaggerUrl: url => set({ swaggerUrl: url }),
      clearSettings: () => set({ apiKey: '', swaggerUrl: '' }),
    }),
    {
      name: 'swagger-chat-settings',
      storage: {
        getItem: name => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          const savedApiKey = sessionStorage.getItem('apiKey');
          return {
            state: {
              ...state,
              apiKey: savedApiKey || '',
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          sessionStorage.setItem('apiKey', state.apiKey);
          const storageValue = {
            state: {
              ...state,
              apiKey: '',
            },
          };
          sessionStorage.setItem(name, JSON.stringify(storageValue));
        },
        removeItem: name => {
          sessionStorage.removeItem('apiKey');
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
