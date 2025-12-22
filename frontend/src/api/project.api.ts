import api from './axios';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectProgressResponse,
  ProjectsPageResponse,
} from '../types/project.types';

export const projectApi = {
  // Get all projects with pagination
  getProjects: async (page = 0, size = 10): Promise<ProjectsPageResponse> => {
    const response = await api.get<ProjectsPageResponse>('/projects', {
      params: { page, size, sort: 'id' },
    });
    return response.data;
  },

  // Get a single project by ID
  getProject: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  // Update an existing project
  updateProject: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project
  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Get project progress
  getProjectProgress: async (id: number): Promise<ProjectProgressResponse> => {
    const response = await api.get<ProjectProgressResponse>(`/projects/${id}/progress`);
    return response.data;
  },
};
