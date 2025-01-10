'use client';

import { useState, useEffect } from 'react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

export function RefreshWarning() {
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      setShowRefreshWarning(true);
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'r' && (e.metaKey || e.ctrlKey)) || // Cmd/Ctrl + R
        e.key === 'F5' || // F5
        (e.key === 'F5' && e.ctrlKey) // Ctrl + F5
      ) {
        e.preventDefault();
        setShowRefreshWarning(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ConfirmationModal
      isOpen={showRefreshWarning}
      onClose={() => setShowRefreshWarning(false)}
      titleKey='modal.refresh.title'
      messageKey='modal.refresh.message'
      confirmTextKey='modal.refresh.confirm'
    />
  );
}
