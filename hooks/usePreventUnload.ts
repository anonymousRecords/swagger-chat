'use client';

import { useEffect } from 'react';

interface UsePreventUnloadProps {
  shouldPrevent: boolean;
  message?: string;
}

export const usePreventUnload = ({ shouldPrevent, message }: UsePreventUnloadProps) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault();
        e.returnValue = message || '';
        return message || '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldPrevent, message]);
};
