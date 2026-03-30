import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NavUser from '@/components/NavUser';
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  CodeIcon,
  SettingsIcon,
  TreePineIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  GlobeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const siderbarGroups: {
    groupName: string;
    items: { key: string; icon: React.ReactNode; label: string; color: string }[];
  }[] = [
    {
      groupName: t('sidebar.groups.overview'),
      items: [
        {
          key: '/',
          icon: <HomeIcon className="h-4 w-4" />,
          label: t('sidebar.items.dashboard'),
          color: 'text-blue-400',
        },
      ],
    },
    {
      groupName: t('sidebar.groups.management'),
      items: [
        {
          key: '/players',
          icon: <UsersIcon className="h-4 w-4" />,
          label: t('sidebar.items.players'),
          color: 'text-orange-400',
        },
        {
          key: '/users',
          icon: <UserIcon className="h-4 w-4" />,
          label: t('sidebar.items.users'),
          color: 'text-indigo-400',
        },
        {
          key: '/groups',
          icon: <ShieldCheckIcon className="h-4 w-4" />,
          label: t('sidebar.items.groups'),
          color: 'text-violet-400',
        },
        {
          key: '/bans',
          icon: <ShieldAlertIcon className="h-4 w-4" />,
          label: t('sidebar.items.bans'),
          color: 'text-red-400',
        },
      ],
    },
    {
      groupName: t('sidebar.groups.server'),
      items: [
        {
          key: '/events',
          icon: <GlobeIcon className="h-4 w-4" />,
          label: t('sidebar.items.events'),
          color: 'text-cyan-400',
        },
        {
          key: '/commands',
          icon: <CodeIcon className="h-4 w-4" />,
          label: t('sidebar.items.commands'),
          color: 'text-emerald-400',
        },
        {
          key: '/system',
          icon: <SettingsIcon className="h-4 w-4" />,
          label: t('sidebar.items.system'),
          color: 'text-slate-400',
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sidebar className="border-sidebar-border bg-sidebar text-sidebar-foreground h-full border-r backdrop-blur-xl">
      <SidebarHeader data-tauri-drag-region className="border-sidebar-border/50 border-b p-2">
        <div data-tauri-drag-region className="flex h-14 items-center gap-3 px-3">
          <div className="flex size-9 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
            <TreePineIcon className="h-5 w-5 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
          <div data-tauri-drag-region className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-cyan-300">
              TShocker
            </span>
            <span className="text-muted-foreground/60 mt-1 text-[9px] font-medium tracking-[0.1em] uppercase">
              Server Helper
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar gap-0 overflow-x-hidden px-2 py-4">
        <SidebarMenu>
          {siderbarGroups.map((group) => (
            <SidebarGroup key={group.groupName} className="p-0 pb-6">
              <SidebarGroupLabel className="text-muted-foreground/60 mb-2 px-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {group.groupName}
              </SidebarGroupLabel>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = currentPath === item.key;

                  const themeMap: Record<
                    string,
                    { text: string; bg: string; border: string; dot: string; rgb: string }
                  > = {
                    'text-blue-400': {
                      text: 'text-blue-600 dark:text-blue-400',
                      bg: 'bg-blue-500/10',
                      border: 'border-blue-500/20',
                      dot: 'bg-blue-500',
                      rgb: '59, 130, 246',
                    },
                    'text-cyan-400': {
                      text: 'text-cyan-600 dark:text-cyan-400',
                      bg: 'bg-cyan-500/10',
                      border: 'border-cyan-500/20',
                      dot: 'bg-cyan-500',
                      rgb: '6, 182, 212',
                    },
                    'text-indigo-400': {
                      text: 'text-indigo-600 dark:text-indigo-400',
                      bg: 'bg-indigo-500/10',
                      border: 'border-indigo-500/20',
                      dot: 'bg-indigo-500',
                      rgb: '129, 140, 248',
                    },
                    'text-emerald-400': {
                      text: 'text-emerald-600 dark:text-emerald-400',
                      bg: 'bg-emerald-500/10',
                      border: 'border-emerald-500/20',
                      dot: 'bg-emerald-500',
                      rgb: '52, 211, 153',
                    },
                    'text-orange-400': {
                      text: 'text-orange-600 dark:text-orange-400',
                      bg: 'bg-orange-500/10',
                      border: 'border-orange-500/20',
                      dot: 'bg-orange-500',
                      rgb: '251, 146, 60',
                    },
                    'text-red-400': {
                      text: 'text-red-600 dark:text-red-400',
                      bg: 'bg-red-500/10',
                      border: 'border-red-500/20',
                      dot: 'bg-red-500',
                      rgb: '239, 68, 68',
                    },
                    'text-violet-400': {
                      text: 'text-violet-600 dark:text-violet-400',
                      bg: 'bg-violet-500/10',
                      border: 'border-violet-500/20',
                      dot: 'bg-violet-500',
                      rgb: '167, 139, 250',
                    },
                    'text-slate-400': {
                      text: 'text-foreground/70',
                      bg: 'bg-muted',
                      border: 'border-border',
                      dot: 'bg-muted-foreground',
                      rgb: '148, 163, 184',
                    },
                  };

                  const theme =
                    themeMap[item.color || 'text-blue-400'] || themeMap['text-blue-400'];

                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => handleMenuClick({ key: item.key })}
                        tooltip={item.label}
                        className={`group h-10 w-full justify-start gap-3 rounded-lg px-4 py-2 transition-all duration-200 ${
                          isActive
                            ? `${theme.text} ${theme.bg} border ${theme.border} shadow-sm shadow-black/5`
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:scale-[0.98]'
                        } `}
                      >
                        <span
                          className={`flex items-center justify-center transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                        >
                          {React.isValidElement(item.icon)
                            ? React.cloneElement(
                                item.icon as React.ReactElement<{
                                  size?: number;
                                  className?: string;
                                }>,
                                {
                                  size: 18,
                                  className: cn(
                                    'transition-all',
                                    theme.text,
                                    isActive
                                      ? `drop-shadow-[0_0_8px_rgba(${theme.rgb},0.35)]`
                                      : 'opacity-80 group-hover:opacity-100'
                                  ),
                                }
                              )
                            : item.icon}
                        </span>
                        <span className="text-sm font-medium tracking-tight">{item.label}</span>
                        {isActive && (
                          <div
                            className={`ml-auto h-1.5 w-1.5 rounded-full ${theme.dot} shadow-[0_0_10px_rgba(${theme.rgb},0.6)]`}
                          />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </div>
            </SidebarGroup>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
