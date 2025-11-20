export const isTauri = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return '__TAURI__' in window || (typeof globalThis !== 'undefined' && '__TAURI__' in globalThis);
};

const getInvokeFunction = async () => {
  try {
    const tauriApi = await import('@tauri-apps/api/core');
    
    if (!tauriApi) {
      throw new Error('Tauri API module is undefined');
    }
    
    const invoke = tauriApi.invoke;
    
    if (!invoke) {
      console.error('Tauri API module structure:', Object.keys(tauriApi));
      throw new Error('invoke function not found in Tauri API module');
    }
    
    if (typeof invoke !== 'function') {
      throw new Error(`invoke is not a function, got: ${typeof invoke}`);
    }
    
    return invoke;
  } catch (importError: any) {
    console.error('Failed to import Tauri API:', importError);
    console.error('Error details:', {
      message: importError?.message,
      stack: importError?.stack,
      name: importError?.name
    });
    
    const inTauri = isTauri();
    
    if (!inTauri) {
      throw new Error(
        'Tauri API is not available. This application must run in a Tauri environment.\n' +
        'Please run the app using: npm run tauri dev\n' +
        'Not: npm run dev (this runs in browser without Tauri)'
      );
    }
    
    throw new Error(
      `Failed to load Tauri API: ${importError?.message || 'Unknown error'}. ` +
      'Make sure @tauri-apps/api is properly installed and the app is running in Tauri environment.'
    );
  }
};

export const safeInvoke = async <T = any>(
  cmd: string,
  args?: Record<string, any>
): Promise<T> => {
  try {
    const invoke = await getInvokeFunction();
    return await invoke<T>(cmd, args);
  } catch (error: any) {
    if (error?.message?.includes('Tauri') || error?.message?.includes('invoke')) {
      throw error;
    }

    console.error(`Failed to invoke Tauri command "${cmd}":`, error);
    throw error;
  }
};
