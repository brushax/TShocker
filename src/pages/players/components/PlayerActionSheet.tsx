import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircleIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/types';

interface PlayerActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  actionType: 'kick' | 'ban';
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export const PlayerActionSheet: React.FC<PlayerActionSheetProps> = ({
  open,
  onOpenChange,
  player,
  actionType,
  reason,
  onReasonChange,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="border-border bg-card text-foreground border-l">
        <SheetHeader>
          <SheetTitle className="text-destructive flex items-center gap-2 text-xl font-bold">
            <AlertCircleIcon className="h-6 w-6" />
            {actionType === 'kick'
              ? t('players.action_sheet.kick_title')
              : t('players.action_sheet.ban_title')}
          </SheetTitle>
          <div className="text-muted-foreground text-sm">
            {t('players.action_sheet.description', {
              nickname: player?.nickname,
              type: actionType === 'kick' ? t('players.kick') : t('players.ban'),
            })}
          </div>
        </SheetHeader>
        <div className="mt-8">
          <div className="space-y-2">
            <Label className="text-muted-foreground block text-sm font-medium">
              {t('players.action_sheet.reason_label')}
            </Label>
            <Input
              placeholder={t('players.action_sheet.reason_hint')}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="border-input bg-background focus-visible:ring-destructive transition-colors"
            />
          </div>
        </div>
        <SheetFooter className="mt-8">
          <div className="flex w-full gap-3">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-muted flex-1"
              onClick={() => onOpenChange(false)}
            >
              {t('players.action_sheet.cancel')}
            </Button>
            <Button
              className={`flex-1 text-white ${
                actionType === 'ban'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
              onClick={onConfirm}
            >
              {t('players.action_sheet.confirm_action', {
                type: actionType === 'kick' ? t('players.kick') : t('players.ban'),
              })}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
