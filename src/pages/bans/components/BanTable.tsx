import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { BanIcon, Trash2Icon, RefreshCwIcon, ShieldAlertIcon } from 'lucide-react';
import { Ban } from '@/types';

interface BanTableProps {
  bans: Ban[];
  loading: boolean;
  searchQuery: string;
  onDelete: (ban: Ban) => void;
}

// Helper to convert .NET ticks to JS Date
const parseTicks = (ticks: number) => {
  if (!ticks || ticks === 0) return null;
  // .NET ticks are 100ns intervals since 0001-01-01
  // JS dates are ms since 1970-01-01
  const epochTicks = 621355968000000000;
  const ticksPerMillisecond = 10000;
  const msSinceEpoch = (ticks - epochTicks) / ticksPerMillisecond;
  return new Date(msSinceEpoch);
};

export const BanTable: React.FC<BanTableProps> = ({ bans, loading, searchQuery, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-transparent">
          <TableHead className="table-head w-[80px] pl-6">{t('bans.table.number')}</TableHead>
          <TableHead className="table-head">{t('bans.table.target')}</TableHead>
          <TableHead className="table-head">{t('bans.table.reason')}</TableHead>
          <TableHead className="table-head">{t('bans.table.start_date')}</TableHead>
          <TableHead className="table-head">{t('bans.table.end_date')}</TableHead>
          <TableHead className="table-head">{t('bans.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCwIcon className="h-6 w-6 animate-spin opacity-20" />
                <span>{t('bans.loading')}</span>
              </div>
            </TableCell>
          </TableRow>
        ) : bans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground h-64 text-center">
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="empty-avatar">
                  <ShieldAlertIcon className="h-8 w-8 opacity-20" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="empty-title">
                    {searchQuery ? t('bans.not_found') : t('bans.empty')}
                  </p>
                  <p className="text-xs italic opacity-60">
                    {searchQuery ? t('bans.try_refine_search') : t('bans.no_ban_records_desc')}
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          bans.map((ban) => (
            <TableRow
              key={ban.ticket_number}
              className="border-border/50 group hover:bg-muted/40 transition-colors"
            >
              <TableCell className="pl-6 font-mono text-sm opacity-70">
                #{ban.ticket_number}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <BanIcon className="h-4 w-4 text-red-500/70" />
                  <span className="font-medium">{ban.identifier}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {ban.reason || t('bans.no_reason')}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {parseTicks(ban.start_date_ticks)?.toLocaleDateString() || t('bans.permanent')}
              </TableCell>
              <TableCell className="text-sm">
                {ban.end_date_ticks &&
                ban.end_date_ticks > 0 &&
                BigInt(ban.end_date_ticks) < 3155378975999999999n ? (
                  <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-500">
                    {parseTicks(Number(ban.end_date_ticks))?.toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    {t('bans.permanent')}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(ban)}
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
