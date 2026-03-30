import { useCallback } from 'react';
import { toast } from 'sonner';

export interface NoticeState {
  message: string;
  variant?: 'default' | 'destructive' | 'error' | 'info' | 'success';
}

export function useNotice() {
  const showNotice = useCallback((message: string, variant: NoticeState['variant'] = 'default') => {
    switch (variant) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
      case 'destructive':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
        break;
    }
  }, []);

  return { showNotice };
}
