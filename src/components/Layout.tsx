import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTranslation } from 'react-i18next';
import api from '@/api';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Titlebar from './Titlebar';
import { useNotice } from '@/hooks/use-notice';

interface AppLayoutProps {
  children: React.ReactNode;
}

// We compute the content margin based on the real sidebar state coming
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { state, dispatch } = useAppContext();
  const [open, setOpen] = React.useState(true);
  const { showNotice } = useNotice();

  useEffect(() => {
    const checkServerStatus = async () => {
      if (state.isAuthenticated && state.serverUrl) {
        try {
          const response = await api.server.getStatus();
          if (response.status === '200') {
            dispatch({ type: 'SET_SERVER_STATUS', payload: response.data ?? null });
          }
        } catch (error) {
          showNotice(
            `${t('common.get_status_failed')}: ${(error as Error).message || t('common.unknown')}`,
            'error'
          );
        }
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.serverUrl, dispatch, showNotice, t]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset className="bg-background relative flex h-screen flex-1 flex-col overflow-hidden">
        {/* Move background noise to internal main to avoid blocking drag/click events on the titlebar */}

        <Titlebar>
          <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-accent-foreground relative h-8 w-8 border-none" />
        </Titlebar>

        <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="mx-auto flex h-full min-h-full w-full max-w-[1600px] flex-col px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
