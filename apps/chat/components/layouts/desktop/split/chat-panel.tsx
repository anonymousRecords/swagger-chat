'use client';

import { ApiKeyInput } from '@/components/input/api-key-input';
import { ChatContent } from '@/components/chat/chat-content';
import { useApiKeyStore } from '@/store/useApiKeyStore';

export const ChatPanel = () => {
  const { encryptedApiKey } = useApiKeyStore();

  return (
    <div className="h-full overflow-y-auto p-4">
      {encryptedApiKey ? <ChatContent /> : <ApiKeyInput />}
    </div>
  );
};
