import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface SectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** accent color: 'indigo' | 'emerald' | 'red' | 'blue' | 'slate' | 'terminal' */
  accentColor?: 'indigo' | 'emerald' | 'red' | 'blue' | 'slate' | 'primary' | 'terminal';
  noPadding?: boolean;
  showWindowControls?: boolean;
}

const accentColorMap = {
  indigo: {
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/20',
    iconFill: 'text-indigo-500',
    headerBorder: 'border-indigo-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    iconFill: 'text-emerald-500',
    headerBorder: 'border-emerald-500/10',
  },
  red: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    iconFill: 'text-red-500',
    headerBorder: 'border-red-500/10',
  },
  blue: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    iconFill: 'text-blue-500',
    headerBorder: 'border-blue-500/10',
  },
  slate: {
    bg: 'bg-muted/30',
    border: 'border-border/50',
    iconFill: 'text-muted-foreground',
    headerBorder: 'border-border/50',
  },
  primary: {
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    iconFill: 'text-primary',
    headerBorder: 'border-border/50',
  },
  terminal: {
    bg: 'bg-slate-900/80',
    border: 'border-slate-800',
    iconFill: 'text-slate-400',
    headerBorder: 'border-slate-800',
  },
};

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon,
  actions,
  children,
  className,
  contentClassName,
  accentColor = 'slate',
  noPadding = false,
  showWindowControls = false,
}) => {
  const accent = accentColorMap[accentColor as keyof typeof accentColorMap] || accentColorMap.slate;

  return (
    <Card
      className={cn(
        'border-border/50 bg-card/50 w-full gap-0 overflow-hidden p-0 shadow-sm transition-all duration-300',
        accent.border,
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between border-b px-6 py-2',
          accent.bg,
          accent.headerBorder
        )}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            {showWindowControls && (
              <div className="mr-3 flex gap-1.5 opacity-90">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f] shadow-sm" />
              </div>
            )}
            {icon && (
              <span className={cn('flex items-center justify-center', accent.iconFill)}>
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
                      size: 18,
                    })
                  : icon}
              </span>
            )}
            <h3 className={cn('text-foreground text-lg font-semibold tracking-tight')}>{title}</h3>
          </div>
          {description && (
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase opacity-60">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <CardContent className={cn('relative', noPadding ? 'p-0' : 'p-3', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};
