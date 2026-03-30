import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CommandInputProps {
  command: string;
  setCommand: (cmd: string) => void;
  loading: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  showSuggestions: boolean;
  suggestions: string[];
  suggestionIndex: number;
  onSelectSuggestion: (index: number) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  command,
  setCommand,
  loading,
  onKeyDown,
  onExecute,
  inputRef,
  showSuggestions,
  suggestions,
  suggestionIndex,
  onSelectSuggestion,
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full flex-none border-t border-white/10 bg-black/40 p-4">
      <div className="relative">
        {showSuggestions && suggestions.length > 0 && (
          <div className="border-border bg-popover absolute bottom-full left-0 z-50 mb-2 w-full max-w-xs overflow-hidden rounded-md border shadow-lg">
            <ScrollArea className="max-h-60">
              <div className="p-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className={cn(
                      'w-full rounded-sm px-3 py-2 text-left text-sm transition-colors',
                      index === suggestionIndex
                        ? 'bg-emerald-500/10 font-medium text-emerald-500'
                        : 'hover:bg-muted text-foreground'
                    )}
                    onClick={() => onSelectSuggestion(index)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="h-12 border-white/10 bg-slate-900 pl-10 font-mono text-slate-100 shadow-inner focus-visible:ring-emerald-500/50 sm:text-sm"
          placeholder={t('commands.input_placeholder')}
          autoFocus
        />
        <div className="absolute top-1/2 left-3 -translate-y-1/2 animate-pulse font-mono text-emerald-500">
          {'>'}
        </div>
        <Button
          size="sm"
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
          onClick={onExecute}
          disabled={loading || !command.trim()}
        >
          {t('commands.send')}
        </Button>
      </div>
      <div className="flex-none bg-slate-950 px-4 pt-2">
        <div className="flex justify-between px-1 font-mono text-[10px] font-medium tracking-wider text-slate-500 uppercase select-none">
          <span>
            <kbd className="rounded border border-white/20 bg-white/5 px-1">Enter</kbd>{' '}
            {t('commands.press_enter_to_send')} <span className="mx-1">•</span>
            <kbd className="rounded border border-white/20 bg-white/5 px-1">Tab</kbd>{' '}
            {t('commands.press_tab_to_complete')}
          </span>
          <span>
            {t('commands.use_keys')}{' '}
            <kbd className="rounded border border-white/20 bg-white/5 px-1">↑</kbd>{' '}
            <kbd className="rounded border border-white/20 bg-white/5 px-1">↓</kbd>{' '}
            {t('commands.press_arrow_to_history')}
          </span>
        </div>
      </div>
    </div>
  );
};
