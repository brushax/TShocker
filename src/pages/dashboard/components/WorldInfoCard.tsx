import React from 'react';
import { ServerIcon, ActivityIcon, SunIcon, ClockIcon, MoonIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/SectionCard';
import { DetailRow } from '@/components/DetailRow';
import { WorldInfo, ServerStatus } from '@/types';

interface WorldInfoCardProps {
  worldInfo: WorldInfo | null;
  serverInfo: ServerStatus | null;
}

export const WorldInfoCard: React.FC<WorldInfoCardProps> = ({ worldInfo }) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('dashboard.world.title')}
      icon={<ServerIcon />}
      accentColor="blue"
      className="h-full"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
        <DetailRow
          label={t('dashboard.world.invasion_size')}
          value={worldInfo ? worldInfo.invasionsize : '-'}
          icon={<ActivityIcon />}
        />
        <DetailRow
          label={t('dashboard.world.time')}
          value={
            worldInfo
              ? worldInfo.daytime
                ? t('dashboard.world.day')
                : t('dashboard.world.night')
              : '-'
          }
          icon={<SunIcon />}
        />
        <DetailRow
          label={t('dashboard.world.game_tick')}
          value={worldInfo?.time?.toString() || '-'}
          icon={<ClockIcon />}
        />
        <DetailRow
          label={t('dashboard.world.blood_moon')}
          value={worldInfo?.bloodmoon ? t('dashboard.world.on') : t('dashboard.world.off')}
          icon={<MoonIcon />}
        />
      </div>
    </SectionCard>
  );
};
