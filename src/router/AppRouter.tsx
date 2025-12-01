import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { HomePage, AboutPage, NotFoundPage } from '../pages';
import { ChecklistPage } from '../features/checklist';
import { ProjectsPage } from '../features/projects';
import { SettingsPage } from '../features/settings';
import { GitLayout } from '../layouts/GitLayout';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.CHECKLIST} element={<ChecklistPage />} />
      <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path="/git" element={<GitLayout />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
