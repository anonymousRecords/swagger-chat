import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

import { useMessageInput } from '../../hooks/useMessageInput';
import LoadingSpinner from '../ui/loading-spinner';
import TextArea from '../ui/text-area';

import type { MessageInputProps } from '../../types/types';

export default function MessageInput({ isLoading, setIsLoading }: MessageInputProps) {
  const { messageState, setMessageState, sendMessage, isDisabled } = useMessageInput({
    setIsLoading,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    await sendMessage(messageState.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextArea
        value={messageState.content}
        onChange={e => setMessageState(prev => ({ ...prev, content: e.target.value }))}
        onKeyDown={handleKeyDown}
        placeholder="Please enter a message..."
        disabled={isDisabled}
        rows={1}
      />
      <button
        type="submit"
        className="min-w-[40px] self-end rounded-lg bg-black p-2 text-white hover:opacity-90 disabled:opacity-50"
        disabled={isDisabled || !messageState.content.trim()}
      >
        {isLoading ? <LoadingSpinner /> : <ArrowUpCircleIcon className="h-8 w-8 text-[#97E865]" />}
      </button>
    </form>
  );
}
