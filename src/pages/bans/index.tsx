import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, PlusIcon, ShieldAlertIcon, RefreshCwIcon } from 'lucide-react';
import api from '@/api';
import { Ban } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DataTableCard } from '@/components/DataTableCard';
import { useNotice } from '@/hooks/use-notice';
import { cn } from '@/lib/utils';
import { BanTable } from './components/BanTable';
import { BanCreateSheet } from './components/BanCreateSheet';
import { BanDeleteDialog } from './components/BanDeleteDialog';

const BanManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [bans, setBans] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Ban | null>(null);

  const [newBanIdentifier, setNewBanIdentifier] = useState('');
  const [newBanReason, setNewBanReason] = useState('');

  const { showNotice } = useNotice();

  const loadBans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.bans.list();
      if (response.status === '200' && response.data) {
        setBans(response.data.bans || []);
      }
    } catch (error) {
      showNotice(
        `${t('bans.fetch_failed')}: ${(error as Error).message || t('common.unknown')}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showNotice, t]);

  useEffect(() => {
    loadBans();
  }, [loadBans]);

  const handleCreateBan = async () => {
    if (!newBanIdentifier) return;
    try {
      const response = await api.bans.create({
        identifier: newBanIdentifier,
        reason: newBanReason,
      });
      if (response.status === '200') {
        showNotice(t('bans.ban_success'), 'success');
        setCreateModalVisible(false);
        setNewBanIdentifier('');
        setNewBanReason('');
        loadBans();
      }
    } catch (error) {
      showNotice(
        `${t('bans.ban_failed')}: ${(error as Error).message || t('common.unknown')}`,
        'error'
      );
    }
  };

  const handleDeleteBan = async (fullDelete: boolean = false) => {
    if (!deleteTarget) return;
    try {
      const response = await api.bans.destroy(deleteTarget.ticket_number, fullDelete);
      if (response.status === '200') {
        showNotice(t('bans.unban_success'), 'success');
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
        loadBans();
      }
    } catch (error) {
      showNotice(
        `${t('bans.op_failed')}: ${(error as Error).message || t('common.unknown')}`,
        'error'
      );
    }
  };

  const filteredBans = bans.filter(
    (ban) =>
      ban.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ban.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex h-full flex-col gap-6 duration-500">
      <PageHeader
        title={t('bans.title')}
        description={t('bans.description')}
        icon={<ShieldAlertIcon className="h-6 w-6 text-red-500" />}
        iconClassName="border-red-500/20 bg-red-500/10"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCwIcon className={cn('h-4 w-4', loading && 'animate-spin')} />}
              onClick={loadBans}
              disabled={loading}
            >
              {t('bans.refresh')}
            </Button>
            <Button
              variant="default"
              size="sm"
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setCreateModalVisible(true)}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {t('bans.manual_ban')}
            </Button>
          </div>
        }
      />

      <DataTableCard
        title={t('bans.list_title')}
        description={t('bans.list_count', { count: bans.length })}
        className="mb-1"
        headerAction={
          <div className="relative w-full sm:w-64">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('bans.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-background/50 h-9 pl-10"
            />
          </div>
        }
      >
        <BanTable
          bans={filteredBans}
          loading={loading}
          searchQuery={searchQuery}
          onDelete={(ban) => {
            setDeleteTarget(ban);
            setDeleteDialogOpen(true);
          }}
        />
      </DataTableCard>

      <BanCreateSheet
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        identifier={newBanIdentifier}
        onIdentifierChange={setNewBanIdentifier}
        reason={newBanReason}
        onReasonChange={setNewBanReason}
        onConfirm={handleCreateBan}
      />

      <BanDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        target={deleteTarget}
        onConfirm={handleDeleteBan}
      />
    </div>
  );
};

export default BanManagementPage;
