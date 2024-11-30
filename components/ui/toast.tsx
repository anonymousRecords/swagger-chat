'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type ToastType = 'error' | 'success' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    error: 'bg-red-50 text-red-500 border-red-100',
    success: 'bg-green-50 text-green-500 border-green-100',
    info: 'bg-blue-50 text-blue-500 border-blue-100',
  }[type];

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${bgColor}`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:opacity-70">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    (window as Window & { showToast?: (message: string, type: ToastType) => void }).showToast =
      addToast;
    return () => {
      delete (window as Window & { showToast?: (message: string, type: ToastType) => void })
        .showToast;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
