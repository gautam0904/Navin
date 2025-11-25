import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = ({ collapsed }: { collapsed?: boolean }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full">
      {!collapsed && (
        <div className="text-xs text-text-secondary mb-2 px-1 font-medium">Theme</div>
      )}

      <div className={`flex gap-1 rounded-lg border border-border p-1 shadow-sm bg-bg-surface-2
        ${collapsed ? "justify-center" : ""}
      `}>
        <button
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 justify-center rounded-md p-2 transition-all duration-150
            ${collapsed ? "px-2" : "px-3"}
            ${theme === 'light' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-3'}
          `}
        >
          <Sun className="w-4 h-4" />
          {!collapsed && <span className="text-xs font-medium">Light</span>}
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 justify-center rounded-md p-2 transition-all duration-150
            ${collapsed ? "px-2" : "px-3"}
            ${theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-3'}
          `}
        >
          <Moon className="w-4 h-4" />
          {!collapsed && <span className="text-xs font-medium">Dark</span>}
        </button>

        <button
          onClick={() => setTheme('auto')}
          className={`flex items-center gap-2 justify-center rounded-md p-2 transition-all duration-150
            ${collapsed ? "px-2" : "px-3"}
            ${theme === 'auto' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:bg-bg-surface-3'}
          `}
        >
          <Monitor className="w-4 h-4" />
          {!collapsed && <span className="text-xs font-medium">Auto</span>}
        </button>
      </div>
    </div>
  );
};

