const mockStore = {
  projects: [
    {
      id: 'default-project',
      name: 'Default Project',
      description: 'Default project with standard checklist',
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  checklist: [
    {
      id: 'branch',
      title: '🏷️ Branch Naming',
      items: [
        { id: 'branch-1', text: 'Format: feature/<notionId>-<short-title>', is_checked: false },
        { id: 'branch-2', text: 'No spaces or underscores', is_checked: false },
      ],
    },
    {
      id: 'api',
      title: '🧱 API / Contract Handling',
      items: [
        { id: 'api-1', text: 'Created contract if backend not ready', is_checked: false },
        { id: 'api-2', text: 'Node mock API serves contract data', is_checked: false },
      ],
    },
  ],
};

export const getAllProjects = <T>(): T => {
  return mockStore.projects as T;
};

export const getCurrentProject = <T>(): T => {
  return (mockStore.projects.find((p) => p.is_default) ?? null) as T;
};

export const createProject = <T>(args?: Record<string, unknown>): T => {
  const newProject = {
    id: 'project-' + Date.now(),
    name: (args?.name as string) || 'New Project',
    description: (args?.description as string) || '',
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockStore.projects.push(newProject);
  return newProject as T;
};

export const switchProject = <T>(args?: Record<string, unknown>): T => {
  const projectId = args?.projectId as string;
  mockStore.projects.forEach((p) => (p.is_default = p.id === projectId));
  return null as T;
};

export const getProjectChecklist = <T>(): T => {
  return mockStore.checklist as T;
};

export const handleUnknownCommand = <T>(cmd: string): T => {
  console.warn(`[Mock Invoke] Unknown command: ${cmd}`);
  return null as T;
};
