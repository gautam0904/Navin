import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listen } from '@tauri-apps/api/event';
import { ROUTES } from '../constants/routes';
import { useFileExplorer } from '../contexts/FileExplorerContext';

export const MenuHandler = () => {
  const navigate = useNavigate();
  const { openFolder } = useFileExplorer();

  useEffect(() => {
    const unlistenPromises = [
      listen('menu:new-project', () => {
        navigate(`${ROUTES.PROJECTS}?action=new`);
      }),
      listen('menu:open', () => {
        navigate(ROUTES.PROJECTS);
      }),
      listen('menu:open_folder', () => {
        openFolder();
      }),
      listen('menu:export', () => {
        navigate(ROUTES.CHECKLIST);
      }),
      listen('menu:import', () => {
        navigate(ROUTES.CHECKLIST);
      }),

      listen('menu:new-section', () => {
        navigate(ROUTES.CHECKLIST);
      }),
      listen('menu:reset-progress', () => {
        navigate(ROUTES.CHECKLIST);
      }),

      listen('menu:view-stats', () => {
        navigate(ROUTES.PROJECTS);
      }),
      listen('menu:progress-report', () => {
        navigate(ROUTES.HOME);
      }),

      listen('menu:preferences', () => {
        navigate(ROUTES.SETTINGS);
      }),
      listen('menu:about', () => {
        navigate(ROUTES.ABOUT);
      }),
    ];

    return () => {
      unlistenPromises.forEach((p) => p.then((unlisten) => unlisten()));
    };
  }, [navigate, openFolder]);

  return null;
};
