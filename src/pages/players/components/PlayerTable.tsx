import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  EyeIcon,
  Volume2Icon,
  VolumeXIcon,
  UsersIcon,
  SettingsIcon,
  GhostIcon,
  PackageIcon,
  CrownIcon,
  SkullIcon,
  ShieldAlertIcon,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Player } from '@/types';

interface PlayerTableProps {
  players: Player[];
  onShowDetail: (player: Player) => void;
  onMute: (player: Player, mute: boolean) => void;
  onAction: (player: Player, type: 'kick' | 'ban') => void;
  onSummon: (player: Player) => void;
  hasSummon?: boolean;
  onGive: (player: Player) => void;
  onGodMode: (player: Player) => void;
  onKill: (player: Player) => void;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  onShowDetail,
  onMute,
  onAction,
  onSummon,
  onGive,
  onGodMode,
  onKill,
  hasSummon = true,
}) => {
  const { t } = useTranslation();
  return (
    <Table className="w-full">
      <TableHeader className="bg-muted/40">
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="table-head w-[180px] py-4 pl-6">
            {t('players.table.nickname')}
          </TableHead>
          <TableHead className="table-head">{t('players.table.username')}</TableHead>
          <TableHead className="table-head">{t('players.table.group')}</TableHead>
          <TableHead className="table-head">{t('players.table.status')}</TableHead>
          <TableHead className="table-head">{t('players.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-muted-foreground h-64 text-center">
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="empty-avatar">
                  <UsersIcon className="h-8 w-8 opacity-20" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="empty-title">{t('players.empty')}</p>
                  <p className="text-xs italic opacity-60">{t('players.empty_desc')}</p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          players.map((p) => (
            <TableRow
              key={p.nickname}
              className="group border-border/50 hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-foreground py-4 pl-6 font-medium">
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="max-w-[120px] truncate font-semibold">{p.nickname}</span>
                      </TooltipTrigger>
                      <TooltipContent>{p.nickname}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs opacity-70">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="max-w-[100px] truncate">{p.username}</div>
                    </TooltipTrigger>
                    <TooltipContent>{p.username}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-muted/50 text-muted-foreground border-border/50"
                >
                  {p.group}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      p.active
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'bg-muted-foreground/30'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      p.active ? 'text-emerald-500' : 'text-muted-foreground opacity-70'
                    )}
                  >
                    {p.active ? t('players.online') : t('players.offline')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="bg-card/90 sticky right-0 z-10 pr-6 text-right backdrop-blur-sm">
                <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    icon={<EyeIcon />}
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={() => onShowDetail(p)}
                    title={t('players.detail')}
                  />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    icon={<GhostIcon className="h-4 w-4 text-purple-500" />}
                    className="hover:bg-purple-500/10"
                    onClick={() => onSummon(p)}
                    title={t('players.summon.title')}
                    style={{ display: hasSummon ? undefined : 'none' }}
                  />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    icon={<PackageIcon className="h-4 w-4 text-cyan-500" />}
                    className="hover:bg-cyan-500/10"
                    onClick={() => onGive(p)}
                    title={t('players.give.title')}
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        icon={<SettingsIcon className="h-4 w-4" />}
                        className="hover:bg-muted"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border bg-card w-48">
                      <DropdownMenuItem onClick={() => onMute(p, !p.muted)}>
                        {p.muted ? (
                          <Volume2Icon className="mr-2 h-4 w-4" />
                        ) : (
                          <VolumeXIcon className="mr-2 h-4 w-4" />
                        )}
                        <span>{p.muted ? t('players.unmute') : t('players.mute')}</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => onGodMode(p)}>
                        <CrownIcon className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>{t('players.godmode')}</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-border" />

                      <DropdownMenuItem
                        onClick={() => onAction(p, 'kick')}
                        className="text-orange-500 focus:bg-orange-500/10 focus:text-orange-500"
                      >
                        <ShieldAlertIcon className="mr-2 h-4 w-4" />
                        <span>{t('players.kick')}</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onAction(p, 'ban')}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <ShieldAlertIcon className="mr-2 h-4 w-4" />
                        <span>{t('players.ban')}</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onKill(p)}
                        className="font-bold text-red-600 focus:bg-red-600/10 focus:text-red-600"
                      >
                        <SkullIcon className="mr-2 h-4 w-4" />
                        <span>{t('players.kill')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
