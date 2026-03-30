import React from 'react';
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
import { User } from '@/types';

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onOpenChange,
  user,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card text-foreground border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {t('users.delete_dialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {t('users.delete_dialog.description', { name: user?.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border bg-background text-muted-foreground hover:bg-muted">
            {t('users.delete_dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="btn-danger">
            {t('users.delete_dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
