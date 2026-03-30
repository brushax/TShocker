import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface DataTableCardProps {
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DataTableCard: React.FC<DataTableCardProps> = ({
  title,
  description,
  headerAction,
  children,
  className,
  contentClassName,
}) => {
  return (
    <Card
      className={cn(
        'border-border/50 bg-card/50 w-full gap-0 overflow-hidden p-0 shadow-sm transition-all duration-300',
        className
      )}
    >
      <div className="border-border/50 bg-muted/30 flex items-center justify-between border-b px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-foreground text-lg font-bold tracking-tight">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase opacity-60">
              {description}
            </p>
          )}
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>
      <CardContent className={cn('p-0')}>
        <ScrollArea className={cn('h-[60vh] w-full', contentClassName)}>
          {children}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
