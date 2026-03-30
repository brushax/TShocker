import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import {
  RefreshCwIcon,
  SaveIcon,
  ClockIcon,
  GlobeIcon,
  NetworkIcon,
  ActivityIcon,
  UsersIcon,
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import api from '@/api';
import { ServerStatus, WorldInfo } from '@/types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotice } from '@/hooks/use-notice';

// Sub-components
import { WorldInfoCard } from './components/WorldInfoCard';
import { MotdCard } from './components/MotdCard';
import { BroadcastCard } from './components/BroadcastCard';
import { RulesCard } from './components/RulesCard';

// Hooks
import { useUptime } from './hooks/useUptime';

const ServerStatusPage: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerStatus | null>(null);
  const [worldInfo, setWorldInfo] = useState<WorldInfo | null>(null);
  const [motd, setMotd] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const { showNotice } = useNotice();
  const { currentUptime, setServerStartTimeFromUptime } = useUptime();
  const isInitialMount = React.useRef(true);

  const loadServerData = useCallback(
    async (isRefresh = false) => {
      if (!state.isAuthenticated) return;

      if (isRefresh) setRefreshing(true);
      else if (isInitialMount.current) setLoading(true);

      try {
        // Parallel requests for better performance feeling
        const [statusRes, worldRes, rulesRes, motdRes] = await Promise.allSettled([
          api.server.getStatus(),
          api.world.read(),
          api.server.getRules(),
          api.server.getMotd(),
        ]);

        // Handle Status
        if (statusRes.status === 'fulfilled' && statusRes.value.status === '200') {
          const data = statusRes.value.data;
          if (data) {
            setServerInfo(data);
            if (data.uptime) {
              setServerStartTimeFromUptime(data.uptime);
            }
          }
        }

        // Handle World Info
        if (worldRes.status === 'fulfilled' && worldRes.value.status === '200') {
          if (worldRes.value.data) {
            setWorldInfo(worldRes.value.data);
          }
        }

        // Handle Rules
        if (rulesRes.status === 'fulfilled' && rulesRes.value.data) {
          setRules(rulesRes.value.data.rules || []);
        }

        // Handle MOTD
        if (motdRes.status === 'fulfilled' && motdRes.value.data) {
          setMotd(motdRes.value.data.motd || []);
        }

        if (isRefresh) {
          showNotice(t('dashboard.status.refreshed'), 'success');
        }
      } catch (error) {
        console.error('Failed to load server data:', error);
        showNotice(t('dashboard.status.load_failed'), 'error');
      } finally {
        setLoading(false);
        setRefreshing(false);
        isInitialMount.current = false;
      }
    },
    [state.isAuthenticated, setServerStartTimeFromUptime, showNotice, t]
  );

  // Initial Load
  useEffect(() => {
    loadServerData();
  }, [loadServerData]);

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      await api.server.broadcast(broadcastMessage);
      setBroadcastMessage('');
      showNotice(t('dashboard.status.broadcast_success'), 'success');
    } catch (error) {
      showNotice(
        `${t('dashboard.status.broadcast_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    }
  };

  const handeSaveWorld = async () => {
    try {
      await api.world.save();
      showNotice(t('dashboard.status.save_success'), 'success');
    } catch (error) {
      showNotice(
        `${t('dashboard.status.save_failed')}: ${error instanceof Error ? error.message : String(error)}`,
        'error'
      );
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md gap-0 border-2 border-dashed p-0">
          <CardContent className="text-muted-foreground pt-10 pb-10 text-center">
            {t('common.login_required')}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex h-full flex-col gap-6 duration-500">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.description')}
        icon={<ActivityIcon className="text-blue-500" />}
        iconClassName="border-blue-500/20 bg-blue-500/10"
        actions={
          <div className="flex gap-2">
            {serverInfo && (
              <div className="mr-4 hidden items-center gap-2 lg:flex">
                <Badge
                  variant="outline"
                  className="h-6 border-blue-500/20 bg-blue-500/5 px-2 text-[10px] text-blue-500"
                >
                  Terraria {serverInfo.serverversion}
                </Badge>
                <Badge
                  variant="outline"
                  className="h-6 border-purple-500/20 bg-purple-500/5 px-2 text-[10px] text-purple-500"
                >
                  TShock {serverInfo.tshockversion}
                </Badge>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadServerData(true)}
              disabled={refreshing || loading}
              icon={<RefreshCwIcon className={cn('h-4 w-4', refreshing && 'animate-spin')} />}
            >
              {t('common.refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handeSaveWorld}
              icon={<SaveIcon className="h-4 w-4" />}
            >
              {t('common.save')}
            </Button>
          </div>
        }
      />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-2">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t('dashboard.stats.world_name')}
              value={worldInfo?.name || t('common.unknown')}
              icon={<GlobeIcon />}
              loading={loading && !worldInfo}
              subtext={worldInfo?.size || t('dashboard.stats.size_unknown')}
            />
            <StatCard
              title={t('dashboard.stats.online_players')}
              value={`${serverInfo?.playercount || 0} / ${serverInfo?.maxplayers || 16}`}
              icon={<UsersIcon />}
              loading={loading && !serverInfo}
              subtext={t('dashboard.stats.connections')}
            />
            <StatCard
              title={t('dashboard.stats.uptime')}
              value={
                currentUptime === t('dashboard.stats.calculating')
                  ? t('dashboard.stats.calculating')
                  : currentUptime
              }
              icon={<ClockIcon />}
              loading={loading && currentUptime === t('dashboard.stats.calculating')}
              subtext={t('dashboard.stats.uptime_subtext')}
            />
            <StatCard
              title={t('dashboard.stats.port_addr')}
              value={serverInfo?.port?.toString() || '7777'}
              icon={<NetworkIcon />}
              loading={loading && !serverInfo}
              subtext={t('dashboard.stats.port_subtext')}
            />
          </div>

          {/* Main Content Grid */}
          <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <WorldInfoCard worldInfo={worldInfo} serverInfo={serverInfo} />
            <BroadcastCard
              message={broadcastMessage}
              onMessageChange={setBroadcastMessage}
              onSend={handleBroadcast}
            />
            <MotdCard motd={motd} />
            <RulesCard rules={rules} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerStatusPage;
