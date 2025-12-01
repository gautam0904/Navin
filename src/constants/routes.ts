export const ROUTES = {
  HOME: '/',
  CHECKLIST: '/checklist',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  ABOUT: '/about',
  GIT: '/git',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
