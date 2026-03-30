import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit3Icon, Trash2Icon, UserIcon, ShieldIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Table className="w-full">
      <TableHeader className="bg-muted/50">
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="table-head w-[100px] py-4 pl-6">ID</TableHead>
          <TableHead className="table-head">{t('users.table.username')}</TableHead>
          <TableHead className="table-head">{t('users.table.group')}</TableHead>
          <TableHead className="table-head">{t('users.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-muted-foreground h-64 text-center">
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="empty-avatar">
                  <UserIcon className="h-8 w-8 opacity-20" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="empty-title">{t('users.table.empty_title')}</p>
                  <p className="text-xs italic opacity-60">{t('users.table.empty_desc')}</p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          users.map((u) => (
            <TableRow
              key={u.id}
              className="group border-border/50 hover:bg-muted/40 transition-colors"
            >
              <TableCell className="text-muted-foreground py-4 pl-6 font-mono text-xs">
                #{u.id}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-3">
                  <div className="border-border bg-muted/50 flex h-8 w-8 items-center justify-center rounded-full border">
                    <UserIcon className="text-muted-foreground h-4 w-4" />
                  </div>
                  {u.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <ShieldIcon className="h-3 w-3 text-indigo-500/70" />
                  <span className="font-mono text-sm font-medium text-indigo-500">{u.group}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Edit3Icon className="h-4 w-4" />}
                    className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                    onClick={() => onEdit(u)}
                    title={t('users.table.edit_user')}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2Icon className="h-4 w-4" />}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                    onClick={() => onDelete(u)}
                    title={t('users.table.delete_user')}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
