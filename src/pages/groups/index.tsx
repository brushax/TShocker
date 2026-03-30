import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShieldCheckIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import api from '@/api';
import { Group } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { useNotice } from '@/hooks/use-notice';
import { cn } from '@/lib/utils';
import { GroupCard } from '@/pages/groups/components/GroupCard';
import { GroupFormSheet } from '@/pages/groups/components/GroupFormSheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const GroupManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    parent: '',
    chatcolor: '',
    permissions: '',
  });

  const { showNotice } = useNotice();

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.groups.list();
      if (response.status === '200' && response.data) {
        const baseGroups = response.data.groups || [];
        // Fetch detailed info (permissions, negatedpermissions, totalpermissions) per group
        const detailResults = await Promise.allSettled(
          baseGroups.map((g) => api.groups.read(g.name))
        );

        const merged = baseGroups.map((g, idx) => {
          const res = detailResults[idx];
          if (res.status === 'fulfilled' && res.value && res.value.status === '200' && res.value.data) {
            return { ...g, ...res.value.data };
          }
          return g;
        });

        setGroups(merged);
      }
    } catch (error) {
      showNotice(
        `${t('groups.fetch_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showNotice, t]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({ name: '', parent: '', chatcolor: '', permissions: '' });
    setModalVisible(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditMode(true);
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      parent: group.parent || '',
      chatcolor: group.chatcolor || '',
      permissions: group.permissions?.join(',') || '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (editMode && selectedGroup) {
        api.groups.update({
          group: formData.name,
          parent: formData.parent,
          chatcolor: formData.chatcolor,
          permissions: formData.permissions,
        });
        showNotice(t('groups.update_success'), 'success');
      } else {
        await api.groups.create({
          group: formData.name,
          parent: formData.parent,
          chatcolor: formData.chatcolor,
          permissions: formData.permissions,
        });
        showNotice(t('groups.create_success'), 'success');
      }
      setModalVisible(false);
      loadGroups();
    } catch (error) {
      showNotice(
        `${t('groups.op_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  };

  const handleDelete = async (groupName: string) => {
    if (!window.confirm(t('groups.delete_confirm', { name: groupName }))) return;
    try {
      await api.groups.destroy(groupName);
      showNotice(t('groups.delete_success'), 'success');
      loadGroups();
    } catch (error) {
      showNotice(
        `${t('groups.delete_failed')}: ${(error as Error).message || t('common.unknown_error')}`,
        'error'
      );
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex h-full flex-col gap-6 duration-500">
      <PageHeader
        title={t('groups.title')}
        description={t('groups.description')}
        icon={<ShieldCheckIcon className="text-violet-400" />}
        iconClassName="border-violet-400/20 bg-violet-400/10"
        actions={
          <>
            <Button
              variant="outline"
              onClick={loadGroups}
              disabled={loading}
              icon={<RefreshCwIcon className={cn('h-4 w-4', loading && 'animate-spin')} />}
            >
              {t('groups.refresh')}
            </Button>
            <Button
              loading={loading}
              onClick={handleOpenCreate}
              className="bg-indigo-600 font-medium text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/20"
              icon={<PlusIcon className="h-4 w-4" />}
            >
              {t('groups.create_group')}
            </Button>
          </>
        }
      />

      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <GroupCard
              key={group.name}
              group={group}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ScrollArea>

      <GroupFormSheet
        open={modalVisible}
        onOpenChange={setModalVisible}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GroupManagementPage;
