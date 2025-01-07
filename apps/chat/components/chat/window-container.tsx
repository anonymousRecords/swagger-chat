'use client';

import React, { useEffect } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { DraggableWindow } from '@/components/ui/draggable-window';
import { ApiKeyInput } from '@/components/input/api-key-input';

import { ChatContent } from '@/components/chat/chat-content';
import { SwaggerWrapper } from '../swagger-ui/swagger-wrapper';

const WindowContainer = () => {
  const { apiKey } = useSettingsStore();
  const {
    swaggerWindow,
    chatWindow,
    isMobile,
    setIsMobile,
  } = useWindowStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <div className="relative w-full h-full">
      <DraggableWindow
        className={isMobile ? 'fixed top-0 left-0 right-0' : 'draggable-header'}
        {...swaggerWindow}
        title="Swagger Documentation"
      >
        <SwaggerWrapper />
      </DraggableWindow>

      <DraggableWindow
        className={isMobile ? 'fixed bottom-0 left-0 right-0' : 'draggable-header'}
        {...chatWindow}
        title="Chat"
      >
        {apiKey ? <ChatContent /> : <ApiKeyInput />}
      </DraggableWindow>
    </div>
  );
};

export default WindowContainer;