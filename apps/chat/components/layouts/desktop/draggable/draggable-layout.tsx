'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { DraggableWindow } from '@/components/ui/draggable-window';
import { ApiKeyInput } from '@/components/input/api-key-input';
import { ChatContent } from '@/components/chat/chat-content';
import { SwaggerWrapper } from '@/components/swagger-ui/swagger-wrapper';
import { useApiKeyStore } from '@/store/useApiKeyStore';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const DraggableLayout = () => {
  const { swaggerWindow, chatWindow, layoutMode, setSwaggerWindow, setChatWindow } = useWindowStore();
  const { encryptedApiKey } = useApiKeyStore();
  const [showHelp, setShowHelp] = useState(false);

  if (layoutMode === 'split') {
    return null;
  }

  return (
    <>
      <DraggableWindow
        position={swaggerWindow}
        onPositionChange={setSwaggerWindow}
        title="Swagger Documentation"
      >
        <SwaggerWrapper />
      </DraggableWindow>

      <DraggableWindow
        position={chatWindow}
        onPositionChange={setChatWindow}
        title="Chat"
      >
        {encryptedApiKey ? <ChatContent /> : <ApiKeyInput />}
      </DraggableWindow>

      {/* Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed right-4 bottom-4 text-gray-500 hover:text-gray-700 transition-colors"
        title="도움말"
      >
        <QuestionMarkCircleIcon className="w-6 h-6" />
      </button>

      {/* Help Popup */}
      {showHelp && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setShowHelp(false)}
          />
          <div className="fixed bottom-16 right-4 z-50 px-4 py-3 bg-white text-gray-700 text-sm rounded-lg shadow-lg max-w-xs">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">사용 방법</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p>
              • 창의 상단을 드래그하여 자유롭게 이동할 수 있습니다<br />
              • 창의 모서리나 가장자리를 드래그하여 크기를 조절할 수 있습니다
            </p>
          </div>
        </>
      )}
    </>
  );
};
