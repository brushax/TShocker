import React, { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { MinusIcon, SquareIcon, XIcon, FoldVerticalIcon, LanguagesIcon } from 'lucide-react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/context/AppContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const Titlebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useAppContext();
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    // Tauri v2 listeners return a promise that resolves to an unlisten function
    const setupListeners = async () => {
      // Get initial state
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);

      // Listen for resize to update icon
      const un = await appWindow.onResized(async () => {
        const isMax = await appWindow.isMaximized();
        setIsMaximized(isMax);
      });
      unlisten = un;
    };

    setupListeners();

    return () => {
      if (unlisten) unlisten();
    };
  }, [appWindow]);

  const handleMinimize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await appWindow.minimize();
  };

  const handleMaximize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await appWindow.toggleMaximize();
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await appWindow.close();
  };

  const toggleTheme = () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: 'SET_THEME', payload: next });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="border-border bg-background flex h-10 w-full flex-none items-center justify-between overflow-hidden border-b select-none">
      {/* Left side: Menu button and title - only the button is clickable, other parts are draggable */}
      <div className="z-10 flex h-full items-center">
        <div className="flex h-full flex-none items-center px-2">{children}</div>
      </div>

      {/* Center padding: Full drag region */}
      <div data-tauri-drag-region className="h-full flex-1 cursor-default" />

      {/* Right side: Control buttons - must be top level and without drag-region */}
      <div className="relative z-20 flex h-full items-center gap-1 bg-transparent px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
              title={t('nav.language')}
            >
              <LanguagesIcon size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-sidebar-border bg-popover p-1 shadow-lg"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center justify-between gap-8 rounded-md px-2 py-1.5 text-xs"
              onClick={() => changeLanguage('zh-CN')}
            >
              <span>{t('nav.zh')}</span>
              {i18n.language === 'zh-CN' && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center justify-between gap-8 rounded-md px-2 py-1.5 text-xs"
              onClick={() => changeLanguage('en')}
            >
              <span>{t('nav.en')}</span>
              {i18n.language === 'en' && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={toggleTheme}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground mr-1 flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          title={t('titlebar.toggle_theme')}
        >
          {state.theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </button>

        <div className="border-border/30 ml-1 flex h-full items-center border-l">
          <button
            onClick={handleMinimize}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-full items-center justify-center px-4 transition-colors"
            title={t('titlebar.minimize')}
          >
            <MinusIcon size={14} className="pointer-events-none" />
          </button>
          <button
            onClick={handleMaximize}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-full items-center justify-center px-4 transition-colors"
            title={isMaximized ? t('titlebar.restore') : t('titlebar.maximize')}
          >
            {isMaximized ? (
              <FoldVerticalIcon size={14} className="pointer-events-none" />
            ) : (
              <SquareIcon size={12} className="pointer-events-none" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground flex h-full items-center justify-center px-4 transition-colors"
            title={t('titlebar.close')}
          >
            <XIcon size={14} className="pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Titlebar;
