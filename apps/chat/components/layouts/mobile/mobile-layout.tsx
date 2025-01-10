'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { DraggableWindow } from '@/components/ui/draggable-window';
import { ApiKeyInput } from '@/components/input/api-key-input';
import { ChatContent } from '@/components/chat/chat-content';
import { SwaggerWrapper } from '@/components/swagger-ui/swagger-wrapper';
import { useApiKeyStore } from '@/store/useApiKeyStore';

export const MobileLayout = () => {
  const { swaggerWindow, chatWindow } = useWindowStore();
  const { encryptedApiKey } = useApiKeyStore();

  return (
    <>
      <DraggableWindow
        className="fixed top-0 left-0 right-0"
        {...swaggerWindow}
        title="Swagger Documentation"
        position={swaggerWindow}
      >
        <SwaggerWrapper />
      </DraggableWindow>

      <DraggableWindow
        className="fixed bottom-0 left-0 right-0"
        {...chatWindow}
        title="Chat"
        position={chatWindow}
      >
        {encryptedApiKey ? <ChatContent /> : <ApiKeyInput />}
      </DraggableWindow>
    </>
  );
};
