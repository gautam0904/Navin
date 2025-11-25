import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!e.ctrlKey) return;

      const key = e.key.toLowerCase();
      const routeByKey: Record<string, string> = {
        '1': ROUTES.CHECKLIST,
        '2': ROUTES.PROJECTS,
        k: ROUTES.SETTINGS,
        h: ROUTES.HOME,
      };

      const route = routeByKey[key];
      if (!route) return;

      e.preventDefault();
      navigate(route);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};
