import { useEffect, useState } from 'react';
import api from '@/api';
import type { UserInfoResponse } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/AppContext';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import avatarSrc from '@/assets/avatar.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOutIcon, EllipsisVerticalIcon, CodeIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getCurrentWebview } from '@tauri-apps/api/webview';

export default function NavUser() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [userGroup, setUserGroup] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const loadUserGroup = async () => {
      try {
        if (!state.username) return;
        const res = await api.users.read(state.username, 'name');
        if (mounted && res && res.status === '200' && res.data) {
          const data = res.data as UserInfoResponse;
          setUserGroup(data.group ?? null);
        }
      } catch {
        // ignore
      }
    };
    loadUserGroup();
    return () => {
      mounted = false;
    };
  }, [state.username]);

  const handleLogout = async () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { replace: true });
  };

  const toggleDevMode = async (checked: boolean) => {
    dispatch({ type: 'SET_DEV_MODE', payload: checked });

    // In Tauri 2.0, if checked is true, we should enable inspector
    if (checked && window && window.__TAURI_INTERNALS__) {
      try {
        // Wait a tiny bit for the state to persist in localStorage if index.tsx reads from it
        setTimeout(async () => {
          const webview = getCurrentWebview();
          const devtoolsApi = webview as unknown as { openDevtools: () => Promise<void> };
          if (devtoolsApi && typeof devtoolsApi.openDevtools === 'function') {
            await devtoolsApi.openDevtools();
          }
        }, 100);
      } catch (err) {
        console.warn('Failed to open DevTools via API:', err);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group hover:bg-sidebar-accent flex w-full items-center gap-3 overflow-visible rounded-lg p-2 transition-all duration-200">
          <div className="relative">
            <Avatar className="border-sidebar-border h-9 w-9 border transition-colors group-hover:border-blue-500/50">
              <AvatarImage src={avatarSrc} />
            </Avatar>
            <div className="border-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-emerald-500" />
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sidebar-foreground group-hover:text-sidebar-accent-foreground truncate text-xs font-semibold select-none">
                    {state.username}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{state.username}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground truncate text-[10px] font-medium tracking-wide select-none">
                    {userGroup || t('nav.unassigned')}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{userGroup || t('nav.unassigned')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <EllipsisVerticalIcon className="text-muted-foreground/30 group-hover:text-muted-foreground h-4 w-4 transition-all" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border-sidebar-border bg-popover text-popover-foreground w-56 p-1.5 shadow-xl"
        align="start"
        side="right"
      >
        <DropdownMenuLabel className="text-muted-foreground/60 px-2 py-2 text-[10px] font-bold tracking-widest uppercase">
          {t('nav.account')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-muted my-1" />

        <div className="hover:bg-accent focus:bg-accent flex items-center justify-between rounded-md px-2 py-2 transition-colors">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CodeIcon className="h-4 w-4" />
            <span>{t('nav.dev_mode')}</span>
          </div>
          <Switch
            checked={state.devMode}
            onCheckedChange={toggleDevMode}
            className="scale-75 data-[state=checked]:bg-blue-500"
          />
        </div>

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10 focus:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOutIcon className="h-4 w-4" />
          <span className="font-medium">{t('nav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
