import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { useState, useRef, useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { useSettingsStore } from '@/store/settings';

import { ChatService } from '../../lib/chat/service';
import { SwaggerChatError } from '../../types/errors';
import LoadingSpinner from '../ui/loading-spinner';

type ToastFunction = (message: string, type: 'error' | 'success') => void;

interface WindowWithToast extends Window {
  showToast?: ToastFunction;
}

declare const window: WindowWithToast;

export default function MessageInput({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}) {
  const [message, setMessage] = useState('');
  const addMessage = useChatStore(state => state.addMessage);
  const { apiKey, swaggerUrl } = useSettingsStore();
  const chatServiceRef = useRef<ChatService | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (apiKey && swaggerUrl && !chatServiceRef.current) {
      chatServiceRef.current = new ChatService(apiKey, swaggerUrl);
      chatServiceRef.current.initialize().catch(console.error);
    }
  }, [apiKey, swaggerUrl]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !apiKey || !swaggerUrl || isLoading) return;

    setIsLoading(true);

    try {
      if (!chatServiceRef.current) {
        chatServiceRef.current = new ChatService(apiKey, swaggerUrl);
        await chatServiceRef.current.initialize();
      }

      const trimmedMessage = message.trim();
      addMessage({
        role: 'user',
        content: trimmedMessage,
      });

      const response = await chatServiceRef.current.sendMessage(trimmedMessage);

      addMessage({
        role: 'assistant',
        content: response,
      });
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
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = isLoading || !apiKey || !swaggerUrl;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'Please enter a message...'}
        disabled={isDisabled}
        rows={1}
        className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-500 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        className="min-w-[40px] self-end rounded-lg bg-black p-2 text-white hover:opacity-90 disabled:opacity-50"
        disabled={isDisabled || !message.trim()}
      >
        {isLoading ? <LoadingSpinner /> : <ArrowUpCircleIcon className="h-8 w-8 text-[#97E865]" />}
      </button>
    </form>
  );
}
