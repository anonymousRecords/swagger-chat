import React, { useRef, forwardRef } from 'react';
import { cn } from '@/lib/index';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      onSubmit,
      error,
      className,
      wrapperClassName,
      placeholder,
      value,
      onChange,
      label,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value && typeof value === 'string' && value.trim() && onSubmit) {
          onSubmit(value);
        }
      }
    };

    return (
      <div className={cn('w-full space-y-2', wrapperClassName)}>
        {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <div className="relative">
            <textarea
              ref={ref || textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              rows={rows}
              placeholder={placeholder}
              className={cn(
                'flex min-h-[120px] w-full rounded-md border border-gray-200',
                'bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'resize-none overflow-y-auto pb-10',
                error && 'ring-red-500 focus:ring-red-500',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200',
                className
              )}
              {...props}
            />
            <button
              onClick={() => {
                if (value && typeof value === 'string' && value.trim() && onSubmit) {
                  onSubmit(value);
                }
              }}
              className="absolute bottom-2 right-2 rounded-full p-1.5 transition-colors hover:bg-gray-100"
              type="button"
            >
              <PaperAirplaneIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {error && <p className={cn('text-sm text-red-500')}>{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
