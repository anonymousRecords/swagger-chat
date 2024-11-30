'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useCallback } from 'react';
import Split from 'react-split';

import useIsMobile from '@/hooks/useIsMobile';
import { useQueryParams } from '@/hooks/useQueryParams';

import MessageHistory from './message-history';
import MessageInput from './message-input';
import SwaggerPanel from '../swagger/swagger-pannel';
import MobileDrawer from '../ui/mobile-drawer';

export default function ResponsiveChatInterface() {
  const isMobile = useIsMobile();

  const [params, setParams] = useQueryParams(
    {
      drawer: 'boolean',
    },
    []
  );

  const isDrawerOpen = params.drawer ?? false;

  const toggleDrawer = useCallback(
    (open: boolean) => {
      setParams({ drawer: open });
    },
    [setParams]
  );

  useEffect(() => {
    if (!isMobile && isDrawerOpen) {
      toggleDrawer(false);
    }
  }, [isMobile, isDrawerOpen, toggleDrawer]);

  const DesktopLayout = () => (
    <Split
      className="split-container flex"
      sizes={[30, 70]}
      minSize={[300, 500]}
      gutterSize={4}
      snapOffset={100}
    >
      <div className="min-w-[300px] overflow-auto bg-[#121212]">
        <SwaggerPanel />
      </div>
      <ChatArea />
    </Split>
  );

  const ChatArea = () => (
    <div className="flex h-full flex-1 flex-col bg-[#121212]">
      <div className="flex items-center justify-between border-b border-[#2E2E2E] p-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Swagger Chat" width={32} height={32} />
          <h1 className="text-lg font-bold text-white">Swagger Chat</h1>
        </div>
        {isMobile && (
          <button
            onClick={() => toggleDrawer(true)}
            className="mr-4 text-white hover:text-gray-300"
          >
            <Bars3Icon className="text-white w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <MessageHistory isLoading={false} />
      </div>
      <div className="border-t border-[#2E2E2E] p-4">
        <MessageInput isLoading={false} setIsLoading={() => {}} />
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full">
      {isMobile ? (
        <>
          <ChatArea />
          {isDrawerOpen && <MobileDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
        </>
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
