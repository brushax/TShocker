import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useUptime = () => {
  const { t } = useTranslation();
  const [serverStartTime, setServerStartTime] = useState<number | null>(null);
  const [currentUptime, setCurrentUptime] = useState<string>(t('dashboard.stats.calculating'));

  // Derive displayed uptime string instead of setting state in an effect

  const formatTimeComponents = useCallback(
    (days: number, hours: number, minutes: number, seconds: number): string => {
      const parts: string[] = [];
      if (days > 0) parts.push(`${days}${t('common.units.day')}`);
      if (hours > 0 || days > 0) parts.push(`${hours}${t('common.units.hour')}`);
      if (minutes > 0 || hours > 0) parts.push(`${minutes}${t('common.units.minute')}`);
      parts.push(`${seconds}${t('common.units.second')}`);
      return parts.join(' ') || `0${t('common.units.second')}`;
    },
    [t]
  );

  const parseUptime = useCallback(
    (uptimeString: string): { formatted: string; startTime: number } => {
      if (!uptimeString || uptimeString === 'Unknown') {
        return { formatted: t('common.unknown'), startTime: 0 };
      }
      let days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0;

      const dotSplit = uptimeString.split('.');

      if (dotSplit.length === 2 && dotSplit[0].includes(':')) {
        // hh:mm:ss.ms case?
      } else if (dotSplit.length >= 2) {
        // days.hh:mm:ss
        days = parseInt(dotSplit[0]) || 0;
        const timePart = dotSplit[1];
        const timeParts = timePart.split(':');
        if (timeParts.length >= 3) {
          hours = parseInt(timeParts[0]) || 0;
          minutes = parseInt(timeParts[1]) || 0;
          seconds = parseInt(timeParts[2]) || 0;
        }
      } else {
        // hh:mm:ss
        const timeParts = uptimeString.split(':');
        if (timeParts.length === 3) {
          hours = parseInt(timeParts[0]) || 0;
          minutes = parseInt(timeParts[1]) || 0;
          seconds = parseInt(timeParts[2]) || 0;
        }
      }

      const totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
      const startTime = Date.now() - totalSeconds * 1000;
      const formatted = formatTimeComponents(days, hours, minutes, seconds);
      return { formatted, startTime };
    },
    [formatTimeComponents, t]
  );

  const updateLocalUptime = useCallback(() => {
    if (serverStartTime) {
      const totalSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setCurrentUptime(formatTimeComponents(days, hours, minutes, seconds));
    }
  }, [serverStartTime, formatTimeComponents]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (serverStartTime) {
      interval = setInterval(updateLocalUptime, 1000);
    }
    return () => clearInterval(interval);
  }, [serverStartTime, updateLocalUptime]);

  const setServerStartTimeFromUptime = useCallback(
    (uptimeString: string) => {
      const { formatted, startTime } = parseUptime(uptimeString);
      setCurrentUptime(formatted);
      setServerStartTime(startTime);
    },
    [parseUptime]
  );

  const displayedUptime = serverStartTime ? currentUptime : t('dashboard.stats.calculating');

  return {
    currentUptime: displayedUptime,
    setServerStartTimeFromUptime,
  };
};
