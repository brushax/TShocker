import React from 'react';
import { TerminalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/SectionCard';
import { Badge } from '@/components/ui/badge';
import { parseColoredText } from '@/lib/utils';

interface MotdCardProps {
  motd: string[];
}

export const MotdCard: React.FC<MotdCardProps> = ({ motd }) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('dashboard.motd.title')}
      icon={<TerminalIcon />}
      accentColor="emerald"
      noPadding
      className="h-full"
      actions={
        <Badge variant="outline" className="font-mono text-[10px] opacity-50">
          MOTD
        </Badge>
      }
    >
      <div className="custom-scrollbar h-[120px] space-y-1.5 overflow-y-auto bg-slate-950 p-3 font-mono text-xs text-white">
        {motd.length > 0 ? (
          motd.map((line, i) => (
            <div
              key={i}
              className="group border-l-2 border-emerald-500/30 py-0.5 pl-3 leading-relaxed transition-colors hover:border-emerald-500/60"
            >
              {parseColoredText(line)}
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] text-slate-500 italic">
            {t('dashboard.motd.empty')}
          </div>
        )}
      </div>
    </SectionCard>
  );
};
