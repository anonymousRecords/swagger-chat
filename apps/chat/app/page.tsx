'use client';

import { Switch } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/swagger/file-uploader';
import { cn } from '@/lib/index';
import { useState } from 'react';
import { useSwaggerStore } from '@/store/useSwaggerStore';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [swaggerType, setSwaggerType] = useState<'url' | 'file'>('url');
  const {
    url,
    setUrl,
    setType,
    submitSwagger
  } = useSwaggerStore();

  const handleSubmit = async () => {
    setType(swaggerType);
    const result = await submitSwagger();

    if (result) {
      router.push('/chat');
    }
  };

  return (
    <div className={cn('flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50')}>
      <div className={cn(
        'w-full max-w-[600px] min-h-screen',
        'bg-white shadow-lg',
        'relative p-8 md:p-12',
        'flex flex-col items-center justify-center',
        'space-y-8'
      )}>
        {/* Header Section */}
        <div className={cn('text-center space-y-6 mb-8')}>
          <h1 className={cn(
            'text-2xl md:text-4xl font-bold',
            'bg-gradient-to-r from-gray-800 to-gray-600',
            'bg-clip-text text-transparent',
            'leading-tight'
          )}>
            Don't Read
            <br />
            Swagger anymore
          </h1>

          <p className={cn('text-lg text-gray-600 max-w-md mx-auto')}>
            Explore Swagger docs through conversation.
          </p>
        </div>

        {/* Get Started Section */}
        <div className={cn('w-full max-w-md')}>
          <h2 className={cn('text-xl font-semibold mb-6 text-center text-gray-700')}>
            Get Started
          </h2>

          <div className={cn('space-y-8')}>
            {/* Steps */}
            <div className={cn('space-y-4 mb-8 text-sm text-gray-600')}>
              <div className={cn('flex items-start gap-3')}>
                <span className={cn('font-bold text-gray-700')}>1.</span>
                <span>Enter Swagger URL or upload file</span>
              </div>
              <div className={cn('flex items-start gap-3')}>
                <span className={cn('font-bold text-gray-700')}>2.</span>
                <span>Review docs in familiar Swagger UI</span>
              </div>
              <div className={cn('flex items-start gap-3')}>
                <span className={cn('font-bold text-gray-700')}>3.</span>
                <span>Chat with AI to explore APIs</span>
              </div>
            </div>

            {/* Input Section */}
            <section className={cn('w-full flex flex-col items-center space-y-6')}>
              <Switch
                value={swaggerType === 'file'}
                onChange={(value) => setSwaggerType(value ? 'file' : 'url')}
                leftLabel="URL"
                rightLabel="File"
                className="mb-4"
              />

              {swaggerType === 'url' ? (
                <div className={cn('w-full space-y-4')}>
                  <Input
                    label="Swagger URL"
                    placeholder="Enter Swagger URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleSubmit}
                    className={cn('w-full mt-4')}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <FileUploader
                  onSuccess={handleSubmit}
                />
              )}
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <p className={cn('text-sm text-gray-500 text-center mt-8')}>
          Start with optimized Swagger UI,
          <br />
          then let AI help you understand APIs more easily.
        </p>
      </div>
    </div>
  );
}