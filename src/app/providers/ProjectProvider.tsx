import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ProjectService, Project } from '@services';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  loadCurrentProject: () => Promise<void>;
  switchProject: (projectId: string) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<void>;
  updateProject: (projectId: string, name: string, description?: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allProjects = await ProjectService.getAllProjects();
      setProjects(allProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCurrentProject = useCallback(async () => {
    try {
      const project = await ProjectService.getCurrentProject();
      setCurrentProject(project);
    } catch (err) {
      console.error('Failed to load current project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load current project');
    }
  }, []);

  const switchProject = useCallback(
    async (projectId: string) => {
      try {
        await ProjectService.switchProject(projectId);
        await loadCurrentProject();
        // Reload page to update checklist data
        window.location.reload();
      } catch (err) {
        console.error('Failed to switch project:', err);
        alert(err instanceof Error ? err.message : 'Failed to switch project');
      }
    },
    [loadCurrentProject]
  );

  const createProject = useCallback(
    async (name: string, description?: string) => {
      try {
        await ProjectService.createProject(name, description);
        await loadProjects();
      } catch (err) {
        console.error('Failed to create project:', err);
        alert(err instanceof Error ? err.message : 'Failed to create project');
        throw err;
      }
    },
    [loadProjects]
  );

  const updateProject = useCallback(
    async (projectId: string, name: string, description?: string) => {
      try {
        await ProjectService.updateProject(projectId, name, description);
        await loadProjects();
        await loadCurrentProject();
      } catch (err) {
        console.error('Failed to update project:', err);
        alert(err instanceof Error ? err.message : 'Failed to update project');
        throw err;
      }
    },
    [loadProjects, loadCurrentProject]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        await ProjectService.deleteProject(projectId);
        await loadProjects();
        // If deleted project was current, reload current
        if (currentProject?.id === projectId) {
          await loadCurrentProject();
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete project');
        throw err;
      }
    },
    [loadProjects, loadCurrentProject, currentProject]
  );

  const refreshProjects = useCallback(async () => {
    await Promise.all([loadProjects(), loadCurrentProject()]);
  }, [loadProjects, loadCurrentProject]);

  // Load on mount
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        isLoading,
        error,
        loadProjects,
        loadCurrentProject,
        switchProject,
        createProject,
        updateProject,
        deleteProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
