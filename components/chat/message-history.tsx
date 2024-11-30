import { useEffect, useRef } from 'react';

import { useChatStore } from '@/store/chat';

import TypingAnimation from './typing-animation';
import TypingIndicator from '../ui/typing-indcator';

interface Props {
  isLoading: boolean;
}

const parseMarkdown = (text: string) => {
  text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
  text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-500 hover:underline">$1</a>'
  );

  return text;
};

const formatMessageContent = (content: string) => {
  const parsedContent = parseMarkdown(content);
  return parsedContent.split('\n').map((line, i, arr) => (
    <span key={i}>
      <span className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: line }} />
      {i < arr.length - 1 && <br />}
    </span>
  ));
};

export default function MessageHistory({ isLoading }: Props) {
  const messages = useChatStore(state => state.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="space-y-4 py-4">
      {messages.length === 0 ? (
        <TypingAnimation />
      ) : (
        <>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-black whitespace-pre-line'
                }`}
              >
                {formatMessageContent(message.content)}
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
