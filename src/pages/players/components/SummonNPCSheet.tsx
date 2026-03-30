import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GhostIcon, SearchIcon, MapPinIcon, RefreshCwIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Player, NPC } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SummonNPCSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  npcs: NPC[];
  onSummon: (npcId: number, count: number, x: number, y: number) => void;
  onRefreshPosition: () => void;
  playerPosition: { x: number; y: number } | null;
  loadingPosition?: boolean;
}

export const SummonNPCSheet: React.FC<SummonNPCSheetProps> = ({
  open,
  onOpenChange,
  player,
  npcs,
  onSummon,
  onRefreshPosition,
  playerPosition,
  loadingPosition = false,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [count, setCount] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  // Update position when playerPosition prop changes
  React.useEffect(() => {
    if (playerPosition) {
      setPosX(playerPosition.x);
      setPosY(playerPosition.y);
    }
  }, [playerPosition]);

  const filteredNpcs = useMemo(() => {
    if (!searchTerm.trim()) return npcs;
    const term = searchTerm.toLowerCase();
    return npcs.filter(
      (npc) =>
        npc.name.toLowerCase().includes(term) ||
        npc.internal_name.toLowerCase().includes(term) ||
        npc.id.toString().includes(term)
    );
  }, [npcs, searchTerm]);

  const handleSummon = () => {
    if (!selectedNpc) return;
    onSummon(selectedNpc.id, count, posX, posY);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border bg-card text-foreground flex flex-col border-l sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-purple-500">
            <GhostIcon className="h-6 w-6" />
            {t('players.summon.title')}
          </SheetTitle>
          <div className="text-muted-foreground text-sm">
            {t('players.summon.description', { nickname: player?.nickname })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-6">
          <div className="flex h-full flex-col gap-6">
            {/* NPC Search & List */}
            <div className="flex flex-1 flex-col gap-3 overflow-hidden">
              <Label className="text-muted-foreground table-head">
                {t('players.summon.select_npc')}
              </Label>
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="pl-10"
                  placeholder={t('players.summon.search_npc')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="panel flex-1">
                <div className="p-2">
                  {filteredNpcs.length === 0 ? (
                    <div className="text-muted-foreground py-10 text-center text-sm italic">
                      {t('players.summon.no_npc_found')}
                    </div>
                  ) : (
                    filteredNpcs.map((npc) => (
                      <div
                        key={npc.id}
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 transition-colors',
                          selectedNpc?.id === npc.id
                            ? 'bg-purple-500/20 text-purple-500 ring-1 ring-purple-500/50'
                            : 'hover:bg-muted/50 text-foreground'
                        )}
                        onClick={() => setSelectedNpc(npc)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{npc.name}</span>
                          <span className="text-muted-foreground font-mono text-[10px] opacity-70">
                            {npc.internal_name}
                          </span>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] opacity-60">
                          ID: {npc.id}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Summon Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-muted-foreground table-head">
                  {t('players.summon.count_label')}
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground table-head flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />X
                </Label>
                <Input
                  type="number"
                  value={posX}
                  onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground table-head flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />Y
                </Label>
                <Input
                  type="number"
                  value={posY}
                  onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full gap-2 text-xs"
                  onClick={onRefreshPosition}
                  disabled={loadingPosition}
                >
                  <RefreshCwIcon className={cn('h-3 w-3', loadingPosition && 'animate-spin')} />
                  {t('players.summon.refresh_position')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto pt-6">
          <div className="flex w-full gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
              onClick={handleSummon}
              disabled={!selectedNpc}
            >
              {t('players.summon.confirm', { npc: selectedNpc?.name || '...' })}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
