'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSwaggerStore } from '@/store/useSwaggerStore';
import { cn } from '@/lib';
import { SwaggerInput } from '@/components/features/swagger/input/swagger-input';
import { useChatStore } from '@/store/useChatStore';
import { BackButton } from '@/components/common/buttons/back-button';
import { ToggleSwitch } from '@/components/common/toggle/toggle-switch';
import { InfoTooltip } from '@/components/common/tooltips/info-tooltip';

const InputPage = () => {
  const router = useRouter();
  const { type, setType, submitSwagger } = useSwaggerStore();
  const { clearMessages } = useChatStore();

  const onBackClick = () => {
    router.push('/');
  };

  const handleSubmit = async () => {
    clearMessages();
    const result = await submitSwagger();
    if (result) {
      router.push('/chat');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-16">
      <header className="mb-8">
        <BackButton onClick={onBackClick} />
        <div className="mt-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold">Start with Your API</h1>
          <InfoTooltip
            content="This tool uses AI technology, which means your API documentation will be transmitted to external servers. Please review your company's data security policies before using internal API documentation."
            className="mt-1"
          />
        </div>
      </header>

      <section className={cn('flex w-full flex-col items-center space-y-3 md:space-y-6')}>
        <div className={cn('flex w-full justify-end')}>
          <ToggleSwitch
            value={type === 'file'}
            onChange={(value) => setType(value ? 'file' : 'url')}
            leftLabel="URL"
            rightLabel="File"
          />
        </div>
        <SwaggerInput type={type} onSubmit={handleSubmit} />
      </section>
    </div>
  );
};

export default InputPage;
