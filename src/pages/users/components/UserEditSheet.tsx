import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { User } from '@/types';

interface UserEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  password: string;
  onPasswordChange: (val: string) => void;
  group: string;
  onGroupChange: (val: string) => void;
  groups: string[];
  onConfirm: () => void;
}

export const UserEditSheet: React.FC<UserEditSheetProps> = ({
  open,
  onOpenChange,
  user,
  password,
  onPasswordChange,
  group,
  onGroupChange,
  groups,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border bg-card text-foreground w-full border-l sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {t('users.edit_sheet.title', { name: user?.name })}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {t('users.edit_sheet.password_label')}{' '}
              <span className="text-muted-foreground/60 text-xs">
                {t('users.edit_sheet.password_hint')}
              </span>
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="border-input bg-background text-foreground focus-visible:ring-indigo-500"
              placeholder={t('users.edit_sheet.password_placeholder')}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t('users.edit_sheet.group_label')}</Label>
            <Select value={group} onValueChange={onGroupChange}>
              <SelectTrigger className="border-input bg-background text-foreground w-full">
                <SelectValue placeholder={t('users.edit_sheet.group_placeholder')} />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                {groups.map((g) => (
                  <SelectItem
                    key={g}
                    value={g}
                    className="focus:bg-indigo-500/10 focus:text-indigo-600 dark:focus:text-indigo-400"
                  >
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="mt-8">
          <div className="flex w-full justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:bg-muted"
            >
              {t('users.edit_sheet.cancel')}
            </Button>
            <Button variant="default" onClick={onConfirm} className="btn-primary">
              {t('users.edit_sheet.submit')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
