import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../api/project.api';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsPageResponse,
} from '../types/project.types';

export const useProjects = (initialPage = 0, initialSize = 10) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectApi.getProjects(page, size);
      setProjects(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: CreateProjectRequest) => {
    try {
      setError(null);
      const newProject = await projectApi.createProject(data);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create project';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateProject = async (id: number, data: UpdateProjectRequest) => {
    try {
      setError(null);
      const updatedProject = await projectApi.updateProject(id, data);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );
      return updatedProject;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update project';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      setError(null);
      await projectApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete project';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const refresh = () => {
    fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize,
    createProject,
    updateProject,
    deleteProject,
    refresh,
  };
};

