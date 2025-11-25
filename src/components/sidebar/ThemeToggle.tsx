import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../../contexts/ThemeContext';

export const ThemeToggle = ({ collapsed }: { collapsed?: boolean }) => {
  const { theme, setTheme } = useTheme();

  const themes: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ];

  return (
    <div className="w-full">
      {!collapsed && (
        <label className="block text-xs font-medium text-text-secondary mb-2 px-1">
          Theme
        </label>
      )}

      <div
        className="relative flex w-full rounded-md border border-border/40 bg-bg-surface-2 p-0.5 gap-0.5"
        role="group"
        aria-label="Theme selection"
      >
        {themes.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${label} theme`}
              className={`
                relative flex items-center justify-center rounded-sm transition-all duration-200 ease-out flex-1 min-w-0
                ${collapsed
                  ? 'px-2 py-2'
                  : 'px-2.5 py-2 gap-1.5'
                }
                ${isActive
                  ? 'bg-white dark:bg-gray-800 text-text-primary shadow-sm font-medium'
                  : 'text-text-secondary hover:text-text-primary bg-transparent'
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-60'
                }`} />
              {!collapsed && (
                <span className={`text-xs font-medium transition-opacity duration-200 whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-70'
                  }`}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
