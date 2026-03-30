import React from 'react';
import { useTranslation } from 'react-i18next';
import { PowerIcon, AlertCircleIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ShutdownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onMessageChange: (val: string) => void;
  noSave: boolean;
  onNoSaveChange: (val: boolean) => void;
  onConfirm: () => void;
}

export const ShutdownSheet: React.FC<ShutdownSheetProps> = ({
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
            <PowerIcon className="text-destructive h-5 w-5" />
            {t('system.shutdown_sheet.confirm_title')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex gap-3 rounded border p-4 text-sm">
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
            {t('system.shutdown_sheet.warning_text')}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground block text-sm font-medium">
              {t('system.shutdown_sheet.broadcast_label')}
            </Label>
            <Input
              placeholder={t('system.shutdown_sheet.broadcast_placeholder')}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="border-input bg-background"
            />
          </div>

          <div className="border-border bg-muted/30 flex items-center justify-between rounded border p-4">
            <Label className="text-muted-foreground text-sm">
              {t('system.shutdown_sheet.skip_save')}
            </Label>
            <Switch
              checked={noSave}
              onCheckedChange={onNoSaveChange}
              className="data-[state=checked]:bg-destructive"
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
              {t('system.shutdown_sheet.cancel')}
            </Button>
            <Button onClick={onConfirm} className="btn-danger">
              {t('system.shutdown_sheet.confirm')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
