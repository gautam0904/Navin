import React, { createContext, useContext, useState, useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

export interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  extension?: string;
  children?: FileEntry[];
}

interface FileExplorerContextType {
  currentPath: string | null;
  fileTree: FileEntry[];
  openFolder: () => Promise<void>;
  closeFolder: () => void;
  refreshDir: (path: string) => Promise<void>;
  expandFolder: (path: string) => Promise<void>;
}

const FileExplorerContext = createContext<FileExplorerContextType | undefined>(undefined);

export const useFileExplorer = () => {
  const context = useContext(FileExplorerContext);
  if (!context) {
    throw new Error('useFileExplorer must be used within a FileExplorerProvider');
  }
  return context;
};

export const FileExplorerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileEntry[]>([]);

  const loadDir = useCallback(async (path: string) => {
    try {
      const entries = await invoke<FileEntry[]>('read_dir', { path });
      return entries;
    } catch (error) {
      console.error('Failed to read directory:', error);
      return [];
    }
  }, []);

  const openFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected && typeof selected === 'string') {
        setCurrentPath(selected);
        const entries = await loadDir(selected);
        setFileTree(entries);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  }, [loadDir]);

  const closeFolder = useCallback(() => {
    setCurrentPath(null);
    setFileTree([]);
  }, []);

  const refreshDir = useCallback(
    async (path: string) => {
      const entries = await loadDir(path);
      // TODO: Update specific node in tree if it's a subdirectory
      // For root, just setFileTree
      if (path === currentPath) {
        setFileTree(entries);
      }
    },
    [currentPath, loadDir]
  );

  const expandFolder = useCallback(
    async (path: string) => {
      // This would need a recursive update of the fileTree state
      // For now, we just fetch the data, but we need to update the tree structure
      const children = await loadDir(path);

      setFileTree((prevTree) => {
        const updateTree = (nodes: FileEntry[]): FileEntry[] => {
          return nodes.map((node) => {
            if (node.path === path) {
              return { ...node, children };
            }
            if (node.children) {
              return { ...node, children: updateTree(node.children) };
            }
            return node;
          });
        };
        return updateTree(prevTree);
      });
    },
    [loadDir]
  );

  return (
    <FileExplorerContext.Provider
      value={{ currentPath, fileTree, openFolder, closeFolder, refreshDir, expandFolder }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
};
