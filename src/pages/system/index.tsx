import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsIcon } from 'lucide-react';
import api from '@/api';
import { PageHeader } from '@/components/PageHeader';
import { useNotice } from '@/hooks/use-notice';

// Sub-components
import { MaintenanceCard } from './components/MaintenanceCard';
import { DangerZoneCard } from './components/DangerZoneCard';
import { RestartSheet } from './components/RestartSheet';
import { ShutdownSheet } from './components/ShutdownSheet';

const SystemManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [restartVisible, setRestartVisible] = useState(false);
  const [shutdownVisible, setShutdownVisible] = useState(false);
  const [restartMessage, setRestartMessage] = useState('');
  const [restartNoSave, setRestartNoSave] = useState(false);
  const [shutdownMessage, setShutdownMessage] = useState('');
  const [shutdownNoSave, setShutdownNoSave] = useState(false);
  const { showNotice } = useNotice();

  const handleAction = async (action: () => Promise<{ status: string }>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await action();
      if (res.status === '200') showNotice(successMsg, 'success');
    } catch (error) {
      showNotice(
        t('system.notices.action_failed', {
          error: error instanceof Error ? error.message : String(error),
        }),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    // TShock doesn't have a native /restart endpoint in RestManager.cs
    // We can use rawcmd if needed, or follow what the user had.
    // Assuming the user wants to keep the functionality if it worked:
    await handleAction(
      () =>
        api.server.executeRawCommand(
          `/restart ${restartNoSave ? '-nosave' : ''} ${restartMessage}`
        ),
      t('system.notices.restart_sent')
    );
    setRestartVisible(false);
    setRestartMessage('');
    setRestartNoSave(false);
  };

  const handleShutdown = async () => {
    await handleAction(
      () => api.server.shutdown(true, shutdownMessage, shutdownNoSave),
      t('system.notices.shutdown_sent')
    );
    setShutdownVisible(false);
    setShutdownMessage('');
    setShutdownNoSave(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-6 duration-500">
      <PageHeader
        title={t('system.title')}
        description={t('system.description')}
        icon={<SettingsIcon className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MaintenanceCard
          onSave={() => handleAction(() => api.world.save(), t('system.notices.world_saved'))}
          onReload={() =>
            handleAction(() => api.server.reload(), t('system.notices.config_reloaded'))
          }
          onButcher={() =>
            handleAction(() => api.world.butcher(), t('system.notices.butcher_success'))
          }
          loading={loading}
        />

        <DangerZoneCard
          onRestartClick={() => setRestartVisible(true)}
          onShutdownClick={() => setShutdownVisible(true)}
          loading={loading}
        />
      </div>

      <RestartSheet
        open={restartVisible}
        onOpenChange={setRestartVisible}
        message={restartMessage}
        onMessageChange={setRestartMessage}
        noSave={restartNoSave}
        onNoSaveChange={setRestartNoSave}
        onConfirm={handleRestart}
      />

      <ShutdownSheet
        open={shutdownVisible}
        onOpenChange={setShutdownVisible}
        message={shutdownMessage}
        onMessageChange={setShutdownMessage}
        noSave={shutdownNoSave}
        onNoSaveChange={setShutdownNoSave}
        onConfirm={handleShutdown}
      />
    </div>
  );
};

export default SystemManagementPage;
