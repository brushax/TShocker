import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeIcon } from 'lucide-react';
import api from '@/api';
import { PageHeader } from '@/components/PageHeader';
import { useNotice } from '@/hooks/use-notice';
import { WorldEventsCard } from './components/WorldEventsCard';

const WorldEventsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { showNotice } = useNotice();

  const handleAction = async (action: () => Promise<{ status: string }>, successMsg: string) => {
    try {
      setLoading(true);
      const res = await action();
      if (res.status === '200') showNotice(successMsg, 'success');
    } catch (error) {
      showNotice(
        t('events.notices.action_failed', {
          error: error instanceof Error ? error.message : String(error),
        }),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-6 duration-500">
      <PageHeader
        title={t('events.title')}
        description={t('events.description')}
        icon={<GlobeIcon className="text-cyan-500" />}
        iconClassName="border-cyan-500/20 bg-cyan-500/10"
      />

      <div className="grid grid-cols-1 gap-6">
        <WorldEventsCard
          onTrigger={(id, label) =>
            handleAction(
              () => api.world.triggerEvent(id),
              t('events.notices.event_triggered', { label })
            )
          }
          onAutosaveToggle={(checked) =>
            handleAction(
              () => api.world.setAutosave(checked),
              checked ? t('events.notices.autosave_enabled') : t('events.notices.autosave_disabled')
            )
          }
          loading={loading}
        />
      </div>
    </div>
  );
};

export default WorldEventsPage;
