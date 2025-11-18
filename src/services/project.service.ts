import { ChecklistSection } from '../types/checklist';
import { safeInvoke } from '../utils/tauri';

// Match the Rust ProjectRow structure
export interface Project {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

// Helper to map backend ProjectRow to frontend Project
const mapProject = (project: any): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  created_at: project.created_at,
  updated_at: project.updated_at,
  is_default: project.is_default,
});

/**
 * Project Service
 * Manages projects - each project has its own checklist data
 */
export class ProjectService {
  /**
   * Get all projects
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await safeInvoke<any[]>('get_all_projects');
      return projects.map(mapProject);
    } catch (error) {
      console.error('Failed to get projects:', error);
      throw error;
    }
  }

  /**
   * Get current active project
   */
  static async getCurrentProject(): Promise<Project | null> {
    try {
      const project = await safeInvoke<any | null>('get_current_project');
      return project ? mapProject(project) : null;
    } catch (error) {
      console.error('Failed to get current project:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  static async createProject(name: string, description?: string): Promise<Project> {
    try {
      const project = await safeInvoke<any>('create_project', { name, description });
      return mapProject(project);
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  /**
   * Update project details
   */
  static async updateProject(projectId: string, name: string, description?: string): Promise<void> {
    try {
      await safeInvoke('update_project', { projectId, name, description });
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string): Promise<void> {
    try {
      await safeInvoke('delete_project', { projectId });
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  /**
   * Switch to a project (set as active)
   */
  static async switchProject(projectId: string): Promise<void> {
    try {
      await safeInvoke('switch_project', { projectId });
    } catch (error) {
      console.error('Failed to switch project:', error);
      throw error;
    }
  }

  /**
   * Get checklist data for a specific project
   */
  static async getProjectChecklist(projectId: string): Promise<ChecklistSection[]> {
    try {
      return await safeInvoke<ChecklistSection[]>('get_project_checklist', { projectId });
    } catch (error) {
      console.error('Failed to get project checklist:', error);
      throw error;
    }
  }
}

