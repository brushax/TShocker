import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  icon,
  className,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div
      className={cn(
        'hover:bg-muted/40 flex items-center justify-between rounded-lg p-2 transition-colors',
        className
      )}
    >
      <div className={cn('text-muted-foreground flex items-center space-x-3', labelClassName)}>
        {icon && (
          <div className="text-primary/70 flex shrink-0 items-center justify-center">
            {React.isValidElement(icon)
              ? React.cloneElement(
                  icon as React.ReactElement<{ size?: number; className?: string }>,
                  {
                    size: 16,
                    className: cn((icon.props as { className?: string }).className),
                  }
                )
              : icon}
          </div>
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div
        className={cn(
          'text-foreground max-w-[120px] truncate text-left text-sm font-semibold',
          value === 'N/A' || !value ? 'opacity-50' : '',
          valueClassName
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default select-none">{value || 'N/A'}</span>
            </TooltipTrigger>
            <TooltipContent>{value || 'N/A'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
