'use client';

import { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/index';
import { useTranslation } from 'react-i18next';
import '@/i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleKey?: string;
  messageKey?: string;
  confirmTextKey?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  titleKey = 'modal.refresh.title',
  messageKey = 'modal.refresh.message',
  confirmTextKey = 'modal.refresh.confirm',
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    overlayRef.current?.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      overlayRef.current?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            ref={modalRef}
            className={cn(
              "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
              isOpen
                ? "opacity-100 translate-y-0 sm:scale-100"
                : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            )}
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {t(titleKey)}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{t(messageKey)}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto transition-colors"
                onClick={onClose}
              >
                {t(confirmTextKey)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
