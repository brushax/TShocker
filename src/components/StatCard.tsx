import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  subtext?: string;
  loading?: boolean;
  className?: string;
  iconClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtext,
  loading,
  className,
  iconClassName,
}) => {
  return (
    <Card
      className={cn(
        'group border-border/50 bg-card/50 hover:border-primary/30 relative gap-0 overflow-hidden p-0 backdrop-blur-sm transition-all hover:shadow-md',
        className
      )}
    >
      {/* Subtle hover effect background */}
      <div className="bg-primary/5 absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

      <CardContent className="p-3">
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              'border-border/50 bg-muted/40 text-primary group-hover:bg-primary/10 group-hover:border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300',
              iconClassName
            )}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(
                  icon as React.ReactElement<{ size?: number; className?: string }>,
                  {
                    size: 20,
                    className: cn(
                      'transition-transform group-hover:scale-110',
                      (icon.props as { className?: string }).className
                    ),
                  }
                )
              : icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground/80 text-[11px] font-bold tracking-wider uppercase">
              {title}
            </p>
            <div className="mt-0.5 flex items-baseline gap-1">
              {loading ? (
                <div className="bg-muted/60 h-7 w-20 animate-pulse rounded-md" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-foreground truncate text-xl font-bold tracking-tight select-none">
                        {value}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>{value}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {subtext && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground/60 mt-1 truncate text-[10px] font-medium select-none">
                      {subtext}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>{subtext}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
