export interface MessageInputProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export interface MessageState {
  content: string;
  isSubmitting: boolean;
}

export type ToastFunction = (message: string, type: 'error' | 'success') => void;

export interface WindowWithToast extends Window {
  showToast?: ToastFunction;
}
