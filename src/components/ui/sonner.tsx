import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background/80 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3',
          description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-xs',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium',
          success: '[&_[data-icon]]:text-emerald-500',
          error: '[&_[data-icon]]:text-destructive',
          info: '[&_[data-icon]]:text-blue-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
