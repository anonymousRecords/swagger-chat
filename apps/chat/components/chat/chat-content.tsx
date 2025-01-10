import { ChatService } from "@/lib/chat/service";
import { useChatStore } from "@/store/useChatStore";
import { useSwaggerStore } from "@/store/useSwaggerStore";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { MessageHistory } from "./message-history";
import { TextArea } from "../ui";
import { useThrottle } from "@/hooks/useThrottle";

export const ChatContent = () => {
  const { addMessage } = useChatStore();
  const { url } = useSwaggerStore();
  const { encryptedApiKey } = useApiKeyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatServiceRef = useRef<ChatService | null>(null);

  useEffect(() => {
    if (encryptedApiKey && url) {
      const locale = typeof window !== 'undefined' ? window.navigator.language : 'en';
      const chatService = new ChatService(encryptedApiKey, locale);
      chatServiceRef.current = chatService;

      (async () => {
        try {
          await chatService.initializeWithUrl(url);
        } catch (error) {
          console.error('Failed to initialize ChatService:', error);
        }
      })();
    }
  }, [encryptedApiKey, url]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !chatServiceRef.current) return;

    setIsLoading(true);
    setInputMessage('');

    try {
      addMessage({
        role: 'user',
        content: message.trim()
      });

      const assistantMessageContent = await chatServiceRef.current.sendMessage(message.trim());

      addMessage({
        role: 'assistant',
        content: assistantMessageContent
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: error instanceof Error ? error.message : '메시지 전송 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const handleSendMessage = useThrottle(sendMessage, 1000);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageHistory isLoading={isLoading} />
      </div>
      <div className="flex-shrink-0 border-t border-gray-300 p-4">
        <TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onSubmit={handleSendMessage}
          placeholder="Type your message..."
          rows={5}
          className="w-full"
        />
      </div>
    </div>
  );
};