import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserIcon,
  MapPinIcon,
  ShieldIcon,
  GlobeIcon,
  ActivityIcon,
  PackageIcon,
  InfoIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player, PlayerDetail } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionCard } from '@/components/SectionCard';

interface PlayerDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
  detail: PlayerDetail | null;
}

export const PlayerDetailSheet: React.FC<PlayerDetailSheetProps> = ({
  open,
  onOpenChange,
  player,
  detail,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border bg-card w-[400px] border-l p-0 sm:w-[540px]"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="bg-muted/30 border-b px-6 py-6">
            <SheetTitle className="text-foreground flex items-center gap-3 text-2xl">
              <div className="bg-primary/20 border-primary/20 flex h-12 w-12 items-center justify-center rounded-xl border shadow-inner">
                <UserIcon className="text-primary h-6 w-6" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span>{player?.nickname}</span>
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase"
                >
                  {detail?.group || player?.group}
                </Badge>
              </div>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-6 pb-20">
              {detail && (
                <>
                  {/* Basic & Connection Info */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SectionCard
                      title={t('players.detail_sheet.connection_info')}
                      icon={<GlobeIcon className="h-4 w-4" />}
                      accentColor="blue"
                    >
                      <div className="space-y-4 py-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-[10px] font-bold uppercase opacity-60">
                            {t('players.table.ip')}
                          </span>
                          <span className="font-mono text-sm">{detail.ip || 'Unavailable'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase opacity-60">
                              {t('players.detail_sheet.status')}
                            </span>
                            <div className="flex">
                              {detail.muted ? (
                                <Badge
                                  variant="destructive"
                                  className="border-destructive/20 bg-destructive/10"
                                >
                                  {t('players.detail_sheet.muted')}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                >
                                  {t('players.detail_sheet.normal')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                    <SectionCard
                      title={t('players.detail_sheet.reg_status')}
                      icon={<ShieldIcon className="h-4 w-4" />}
                      accentColor="indigo"
                    >
                      <div className="space-y-4 py-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-[10px] font-bold uppercase opacity-60">
                            {t('players.detail_sheet.reg_status')}
                          </span>
                          <span className="text-sm">
                            {detail.registered ? (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                              >
                                {detail.registered}
                              </Badge>
                            ) : (
                              t('players.detail_sheet.unregistered')
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase opacity-60">
                              {t('players.table.username')}
                            </span>
                            <span className="font-mono text-sm">
                              {detail.username || t('players.detail_sheet.unregistered')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* Position & Location */}
                  <SectionCard
                    title={t('players.detail_sheet.position')}
                    icon={<MapPinIcon className="h-4 w-4" />}
                    accentColor="emerald"
                    showWindowControls
                  >
                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-[10px] font-bold uppercase opacity-60">
                          {t('players.detail_sheet.position')}
                        </span>
                        <span className="font-mono text-lg font-bold text-emerald-500">
                          {detail.position}
                        </span>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                        <ActivityIcon className="h-6 w-6 text-emerald-500" />
                      </div>
                    </div>
                  </SectionCard>

                  {/* Inventory Summary */}
                  <div className="grid grid-cols-1 gap-4">
                    <SectionCard
                      title={t('players.detail_sheet.inventory')}
                      icon={<PackageIcon className="h-4 w-4" />}
                      accentColor="slate"
                    >
                      <div className="max-h-[100px] overflow-y-auto py-2">
                        <p className="text-muted-foreground font-mono text-xs leading-relaxed opacity-80">
                          {detail.inventory || 'No items found'}
                        </p>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title={t('players.detail_sheet.buffs')}
                      icon={<InfoIcon className="h-4 w-4" />}
                      accentColor="slate"
                    >
                      <div className="max-h-[80px] overflow-y-auto py-2">
                        <p className="text-muted-foreground font-mono text-xs opacity-80">
                          {detail.buffs || 'No active buffs'}
                        </p>
                      </div>
                    </SectionCard>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <SheetFooter className="bg-muted/30 absolute right-0 bottom-0 left-0 border-t px-6 py-4">
            <Button
              variant="outline"
              className="border-border hover:bg-muted w-full"
              onClick={() => onOpenChange(false)}
            >
              {t('players.detail_sheet.close')}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
