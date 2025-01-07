'use client';

import { cn } from '@/lib';
import { Button, Input } from '@/components/ui';
import { FileUploader } from './file-uploader';
import { useSwaggerStore } from '@/store/useSwaggerStore';
import { useThrottle } from '@/hooks/useThrottle';

interface SwaggerInputProps {
  type: 'url' | 'file';
  onSubmit: () => Promise<void>;
}

export function SwaggerInput({
  type,
  onSubmit
}: SwaggerInputProps) {
  const { url, setUrl, reset } = useSwaggerStore();
  const throttledSubmit = useThrottle(onSubmit, 1000);

  return (
    <div className={cn('w-full')}>
      {type === 'url' ? (
        <div className={cn('flex flex-col space-y-2')}>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => reset()}
            placeholder="Enter Swagger/OpenAPI URL"
          />
          <Button
            onClick={throttledSubmit}
            className={cn('w-full')}
          >
            Submit
          </Button>
        </div>
      ) : (
        <FileUploader onSuccess={onSubmit} />
      )}
    </div>
  );
}
