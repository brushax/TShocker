import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcwIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface RestartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onMessageChange: (val: string) => void;
  noSave: boolean;
  onNoSaveChange: (val: boolean) => void;
  onConfirm: () => void;
}

export const RestartSheet: React.FC<RestartSheetProps> = ({
  open,
  onOpenChange,
  message,
  onMessageChange,
  noSave,
  onNoSaveChange,
  onConfirm,
}) => {
  const { t } = useTranslation();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border bg-card text-foreground w-full border-l sm:w-[400px]"
      >
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2 text-xl">
            <RotateCcwIcon className="h-5 w-5 text-amber-500" />
            {t('system.restart_sheet.confirm_title')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="rounded border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
            {t('system.restart_sheet.warning_text')}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground block text-sm font-medium">
              {t('system.restart_sheet.broadcast_label')}
            </Label>
            <Input
              placeholder={t('system.restart_sheet.broadcast_placeholder')}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="border-input bg-background"
            />
          </div>

          <div className="border-border bg-muted/30 flex items-center justify-between rounded border p-4">
            <Label className="text-muted-foreground text-sm">
              {t('system.restart_sheet.skip_save')}
            </Label>
            <Switch
              checked={noSave}
              onCheckedChange={onNoSaveChange}
              className="data-[state=checked]:bg-amber-600"
            />
          </div>
        </div>
        <SheetFooter className="absolute right-4 bottom-4 left-4">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:bg-muted"
            >
              {t('system.restart_sheet.cancel')}
            </Button>
            <Button onClick={onConfirm} className="bg-amber-600 text-white hover:bg-amber-700">
              {t('system.restart_sheet.confirm')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
