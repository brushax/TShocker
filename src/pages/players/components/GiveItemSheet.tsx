import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PackageIcon, SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Player, Item } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GiveItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  items: Item[];
  onGive: (itemId: number | string, count: number) => void;
}

export const GiveItemSheet: React.FC<GiveItemSheetProps> = ({
  open,
  onOpenChange,
  player,
  items,
  onGive,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [count, setCount] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.internal_name.toLowerCase().includes(term) ||
        item.id.toString().includes(term)
    );
  }, [items, searchTerm]);

  const handleGive = () => {
    if (!selectedItem) return;
    onGive(selectedItem.id, count);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border bg-card text-foreground flex flex-col border-l sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-cyan-500">
            <PackageIcon className="h-6 w-6" />
            {t('players.give.title')}
          </SheetTitle>
          <div className="text-muted-foreground text-sm">
            {t('players.give.description', { nickname: player?.nickname })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden py-6">
          <div className="flex h-full flex-col gap-6">
            {/* Item Search & List */}
            <div className="flex flex-1 flex-col gap-3 overflow-hidden">
              <Label className="text-muted-foreground table-head">
                {t('players.give.select_item')}
              </Label>
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="pl-10"
                  placeholder={t('players.give.search_item')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="panel flex-1">
                <div className="p-2">
                  {filteredItems.length === 0 ? (
                    <div className="text-muted-foreground py-10 text-center text-sm italic">
                      {t('players.give.no_item_found')}
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 transition-colors',
                          selectedItem?.id === item.id
                            ? 'bg-cyan-500/20 text-cyan-500 ring-1 ring-cyan-500/50'
                            : 'hover:bg-muted/50 text-foreground'
                        )}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{item.name}</span>
                          <span className="text-muted-foreground font-mono text-[10px] opacity-70">
                            {item.internal_name}
                          </span>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] opacity-60">
                          ID: {item.id}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Give Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground table-head">
                  {t('players.give.count_label')}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={2147483647}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
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
              className="flex-1 bg-cyan-600 text-white hover:bg-cyan-700"
              onClick={handleGive}
              disabled={!selectedItem}
            >
              {t('players.give.confirm', { item: selectedItem?.name || '...' })}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
