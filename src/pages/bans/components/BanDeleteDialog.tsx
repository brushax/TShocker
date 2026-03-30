import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Ban } from '@/types';

interface BanDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: Ban | null;
  onConfirm: (fullDelete: boolean) => void;
}

export const BanDeleteDialog: React.FC<BanDeleteDialogProps> = ({
  open,
  onOpenChange,
  target,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [fullDelete, setFullDelete] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('bans.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('bans.delete.description', { identifier: target?.identifier })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-6">
          <div className="flex items-center gap-3 py-2">
            <Switch id="full-delete-switch" checked={fullDelete} onCheckedChange={setFullDelete} />
            <Label htmlFor="full-delete-switch" className="text-sm">
              {t('bans.delete.hard_delete_label')}
            </Label>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border">{t('bans.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(fullDelete)} className="btn-danger">
            {fullDelete ? t('bans.delete.confirm_hard') : t('bans.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
