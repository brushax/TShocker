import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UsersIcon, Edit3Icon, Trash2Icon, InfoIcon } from 'lucide-react';
import { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (name: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="group border-border/50 bg-card/50 relative gap-0 overflow-hidden p-0 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:shadow-xl">
      <CardHeader className="border-border/50 bg-muted/20 flex flex-row items-center justify-between space-y-0 border-b px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <UsersIcon className="h-4 w-4 shrink-0 text-indigo-400" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="truncate text-base font-bold select-none">
                  {group.name}
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>{group.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(group)}
            className="h-7 w-7 text-indigo-500 hover:bg-indigo-500/10"
          >
            <Edit3Icon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(group.name)}
            className="text-destructive hover:bg-destructive/10 h-7 w-7"
          >
            <Trash2Icon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  className="border-border/50 bg-muted/50 max-w-[140px] truncate font-mono text-[10px]"
                >
                  {t('groups.card.parent')}: {group.parent || t('groups.card.none')}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {t('groups.card.parent')}: {group.parent || t('groups.card.none')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {group.chatcolor && (
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: `rgb(${group.chatcolor})` }}
              />
              <span className="text-muted-foreground text-[9px] font-bold tracking-tighter uppercase opacity-70">
                {group.chatcolor}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase opacity-60">
            <InfoIcon className="h-2.5 w-2.5" />
            {t('groups.card.permissions_title', { count: group.permissions?.length || 0 })}
          </div>
          <ScrollArea className="border-border/50 bg-muted/10 h-24 w-full rounded-lg border p-2">
            <div className="flex flex-wrap gap-1">
              {group.permissions?.map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className="border-border/40 bg-background/30 px-1 py-0 text-[9px] font-normal"
                >
                  {p}
                </Badge>
              ))}
              {!group.permissions?.length && (
                <span className="text-muted-foreground px-1 py-1 text-[9px] italic">
                  {t('groups.card.no_permissions')}
                </span>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
