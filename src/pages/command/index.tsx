import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CodeIcon, Trash2Icon, ClockIcon, PaletteIcon } from 'lucide-react';
import api from '@/api';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { TerminalConsole, CommandResult } from '@/pages/command/components/TerminalConsole';
import { CommandInput } from '@/pages/command/components/CommandInput';
import { ALL_COMMANDS } from '@/pages/command/constants';

const CommandExecutionPage: React.FC = () => {
  const { t } = useTranslation();
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [useColorRendering, setUseColorRendering] = useState(() => {
    const saved = localStorage.getItem('tshocker_use_color_rendering');
    return saved !== null ? saved === 'true' : true;
  });
  const [results, setResults] = useState<CommandResult[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('tshocker_command_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('tshocker_command_history', JSON.stringify(commandHistory));
  }, [commandHistory]);

  useEffect(() => {
    localStorage.setItem('tshocker_use_color_rendering', useColorRendering.toString());
  }, [useColorRendering]);

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results]);

  useEffect(() => {
    if (command && command.startsWith('/')) {
      const filtered = ALL_COMMANDS.filter(
        (cmd) =>
          cmd.toLowerCase().startsWith(command.toLowerCase()) &&
          cmd.toLowerCase() !== command.toLowerCase()
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [command]);

  const executeCommand = async (cmdToExecute?: string) => {
    const finalCommand = cmdToExecute || command.trim();
    if (!finalCommand) return;

    setLoading(true);
    const commandId = Date.now().toString();
    const timestamp = new Date();

    try {
      const response = await api.server.executeRawCommand(finalCommand);
      const output = response.data?.response || [];

      const result: CommandResult = {
        id: commandId,
        command: finalCommand,
        timestamp,
        result: Array.isArray(output) ? output : [output.toString()],
        success: response.status === '200',
      };

      setResults((prev) => [...prev, result]);

      if (!cmdToExecute) {
        setCommandHistory((prev) =>
          [finalCommand, ...prev.filter((c) => c !== finalCommand)].slice(0, 50)
        );
        setCommand('');
        setHistoryIndex(-1);
        setShowSuggestions(false);
      }
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          id: commandId,
          command: finalCommand,
          timestamp,
          result: [
            t('commands.execute_failed') +
              ': ' +
              (error instanceof Error ? error.message : String(error)),
          ],
          success: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (index: number) => {
    if (index >= 0 && index < suggestions.length) {
      setCommand(suggestions[index]);
      setShowSuggestions(false);
      // Give a little delay to ensure the input box can focus correctly
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (suggestionIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestionIndex);
          return;
        } else if (e.key === 'Tab') {
          e.preventDefault();
          selectSuggestion(0);
          return;
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex h-[calc(100vh-160px)] flex-col gap-6 duration-500">
      <PageHeader
        title={t('commands.title')}
        description={t('commands.description')}
        icon={<CodeIcon className="h-6 w-6 text-emerald-500" />}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResults([])}
            icon={<Trash2Icon className="h-4 w-4" />}
            className="text-muted-foreground hover:text-destructive"
          >
            {t('commands.clear')}
          </Button>
        }
      />

      <Card className="flex min-h-0 w-full flex-1 flex-col gap-0 overflow-hidden rounded-lg p-0 shadow transition-all duration-300">
        <div className="flex items-center justify-between rounded-t-lg border-b border-slate-800 bg-slate-900/80 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="ml-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] shadow-sm" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] shadow-sm" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] shadow-sm" />
            </div>

            <span className="flex items-center justify-center text-slate-400">
              <ClockIcon className="h-4 w-4" />
            </span>

            <h3 className="text-muted-foreground/70 font-mono">
              {t('commands.console_simulator')}
            </h3>
          </div>

          <div className="flex items-center gap-3 pr-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="color-toggle"
                  className="text-muted-foreground/70 cursor-pointer font-mono text-[10px] tracking-wider uppercase"
                >
                  <PaletteIcon className="inline-block h-3 w-3" />
                  {t('commands.color_rendering')}
                </Label>
                <Switch
                  id="color-toggle"
                  checked={useColorRendering}
                  onCheckedChange={setUseColorRendering}
                  className="h-4 w-7 data-[state=checked]:bg-emerald-500 [&>span]:h-3 [&>span]:w-3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
          <TerminalConsole
            results={results}
            useColorRendering={useColorRendering}
            resultsEndRef={resultsEndRef}
          />
          <CommandInput
            command={command}
            setCommand={setCommand}
            loading={loading}
            onKeyDown={handleKeyDown}
            onExecute={() => executeCommand()}
            inputRef={inputRef}
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            suggestionIndex={suggestionIndex}
            onSelectSuggestion={selectSuggestion}
          />
        </div>
      </Card>
    </div>
  );
};

export default CommandExecutionPage;
