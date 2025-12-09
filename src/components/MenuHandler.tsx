import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listen } from '@tauri-apps/api/event';
import { ROUTES } from '../constants/routes';
import { useFileExplorer } from '../contexts/FileExplorerContext';
import { useGit } from '../contexts/GitContext';

export const MenuHandler = () => {
  const navigate = useNavigate();
  const { openFolder } = useFileExplorer();
  const { setSelectedFile } = useGit();

  useEffect(() => {
    const handleOpenFile = (e: Event) => {
      const ce = e as CustomEvent<{ path: string }>;
      const filePath = ce.detail?.path;
      if (filePath) {
        navigate(`/editor?path=${encodeURIComponent(filePath)}`);
      }
    };
    window.addEventListener('open-file', handleOpenFile as (e: Event) => void);

    const handleViewChanges = (e: Event) => {
      const ce = e as CustomEvent<{ path: string }>;
      const filePath = ce.detail?.path;
      if (filePath) {
        setSelectedFile(filePath);
        navigate(ROUTES.GIT);
      }
    };
    window.addEventListener('view-changes', handleViewChanges as (e: Event) => void);

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
      window.removeEventListener('open-file', handleOpenFile as (e: Event) => void);
      window.removeEventListener('view-changes', handleViewChanges as (e: Event) => void);
      unlistenPromises.forEach((p) => p.then((unlisten) => unlisten()));
    };
  }, [navigate, openFolder, setSelectedFile]);

  return null;
};
