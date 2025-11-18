/**
 * Tauri utilities
 * Helper functions to check Tauri availability and safely invoke commands
 */

/**
 * Check if running in Tauri environment
 * This is a best-effort check - the actual test is trying to invoke
 */
export const isTauri = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for Tauri v2 __TAURI__ object
  // Note: This might not be available immediately, so we'll also try to invoke anyway
  return '__TAURI__' in window || (typeof globalThis !== 'undefined' && '__TAURI__' in globalThis);
};

/**
 * Get the invoke function dynamically
 * This handles cases where the import might fail
 */
const getInvokeFunction = async () => {
  try {
    const tauriApi = await import('@tauri-apps/api/core');
    
    // Check if the module loaded correctly
    if (!tauriApi) {
      throw new Error('Tauri API module is undefined');
    }
    
    // Try to get invoke from the module
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
    
    // Only show the "not in Tauri" error if we're definitely not in Tauri
    // Otherwise, it might be a different issue (like module loading)
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

/**
 * Safely invoke a Tauri command
 * This will work when running in Tauri desktop app
 */
export const safeInvoke = async <T = any>(
  cmd: string,
  args?: Record<string, any>
): Promise<T> => {
  try {
    const invoke = await getInvokeFunction();
    return await invoke<T>(cmd, args);
  } catch (error: any) {
    // If it's already our custom error, re-throw it
    if (error?.message?.includes('Tauri') || error?.message?.includes('invoke')) {
      throw error;
    }

    // Log the actual error for debugging
    console.error(`Failed to invoke Tauri command "${cmd}":`, error);
    throw error;
  }
};

