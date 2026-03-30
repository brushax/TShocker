import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, AlertCircleIcon, InfoIcon } from 'lucide-react';

export interface NoticeState {
  message: string;
  variant?: 'default' | 'destructive' | 'info' | 'success';
}

export interface StatusNoticeProps {
  notice: NoticeState;
  className?: string;
}

export const StatusNotice: React.FC<StatusNoticeProps> = ({ notice, className }) => {
  const { t } = useTranslation();
  if (!notice) return null;

  const getIcon = () => {
    switch (notice.variant) {
      case 'destructive':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'success':
        return <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />;
      case 'info':
      default:
        return <InfoIcon className="text-primary h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (notice.variant) {
      case 'destructive':
        return t('common.notices.error');
      case 'success':
        return t('common.notices.success');
      case 'info':
      default:
        return t('common.notices.info');
    }
  };

  return (
    <Alert
      variant={notice.variant === 'destructive' ? 'destructive' : 'default'}
      className={cn(
        'animate-in fade-in slide-in-from-top-2 border-border/50 bg-card/80 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      {getIcon()}
      <AlertTitle className="font-bold">{getTitle()}</AlertTitle>
      <AlertDescription className="text-muted-foreground">{notice.message}</AlertDescription>
    </Alert>
  );
};
