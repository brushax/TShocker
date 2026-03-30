import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  iconClassName,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={cn(
              'bg-muted/30 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm',
              iconClassName
            )}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: cn('h-6 w-6', (icon.props as { className?: string }).className),
                })
              : icon}
          </div>
        )}
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
