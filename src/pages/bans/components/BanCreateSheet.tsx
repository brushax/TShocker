import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlertIcon } from 'lucide-react';

interface BanCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  identifier: string;
  onIdentifierChange: (val: string) => void;
  reason: string;
  onReasonChange: (val: string) => void;
  onConfirm: () => void;
}

export const BanCreateSheet: React.FC<BanCreateSheetProps> = ({
  open,
  onOpenChange,
  identifier,
  onIdentifierChange,
  reason,
  onReasonChange,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="border-border bg-card sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShieldAlertIcon className="h-6 w-6 text-red-500" />
            {t('bans.create.title')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('bans.create.identifier_label')}
            </Label>
            <Input
              placeholder={t('bans.create.identifier_placeholder')}
              value={identifier}
              onChange={(e) => onIdentifierChange(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('bans.create.reason_label')}
            </Label>
            <Input
              placeholder={t('bans.create.reason_placeholder')}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <SheetFooter className="absolute right-6 bottom-6 left-6">
          <Button
            className="h-14 w-full bg-red-600 text-lg text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={!identifier}
          >
            {t('bans.create.submit')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
