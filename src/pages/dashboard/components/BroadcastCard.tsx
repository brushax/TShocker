import React from 'react';
import { Volume2Icon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BroadcastCardProps {
  message: string;
  onMessageChange: (val: string) => void;
  onSend: () => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({
  message,
  onMessageChange,
  onSend,
}) => {
  const { t } = useTranslation();
  const templates = [
    {
      key: t('dashboard.broadcast.templates.maintenance'),
      text: t('dashboard.broadcast.templates.maintenance'),
    },
    {
      key: t('dashboard.broadcast.templates.welcome'),
      text: t('dashboard.broadcast.templates.welcome'),
    },
    {
      key: t('dashboard.broadcast.templates.event'),
      text: t('dashboard.broadcast.templates.event'),
    },
  ];

  return (
    <SectionCard
      title={t('dashboard.broadcast.title')}
      icon={<Volume2Icon />}
      accentColor="indigo"
      className="h-full"
    >
      <div className="space-y-3">
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={t('dashboard.broadcast.placeholder')}
            className="bg-background/50 border-input/50 focus:bg-background h-10 flex-1 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <Button
            onClick={onSend}
            disabled={!message}
            icon={<SendIcon className="h-4 w-4" />}
            className="btn-primary"
          >
            {t('dashboard.broadcast.send')}
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {templates.map((template) => (
            <Badge
              variant="secondary"
              className="cursor-pointer border-transparent px-3 py-1 transition-all hover:bg-indigo-600 hover:text-white"
              onClick={() => onMessageChange(template.text)}
              key={template.key}
            >
              {template.text}
            </Badge>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};
