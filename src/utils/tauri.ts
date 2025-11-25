export const isTauri = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return '__TAURI__' in window || (typeof globalThis !== 'undefined' && '__TAURI__' in globalThis);
};

// Mock Data Store
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

const getInvokeFunction = async () => {
  // Try to import Tauri API first
  try {
    const tauriApi = await import('@tauri-apps/api/core');

    if (tauriApi && tauriApi.invoke) {
      return tauriApi.invoke;
    }
    throw new Error('Tauri API found but invoke is missing');
  } catch (importError) {
    console.warn(
      'Tauri API not available or failed to load. Using mock implementation.',
      importError
    );

    // Return stateful mock implementation
    // eslint-disable-next-line complexity
    return async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
      console.log(`[Mock Invoke] ${cmd}`, args);

      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate latency

      switch (cmd) {
        case 'get_all_projects':
          return mockStore.projects as T;

        case 'get_current_project':
          return (mockStore.projects.find((p) => p.is_default) ?? null) as T;

        case 'create_project': {
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
        }

        case 'switch_project': {
          const projectId = args?.projectId as string;
          mockStore.projects.forEach((p) => (p.is_default = p.id === projectId));
          return null as T;
        }

        case 'get_project_checklist':
          // In mock mode, return the same checklist for all projects
          return mockStore.checklist as T;

        default:
          console.warn(`[Mock Invoke] Unknown command: ${cmd}`);
          return null as T;
      }
    };
  }
};

export const safeInvoke = async <T = unknown>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T> => {
  try {
    const invoke = await getInvokeFunction();
    return await invoke<T>(cmd, args);
  } catch (error: unknown) {
    const err = error as { message?: string };
    if (err?.message?.includes('Tauri') || err?.message?.includes('invoke')) {
      throw error;
    }

    console.error(`Failed to invoke Tauri command "${cmd}":`, error);
    throw error;
  }
};
