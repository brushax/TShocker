import React from 'react';
import { useTranslation } from 'react-i18next';
import { WrenchIcon, SaveIcon, RefreshCwIcon, BugIcon } from 'lucide-react';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/ui/button';

interface MaintenanceCardProps {
  onSave: () => void;
  onReload: () => void;
  onButcher: () => void;
  loading: boolean;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  onSave,
  onReload,
  onButcher,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('system.maintenance.title')}
      description={t('system.maintenance.description')}
      icon={<WrenchIcon />}
      accentColor="indigo"
    >
      <div className="grid gap-3">
        <Button
          variant="outline"
          className="form-input justify-start text-sm font-bold transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400"
          onClick={onSave}
          disabled={loading}
          icon={<SaveIcon className="h-4 w-4" />}
        >
          {t('system.maintenance.save_world')}
        </Button>
        <Button
          variant="outline"
          className="form-input justify-start text-sm font-bold transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400"
          onClick={onReload}
          disabled={loading}
          icon={<RefreshCwIcon className="h-4 w-4" />}
        >
          {t('system.maintenance.reload_config')}
        </Button>
        <Button
          variant="outline"
          className="form-input justify-start text-sm font-bold transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400"
          onClick={onButcher}
          disabled={loading}
          icon={<BugIcon className="h-4 w-4" />}
        >
          {t('system.maintenance.butcher_npcs')}
        </Button>
      </div>
    </SectionCard>
  );
};
