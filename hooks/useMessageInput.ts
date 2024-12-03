import { useState, useRef, useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { useSettingsStore } from '@/store/settings';

import { ChatService } from '../lib/chat/service';
import { SwaggerChatError } from '../types/errors';

import type { MessageState, WindowWithToast } from '../types/types';

declare const window: WindowWithToast;

interface UseMessageInputProps {
  setIsLoading: (value: boolean) => void;
}

export function useMessageInput({ setIsLoading }: UseMessageInputProps) {
  const [messageState, setMessageState] = useState<MessageState>({
    content: '',
    isSubmitting: false,
  });

  const addMessage = useChatStore(state => state.addMessage);
  const { apiKey, swaggerUrl } = useSettingsStore();
  const chatServiceRef = useRef<ChatService | null>(null);

  useEffect(() => {
    if (apiKey && swaggerUrl && !chatServiceRef.current) {
      chatServiceRef.current = new ChatService(apiKey, swaggerUrl);
      chatServiceRef.current.initialize().catch(console.error);
    }
  }, [apiKey, swaggerUrl]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !apiKey || !swaggerUrl) return;

    setMessageState(prev => ({ ...prev, isSubmitting: true }));
    setIsLoading(true);

    try {
      if (!chatServiceRef.current) {
        chatServiceRef.current = new ChatService(apiKey, swaggerUrl);
        await chatServiceRef.current.initialize();
      }

      const trimmedMessage = content.trim();
      addMessage({
        role: 'user',
        content: trimmedMessage,
      });

      const response = await chatServiceRef.current.sendMessage(trimmedMessage);
      addMessage({
        role: 'assistant',
        content: response,
      });

      setMessageState(prev => ({ ...prev, content: '' }));
    } catch (error) {
      console.error('Failed to send message:', error);

      let errorMessage: string;
      if (error instanceof SwaggerChatError) {
        errorMessage = error.userMessage;
        window.showToast?.(error.userMessage, 'error');
      } else {
        errorMessage = '메시지 전송 중 오류가 발생했습니다.';
        window.showToast?.(errorMessage, 'error');
      }

      addMessage({
        role: 'assistant',
        content: errorMessage,
      });

      chatServiceRef.current = null;
    } finally {
      setIsLoading(false);
      setMessageState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const isDisabled = messageState.isSubmitting || !apiKey || !swaggerUrl;

  return {
    messageState,
    setMessageState,
    sendMessage,
    isDisabled,
  };
}
