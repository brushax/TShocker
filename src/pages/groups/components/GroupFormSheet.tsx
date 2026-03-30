import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit3Icon, PlusIcon } from 'lucide-react';

type GroupFormData = {
  name: string;
  parent: string;
  chatcolor: string;
  permissions: string;
};

interface GroupFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode: boolean;
  formData: GroupFormData;
  setFormData: (data: GroupFormData) => void;
  onSubmit: () => void;
}

export const GroupFormSheet: React.FC<GroupFormSheetProps> = ({
  open,
  onOpenChange,
  editMode,
  formData,
  setFormData,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="border-border bg-card sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            {editMode ? (
              <Edit3Icon className="h-6 w-6 text-indigo-500" />
            ) : (
              <PlusIcon className="h-6 w-6 text-indigo-500" />
            )}
            {editMode ? t('groups.form.edit_title') : t('groups.form.create_title')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('groups.form.name_label')}
            </Label>
            <Input
              placeholder={t('groups.form.name_placeholder')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={editMode}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('groups.form.parent_label')}
            </Label>
            <Input
              placeholder={t('groups.form.parent_placeholder')}
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('groups.form.chatcolor_label')}
            </Label>
            <Input
              placeholder={t('groups.form.chatcolor_placeholder')}
              value={formData.chatcolor}
              onChange={(e) => setFormData({ ...formData, chatcolor: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm font-medium">
              {t('groups.form.permissions_label')}
            </Label>
            <Textarea
              placeholder={t('groups.form.permissions_placeholder')}
              value={formData.permissions}
              onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
              className="form-textarea"
            />
          </div>
        </div>
        <SheetFooter className="absolute right-6 bottom-6 left-6">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="border-border h-12 border"
            >
              {t('groups.form.cancel')}
            </Button>
            <Button
              className="h-12 bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={onSubmit}
              disabled={!formData.name}
            >
              {editMode ? t('groups.form.save') : t('groups.form.submit')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
