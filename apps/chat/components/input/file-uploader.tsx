import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/index';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useSwaggerStore } from '@/store/useSwaggerStore';
import { validateSwaggerDocument, parseFileContent } from '@/lib/utils/validation';

const DEFAULT_LABEL = 'Drag and drop or click to upload a file';
const ACCEPT = '.json,.yaml,.yml';

interface FileUploaderProps {
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
  className,
  label = DEFAULT_LABEL,
  onSuccess,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFile, setType, error } = useSwaggerStore();

  const handleFileSuccess = useCallback((file: File) => {
    setFile(file);
    setType('file');
    onSuccess?.();
  }, [setFile, setType, onSuccess]);

  const processFile = useCallback(async (file: File) => {
    const content = await file.text();
    const parsedContent = parseFileContent(content, file.name);

    if (!validateSwaggerDocument(parsedContent)) {
      setFile(null);
      console.error('Invalid Swagger/OpenAPI document. Please check the file format and required fields.');
      return;
    }

    handleFileSuccess(file);
  }, [handleFileSuccess, setFile]);

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
          'p-4 relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400',
          error && 'border-red-500',
          className
        )}
        {...dragHandlers}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ACCEPT}
          onChange={handleFileChange}
        />

        <ArrowUpTrayIcon className="w-6 h-6 mb-2 text-gray-400" aria-hidden="true" />

        <p className="mb-1 text-sm text-gray-500">{label}</p>

        <p className="text-xs text-gray-400">
          Supported formats: {ACCEPT}
        </p>

        {error && (
          <p className="absolute bottom-2 left-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}