import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/SectionCard';
import { parseColoredText } from '@/lib/utils';

interface RulesCardProps {
  rules: string[];
}

export const RulesCard: React.FC<RulesCardProps> = ({ rules }) => {
  const { t } = useTranslation();
  return (
    <SectionCard
      title={t('dashboard.rules.title')}
      icon={<ShieldCheckIcon />}
      accentColor="red"
      noPadding
      className="h-full"
    >
      <div className="custom-scrollbar h-[120px] space-y-2 overflow-y-auto bg-slate-950 p-3">
        {rules.length > 0 ? (
          rules.map((rule, i) => (
            <div
              key={i}
              className="group flex items-start gap-2 border-l-2 border-red-500/20 py-1 pl-3 text-sm transition-colors hover:border-red-500/50 hover:bg-white/5"
            >
              <span className="font-mono font-bold text-red-500">{i + 1}.</span>
              <span className="text-slate-200">{parseColoredText(rule)}</span>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 italic">
            {t('dashboard.rules.empty')}
          </div>
        )}
      </div>
    </SectionCard>
  );
};
