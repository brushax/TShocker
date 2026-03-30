import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UsersIcon, RefreshCwIcon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import api from '@/api';
import { cn } from '@/lib/utils';
import { Player, PlayerDetail, NPC, Item } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DataTableCard } from '@/components/DataTableCard';
import { useNotice } from '@/hooks/use-notice';

import { PlayerTable } from '@/pages/players/components/PlayerTable';
import { PlayerDetailSheet } from '@/pages/players/components/PlayerDetailSheet';
import { PlayerActionSheet } from '@/pages/players/components/PlayerActionSheet';
import { SummonNPCSheet } from '@/pages/players/components/SummonNPCSheet';
import { GiveItemSheet } from '@/pages/players/components/GiveItemSheet';

const PlayerManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerDetail, setPlayerDetail] = useState<PlayerDetail | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'kick' | 'ban'>('kick');
  const [actionReason, setActionReason] = useState('');

  // New States
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [summonOpen, setSummonOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [hasSSM, setHasSSM] = useState<boolean>(false);

  const { showNotice } = useNotice();
  const { i18n } = useTranslation();

  // Load NPC/Item data based on language
  useEffect(() => {
    const loadStaticData = async () => {
      // Determine language path
      const lang = i18n.language === 'en' ? 'en' : 'zh-CN';

      try {
        const npcRes = await fetch(`/data/${lang}/npcs.json`);
        if (npcRes.ok) {
          const data = await npcRes.json();
          setNpcs(data.filter((n: NPC) => n.id >= 0));
        }

        const itemRes = await fetch(`/data/${lang}/items.json`);
        if (itemRes.ok) {
          const data = await itemRes.json();
          setItems(data.filter((i: Item) => i.id > 0));
        }
      } catch (err) {
        console.error('Failed to load static game data:', err);
      }
    };
    loadStaticData();
  }, [i18n.language]);

  // Check if server supports the ssm summon command
  useEffect(() => {
    const checkSSM = async () => {
      if (!state.isAuthenticated) return setHasSSM(false);
      try {
        const res = await api.server.executeRawCommand('/help ssm');
        if (res.status === '200' && res.data?.response) {
          const out = Array.isArray(res.data.response)
            ? res.data.response.join(' ')
            : String(res.data.response);
          const lowered = out.toLowerCase();
          if (
            !lowered.includes('unknown command') &&
            !lowered.includes('no help for') &&
            !lowered.includes('not found')
          ) {
            setHasSSM(true);
            return;
          }
        }
      } catch (e) {
        console.error('Error checking SSM command:', e);
      }
      setHasSSM(false);
    };

    checkSSM();
  }, [state.isAuthenticated]);

  const loadPlayers = useCallback(async () => {
    if (!state.isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.players.list();
      if (response.status === '200' && response.data) {
        setPlayers(response.data.players || []);
      }
    } catch (error) {
      showNotice(
        `${t('players.fetch_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [state.isAuthenticated, showNotice, t]);

  useEffect(() => {
    loadPlayers();
    if (!autoRefresh) return;
    const interval = setInterval(loadPlayers, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadPlayers]);

  const handleShowDetail = async (player: Player) => {
    setSelectedPlayer(player);
    try {
      setLoading(true);
      const response = await api.players.read(player.nickname);
      if (response.status === '200') {
        setPlayerDetail(response.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      showNotice(
        `${t('players.fetch_detail_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (player: Player, type: 'kick' | 'ban') => {
    setSelectedPlayer(player);
    setActionType(type);
    setActionModalVisible(true);
  };

  const onConfirmAction = async () => {
    if (!selectedPlayer) return;
    try {
      setLoading(true);
      const res =
        actionType === 'kick'
          ? await api.players.kick(selectedPlayer.nickname, actionReason)
          : await api.players.ban({ name: selectedPlayer.nickname, reason: actionReason });

      if (res.status === '200') {
        showNotice(t('players.action_success', { type: t(`players.${actionType}`) }), 'success');
        setActionModalVisible(false);
        setActionReason('');
        loadPlayers();
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMute = async (player: Player, mute: boolean) => {
    try {
      const res = mute
        ? await api.players.mute(player.nickname)
        : await api.players.unmute(player.nickname);
      if (res.status === '200') {
        showNotice(mute ? t('players.mute_success') : t('players.unmute_success'), 'success');
        loadPlayers();
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    }
  };

  const handleOpenSummon = async (player: Player) => {
    setSelectedPlayer(player);
    setSummonOpen(true);
    await handleRefreshPosition(player);
  };

  const handleOpenGive = (player: Player) => {
    setSelectedPlayer(player);
    setGiveOpen(true);
  };

  const handleRefreshPosition = async (player: Player | null) => {
    const p = player || selectedPlayer;
    if (!p) return;

    setLoadingPosition(true);
    try {
      const response = await api.players.read(p.nickname);
      if (response.status === '200' && response.data?.position) {
        const parts = response.data.position.split(',');
        if (parts.length === 2) {
          setPlayerPosition({
            x: parseInt(parts[0].trim()),
            y: parseInt(parts[1].trim()),
          });
        }
      }
    } catch (error) {
      console.error('Failed to refresh player position:', error);
    } finally {
      setLoadingPosition(false);
    }
  };

  const onSummon = async (npcId: number, count: number, x: number, y: number) => {
    try {
      setLoading(true);
      const cmd = `/ssm ${npcId} ${count} ${x} ${y}`;
      const res = await api.server.executeRawCommand(cmd);
      if (res.status === '200') {
        showNotice(t('players.summon.success'), 'success');
        setSummonOpen(false);
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const onGiveItem = async (itemId: number | string, count: number) => {
    if (!selectedPlayer) return;
    try {
      setLoading(true);
      const cmd = `/give ${itemId} "${selectedPlayer.nickname}" ${count}`;
      const res = await api.server.executeRawCommand(cmd);
      if (res.status === '200') {
        showNotice(t('players.give.success'), 'success');
        setGiveOpen(false);
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGodMode = async (player: Player) => {
    try {
      setLoading(true);
      const res = await api.server.executeRawCommand(`/godmode "${player.nickname}"`);
      if (res.status === '200') {
        showNotice(t('players.godmode_success'), 'success');
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKill = async (player: Player) => {
    try {
      setLoading(true);
      const res = await api.players.kill(player.nickname);
      if (res.status === '200') {
        showNotice(t('players.kill_success'), 'success');
      }
    } catch (error) {
      showNotice(
        `${t('players.op_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // render native table

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex h-full flex-col gap-6 duration-500">
      <PageHeader
        title={t('players.title')}
        description={t('players.description')}
        icon={<UsersIcon className="text-orange-500" />}
        iconClassName="border-orange-500/20 bg-orange-500/10"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={loadPlayers}
              disabled={loading}
              icon={<RefreshCwIcon className={cn('h-4 w-4', loading && 'animate-spin')} />}
              className="border-border bg-card transition-all hover:bg-orange-500/10 hover:text-orange-500"
            >
              {t('players.refresh')}
            </Button>
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground/70 cursor-pointer text-[12px]">
                {t('players.auto_refresh')}
              </Label>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </div>
        }
      />

      <DataTableCard
        title={t('players.list_title')}
        description={t('players.list_count', { count: players.length })}
        className="mb-1"
      >
        <PlayerTable
          players={players}
          onShowDetail={handleShowDetail}
          onMute={handleMute}
          onAction={handleOpenAction}
          onSummon={handleOpenSummon}
          hasSummon={!!hasSSM}
          onGive={handleOpenGive}
          onGodMode={handleGodMode}
          onKill={handleKill}
        />
      </DataTableCard>

      <PlayerDetailSheet
        open={detailModalVisible}
        onOpenChange={setDetailModalVisible}
        player={selectedPlayer}
        detail={playerDetail}
      />

      <PlayerActionSheet
        open={actionModalVisible}
        onOpenChange={setActionModalVisible}
        player={selectedPlayer}
        actionType={actionType}
        reason={actionReason}
        onReasonChange={setActionReason}
        onConfirm={onConfirmAction}
      />

      <SummonNPCSheet
        open={summonOpen}
        onOpenChange={setSummonOpen}
        player={selectedPlayer}
        npcs={npcs}
        playerPosition={playerPosition}
        loadingPosition={loadingPosition}
        onRefreshPosition={() => handleRefreshPosition(null)}
        onSummon={onSummon}
      />

      <GiveItemSheet
        open={giveOpen}
        onOpenChange={setGiveOpen}
        player={selectedPlayer}
        items={items}
        onGive={onGiveItem}
      />
    </div>
  );
};

export default PlayerManagementPage;
