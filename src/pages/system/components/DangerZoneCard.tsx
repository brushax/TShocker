import React from 'react';
import { useTranslation } from 'react-i18next';
import { PowerIcon, RotateCcwIcon } from 'lucide-react';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/ui/button';

interface DangerZoneCardProps {
  onRestartClick: () => void;
  onShutdownClick: () => void;
  loading: boolean;
}

export const DangerZoneCard: React.FC<DangerZoneCardProps> = ({
  onRestartClick,
  onShutdownClick,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('system.danger_zone.title')}
      description={t('system.danger_zone.description')}
      icon={<PowerIcon />}
      accentColor="red"
    >
      <div className="grid gap-3">
        <Button
          variant="destructive"
          className="h-12 justify-start border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-500 transition-all hover:bg-red-500/20 hover:text-red-400"
          onClick={onRestartClick}
          disabled={loading}
          icon={<RotateCcwIcon className="h-4 w-4" />}
        >
          {t('system.danger_zone.restart')}
        </Button>
        <Button
          variant="destructive"
          className="h-12 justify-start border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-500 transition-all hover:bg-red-500/20 hover:text-red-400"
          onClick={onShutdownClick}
          disabled={loading}
          icon={<PowerIcon className="h-4 w-4" />}
        >
          {t('system.danger_zone.shutdown')}
        </Button>
      </div>
    </SectionCard>
  );
};
