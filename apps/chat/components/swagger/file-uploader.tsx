import React, { useState, useRef } from 'react';
import { cn } from '@/lib/index';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { validateSwaggerFile } from '@/lib/utils/validation';
import { useSwaggerStore } from '@/store/useSwaggerStore';

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  className?: string;
  label?: string;
  onSuccess?: () => void;
}

export function FileUploader({
  accept = '.json,.yaml,.yml',
  maxSize = 5 * 1024 * 1024,
  className,
  label = 'Drag and drop or click to upload a file',
  onSuccess,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFile, setType } = useSwaggerStore();

  const handleFileValidation = async (file: File): Promise<boolean> => {
    try {
      const isValid = await validateSwaggerFile(file);
      if (!isValid) {
        setErrorMessage('Invalid Swagger file');
        return false;
      }
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      return false;
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage('');

    const file = e.dataTransfer.files[0];
    if (file) {
      if (await handleFileValidation(file)) {
        setFile(file);
        setType('file');
        onSuccess?.();
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (await handleFileValidation(file)) {
        setFile(file);
        setType('file');
        onSuccess?.();
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'p-4 relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
          isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400',
          errorMessage && 'border-red-500',
          className
        )}
        onDragEnter={(e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        <ArrowUpTrayIcon className="w-6 h-6 mb-4 text-gray-400" aria-hidden="true" />

        <p className="mb-2 text-sm text-gray-500">
          {label}
        </p>

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

FileUploader.displayName = 'FileUploader';