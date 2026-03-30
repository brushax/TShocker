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

interface UserCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  onUsernameChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  group: string;
  onGroupChange: (val: string) => void;
  groups: string[];
  onConfirm: () => void;
}

export const UserCreateSheet: React.FC<UserCreateSheetProps> = ({
  open,
  onOpenChange,
  username,
  onUsernameChange,
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
          <SheetTitle className="text-foreground">{t('users.create_sheet.title')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {t('users.create_sheet.username_label')}
            </Label>
            <Input
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className="border-border bg-background text-foreground focus:border-primary"
              placeholder={t('users.create_sheet.username_placeholder')}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {t('users.create_sheet.password_label')}
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="border-border bg-background text-foreground focus:border-primary"
              placeholder={t('users.create_sheet.password_placeholder')}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t('users.create_sheet.group_label')}</Label>
            <Select value={group} onValueChange={onGroupChange}>
              <SelectTrigger className="border-border bg-background text-foreground w-full">
                <SelectValue placeholder={t('users.create_sheet.group_placeholder')} />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="default" className="text-muted-foreground font-sans italic">
                  {t('users.create_sheet.group_select_default')}
                </SelectItem>
                {groups.map((g) => (
                  <SelectItem
                    key={g}
                    value={g}
                    className="focus:bg-accent focus:text-accent-foreground"
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
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t('users.create_sheet.cancel')}
            </Button>
            <Button variant="default" onClick={onConfirm} className="btn-primary">
              {t('users.create_sheet.submit')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
