import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useTheme, type Theme } from '@/app/providers/ThemeProvider';

interface ThemeOption {
  value: Theme;
  icon: typeof Sun;
  label: string;
}

export const ThemeToggle = ({ collapsed }: { collapsed?: boolean }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const themes = useMemo<ThemeOption[]>(
    () => [
      { value: 'light', icon: Sun, label: 'Light' },
      { value: 'dark', icon: Moon, label: 'Dark' },
      { value: 'auto', icon: Monitor, label: 'Auto' },
    ],
    []
  );

  const currentTheme = useMemo(
    () => themes.find((t) => t.value === theme) || themes[2],
    [theme, themes]
  );

  const updateModalPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top,
        left: rect.right + 8,
      });
    }
  }, []);

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      setIsOpen(false);
    },
    [setTheme]
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleResize = () => {
      updateModalPosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updateModalPosition]);

  useEffect(() => {
    if (isOpen) {
      updateModalPosition();
    }
  }, [isOpen, updateModalPosition]);

  if (collapsed) {
    return (
      <>
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className={`
            flex items-center justify-center w-10 h-10 rounded-md
            border border-gray-700 bg-gray-800
            transition-all duration-200 hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isOpen ? 'bg-gray-700 border-gray-600' : ''}
          `}
          aria-label="Change theme"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <currentTheme.icon className="w-4 h-4 text-gray-300" />
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-50 bg-gray-800 border border-gray-700 rounded-md shadow-xl p-2 backdrop-blur-sm"
              style={modalPosition}
              role="menu"
              aria-orientation="vertical"
            >
              <div className="flex items-center gap-1">
                {themes.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded
                      transition-all duration-150
                      hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${
                        theme === value
                          ? 'bg-gray-700 text-white ring-1 ring-gray-600'
                          : 'text-gray-400 hover:text-white'
                      }
                    `}
                    aria-label={label}
                    title={label}
                    role="menuitemradio"
                    aria-checked={theme === value}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-400 mb-2 px-1" id="theme-group-label">
        Theme
      </label>

      <div
        className="relative flex w-full rounded-md border border-gray-700 bg-gray-800 p-0.5 gap-0.5"
        role="radiogroup"
        aria-labelledby="theme-group-label"
      >
        {themes.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${label} theme`}
              className={`
                relative flex items-center justify-center rounded-sm transition-all duration-200 ease-out flex-1 min-w-0
                px-2.5 py-2 gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                ${
                  isActive
                    ? 'bg-gray-700 text-white shadow-sm font-medium'
                    : 'text-gray-400 hover:text-white bg-transparent'
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}
              />
              <span
                className={`text-xs font-medium transition-opacity duration-200 whitespace-nowrap ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
