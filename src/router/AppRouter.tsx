import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { HomePage } from '../pages/HomePage';
import { ChecklistPage } from '../pages/checkList/ChecklistPage';
import { ProjectsPage } from '../pages/project/ProjectsPage';
import { SettingsPage } from '../pages/setting/SettingsPage';
import { AboutPage } from '../pages/AboutPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.CHECKLIST} element={<ChecklistPage />} />
      <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

