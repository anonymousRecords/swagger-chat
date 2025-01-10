'use client';

import { useEffect } from 'react';
import { useWindowStore } from '@/store/useWindowStore';
import { Header } from '../ui';
import { MobileLayout } from './mobile/mobile-layout';
import { DraggableLayout } from './desktop/draggable/draggable-layout';
import { SplitLayout } from './desktop/split/split-layout';

const WindowContainer = () => {
  const { isMobile, layoutMode, setIsMobile } = useWindowStore();

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
    <>
      <Header
        isDefault={false}
        onBackClick={() => {
          window.history.back();
        }}
      />
      <div className="mt-[48px] relative w-full h-[calc(100vh-48px)]">
        {isMobile ? (
          <MobileLayout />
        ) : layoutMode === 'draggable' ? (
          <DraggableLayout />
        ) : (
          <SplitLayout />
        )}
      </div>
    </>
  );
};

export default WindowContainer;
