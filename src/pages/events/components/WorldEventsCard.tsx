import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GlobeIcon,
  MoonIcon,
  CircleIcon,
  SunIcon,
  ZapIcon,
  WindIcon,
  CloudRainIcon,
  DropletsIcon,
  SwordsIcon,
  AnchorIcon,
  GhostIcon,
  SnowflakeIcon,
  OrbitIcon,
} from 'lucide-react';
import { SectionCard } from '@/components/SectionCard';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WORLD_EVENTS = [
  {
    id: 'bloodmoon',
    labelKey: 'events.list.bloodmoon',
    icon: <MoonIcon className="h-4 w-4" />,
    color: 'text-red-500',
  },
  {
    id: 'fullmoon',
    labelKey: 'events.list.fullmoon',
    icon: <CircleIcon className="h-4 w-4" />,
    color: 'text-slate-300',
  },
  {
    id: 'eclipse',
    labelKey: 'events.list.eclipse',
    icon: <SunIcon className="h-4 w-4" />,
    color: 'text-orange-500',
  },
  {
    id: 'meteor',
    labelKey: 'events.list.meteor',
    icon: <ZapIcon className="h-4 w-4" />,
    color: 'text-amber-500',
  },
  {
    id: 'sandstorm',
    labelKey: 'events.list.sandstorm',
    icon: <WindIcon className="h-4 w-4" />,
    color: 'text-yellow-600',
  },
  {
    id: 'rain',
    labelKey: 'events.list.rain',
    icon: <CloudRainIcon className="h-4 w-4" />,
    color: 'text-blue-400',
  },
  {
    id: 'rain slime',
    labelKey: 'events.list.rain_slime',
    icon: <DropletsIcon className="h-4 w-4" />,
    color: 'text-green-400',
  },
  {
    id: 'invasion goblins',
    labelKey: 'events.list.inv_goblins',
    icon: <SwordsIcon className="h-4 w-4" />,
    color: 'text-indigo-400',
  },
  {
    id: 'invasion pirates',
    labelKey: 'events.list.inv_pirates',
    icon: <AnchorIcon className="h-4 w-4" />,
    color: 'text-slate-400',
  },
  {
    id: 'invasion pumpkinmoon',
    labelKey: 'events.list.inv_pumpkin',
    icon: <GhostIcon className="h-4 w-4" />,
    color: 'text-orange-600',
  },
  {
    id: 'invasion frostmoon',
    labelKey: 'events.list.inv_frost',
    icon: <SnowflakeIcon className="h-4 w-4" />,
    color: 'text-blue-200',
  },
  {
    id: 'invasion martians',
    labelKey: 'events.list.inv_martians',
    icon: <OrbitIcon className="h-4 w-4" />,
    color: 'text-emerald-400',
  },
  {
    id: 'invasion snowmen',
    labelKey: 'events.list.inv_snowmen',
    icon: <SnowflakeIcon className="h-4 w-4" />,
    color: 'text-slate-200',
  },
  {
    id: 'party',
    labelKey: 'events.list.party',
    icon: <ZapIcon className="h-4 w-4" />,
    color: 'text-pink-400',
  },
];

interface WorldEventsCardProps {
  onTrigger: (id: string, label: string) => void;
  onAutosaveToggle: (checked: boolean) => void;
  loading: boolean;
}

export const WorldEventsCard: React.FC<WorldEventsCardProps> = ({
  onTrigger,
  onAutosaveToggle,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('events.title')}
      description={t('events.description')}
      icon={<GlobeIcon />}
      accentColor="blue"
      actions={
        <div className="flex items-center gap-4 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 shadow-inner">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-widest text-blue-400/70 uppercase">
              {t('events.autosave')}
            </span>
          </div>
          <Switch
            onCheckedChange={onAutosaveToggle}
            defaultChecked={true}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {WORLD_EVENTS.map((event) => (
          <Button
            key={event.id}
            variant="outline"
            className={cn(
              'group border-border bg-background/40 flex h-24 flex-col items-center justify-center gap-2 transition-all hover:border-current hover:bg-current/5',
              event.color
            )}
            onClick={() => onTrigger(event.id, t(event.labelKey))}
            disabled={loading}
          >
            <div className="transition-transform duration-300 group-hover:scale-125 group-active:scale-95">
              {event.icon}
            </div>
            <span className="text-xs font-bold">{t(event.labelKey)}</span>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
};
