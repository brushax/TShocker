import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseColoredText, cn } from '@/lib/utils';

export interface CommandResult {
  id: string;
  command: string;
  timestamp: Date;
  result: string[];
  success: boolean;
}

interface TerminalConsoleProps {
  results: CommandResult[];
  useColorRendering: boolean;
  resultsEndRef: React.RefObject<HTMLDivElement | null>;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  results,
  useColorRendering,
  resultsEndRef,
}) => {
  const { t } = useTranslation();
  return (
    <ScrollArea className="flex-1 font-mono text-sm">
      <div className="flex min-h-full flex-col space-y-4 p-4">
        {results.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-slate-500 italic">
            {t('commands.terminal_ready')}
          </div>
        )}

        <div className="flex-1 space-y-4">
          {results.map((res) => (
            <div
              key={res.id}
              className="group animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-400 opacity-60 select-none">
                <span>[{res.timestamp.toLocaleTimeString()}]</span>
                <span>{t('commands.terminal_user_prefix')}</span>
                <span className="font-bold text-emerald-400">{res.command}</span>
              </div>

              <div
                className={cn(
                  'mb-2 rounded-sm border-l-2 bg-white/5 py-2 pl-4',
                  res.success ? 'border-emerald-500/30' : 'border-red-500/30'
                )}
              >
                {res.result.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      'leading-relaxed whitespace-pre-wrap',
                      res.success ? 'text-slate-200' : 'text-red-400'
                    )}
                  >
                    {useColorRendering ? parseColoredText(line) : line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div ref={resultsEndRef} />
      </div>
    </ScrollArea>
  );
};
