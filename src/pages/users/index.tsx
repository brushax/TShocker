import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PlusIcon, UserIcon, RefreshCwIcon } from 'lucide-react';
import api from '@/api';
import { User, Group } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DataTableCard } from '@/components/DataTableCard';
import { useNotice } from '@/hooks/use-notice';
import { cn } from '@/lib/utils';

// Sub-components
import { UserTable } from './components/UserTable';
import { UserCreateSheet } from './components/UserCreateSheet';
import { UserEditSheet } from './components/UserEditSheet';
import { UserDeleteDialog } from './components/UserDeleteDialog';

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createGroup, setCreateGroup] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editGroup, setEditGroup] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const { showNotice } = useNotice();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.users.list();
      if (response.status === '200' && response.data) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      showNotice(
        `${t('users.fetch_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showNotice, t]);

  const loadGroups = useCallback(async () => {
    try {
      const response = await api.groups.list();
      if (response.status === '200' && response.data) {
        setGroups(response.data.groups.map((g: Group) => g.name));
      }
    } catch (error) {
      showNotice(
        `${t('users.fetch_groups_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  }, [showNotice, t]);

  useEffect(() => {
    loadUsers();
    loadGroups();
  }, [loadUsers, loadGroups]);

  const handleCreateUser = async () => {
    try {
      const response = await api.users.create(createUsername, createPassword, createGroup);
      if (response.status === '200') {
        showNotice(t('users.create_success'), 'success');
        setCreateModalVisible(false);
        setCreateUsername('');
        setCreatePassword('');
        setCreateGroup('');
        loadUsers();
      }
    } catch (error) {
      showNotice(
        `${t('users.create_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await api.users.update({
        user: selectedUser.name,
        type: 'name',
        password: editPassword,
        group: editGroup,
      });
      if (response.status === '200') {
        showNotice(t('users.update_success'), 'success');
        setEditModalVisible(false);
        setEditPassword('');
        setEditGroup('');
        loadUsers();
      }
    } catch (error) {
      showNotice(
        `${t('users.update_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  };

  const handleDeleteUser = async (name: string) => {
    try {
      const response = await api.users.destroy(name, 'name');
      if (response.status === '200') {
        showNotice(t('users.delete_success'), 'success');
        loadUsers();
      }
    } catch (error) {
      showNotice(
        `${t('users.delete_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-6 duration-500">
      <PageHeader
        title={t('users.title')}
        description={t('users.description')}
        icon={<UserIcon className="text-indigo-500" />}
        iconClassName="border-indigo-500/20 bg-indigo-500/10"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCwIcon className={cn('h-4 w-4', loading && 'animate-spin')} />}
              onClick={loadUsers}
              disabled={loading}
            >
              {t('users.refresh')}
            </Button>
            <Button
              variant="default"
              size="sm"
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setCreateModalVisible(true)}
              className="btn-primary"
            >
              {t('users.create_user')}
            </Button>
          </div>
        }
      />

      <DataTableCard
        title={t('users.list_title')}
        description={t('users.list_count', { count: users.length })}
      >
        <UserTable
          users={users}
          onEdit={(u) => {
            setSelectedUser(u);
            setEditGroup(u.group);
            setEditModalVisible(true);
          }}
          onDelete={(u) => {
            setDeleteTarget(u);
            setDeleteDialogOpen(true);
          }}
        />
      </DataTableCard>

      <UserCreateSheet
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        username={createUsername}
        onUsernameChange={setCreateUsername}
        password={createPassword}
        onPasswordChange={setCreatePassword}
        group={createGroup}
        onGroupChange={setCreateGroup}
        groups={groups}
        onConfirm={handleCreateUser}
      />

      <UserEditSheet
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        user={selectedUser}
        password={editPassword}
        onPasswordChange={setEditPassword}
        group={editGroup}
        onGroupChange={setEditGroup}
        groups={groups}
        onConfirm={handleUpdateUser}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={deleteTarget}
        onConfirm={() => {
          if (deleteTarget) handleDeleteUser(deleteTarget.name);
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

export default UserManagementPage;
