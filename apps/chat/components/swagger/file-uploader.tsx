import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/index';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { validateSwaggerFile } from '@/lib/utils/validation';
import { useSwaggerStore } from '@/store/useSwaggerStore';

const DEFAULT_ACCEPT = '.json,.yaml,.yml';
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_LABEL = 'Drag and drop or click to upload a file';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  className?: string;
  label?: string;
  onSuccess?: () => void;
}

interface DragEventHandlers {
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function FileUploader({
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  className,
  label = DEFAULT_LABEL,
  onSuccess,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFile, setType } = useSwaggerStore();

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > maxSize) {
      setErrorMessage(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return false;
    }

    try {
      const isValid = validateSwaggerFile(file);
      if (!isValid) {
        setErrorMessage('Invalid Swagger file');
        return false;
      }
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      return false;
    }
  }, [maxSize]);

  const handleFileSuccess = useCallback((file: File) => {
    setFile(file);
    setType('file');
    setErrorMessage('');
    onSuccess?.();
  }, [setFile, setType, onSuccess]);

  const processFile = useCallback(async (file: File) => {
    if (validateFile(file)) {
      handleFileSuccess(file);
    }
  }, [validateFile, handleFileSuccess]);

  const handleDragEvents = useCallback((): DragEventHandlers => ({
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    onDrop: async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setErrorMessage('');

      const file = e.dataTransfer.files[0];
      if (file) await processFile(file);
    },
  }), [processFile]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFile]);

  const dragHandlers = handleDragEvents();

  return (
    <div className="w-full">
      <div
        className={cn(
          'p-4 relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400',
          errorMessage && 'border-red-500',
          className
        )}
        {...dragHandlers}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        <ArrowUpTrayIcon className="w-6 h-6 mb-4 text-gray-400" aria-hidden="true" />

        <p className="mb-2 text-sm text-gray-500">{label}</p>

        {accept !== '*/*' && (
          <p className="text-xs text-gray-400">
            Supported formats: {accept}
          </p>
        )}

        {maxSize && (
          <p className="text-xs text-gray-400">
            Max size: {maxSize / 1024 / 1024}MB
          </p>
        )}

        {errorMessage && (
          <p className="absolute bottom-2 left-2 text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}