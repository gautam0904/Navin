import {
  getAllProjects,
  getCurrentProject,
  createProject,
  switchProject,
  getProjectChecklist,
  handleUnknownCommand,
} from './mockHandlers';

export const isTauri = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return '__TAURI__' in window || (typeof globalThis !== 'undefined' && '__TAURI__' in globalThis);
};

const handleMockCommand = <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result: T;

      if (cmd === 'get_all_projects') {
        result = getAllProjects<T>();
      } else if (cmd === 'get_current_project') {
        result = getCurrentProject<T>();
      } else if (cmd === 'create_project') {
        result = createProject<T>(args);
      } else if (cmd === 'switch_project') {
        result = switchProject<T>(args);
      } else if (cmd === 'get_project_checklist') {
        result = getProjectChecklist<T>();
      } else {
        result = handleUnknownCommand<T>(cmd);
      }

      resolve(result);
    }, 100); // Simulate latency
  });
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

    return async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
      console.log(`[Mock Invoke] ${cmd}`, args);
      return handleMockCommand<T>(cmd, args);
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
