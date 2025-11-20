import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full">
      <div className="text-xs text-text-secondary dark:text-regent-gray font-medium mb-2 px-1">Theme</div>
      <div className="flex gap-1 bg-bg-surface-2 dark:bg-bg-surface-2 rounded-lg border border-border-light dark:border-border-medium p-1 shadow-sm">
        <button
          onClick={() => setTheme('light')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ${theme === 'light'
            ? 'bg-primary dark:bg-accent text-text-inverse dark:text-text-inverse shadow-sm'
            : 'text-text-secondary dark:text-loblolly hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary dark:hover:text-accent'
            }`}
          title="Light theme"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ${theme === 'dark'
            ? 'bg-primary dark:bg-accent text-text-inverse dark:text-text-inverse shadow-sm'
            : 'text-text-secondary dark:text-loblolly hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary dark:hover:text-accent'
            }`}
          title="Dark theme"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
        <button
          onClick={() => setTheme('auto')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ${theme === 'auto'
            ? 'bg-primary dark:bg-accent text-text-inverse dark:text-text-inverse shadow-sm'
            : 'text-text-secondary dark:text-loblolly hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary dark:hover:text-accent'
            }`}
          title="Auto (follow system preference)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Auto</span>
        </button>
      </div>
    </div>
  );
};

