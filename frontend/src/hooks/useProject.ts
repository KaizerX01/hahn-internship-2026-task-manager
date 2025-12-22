import { useState, useEffect } from 'react';
import { projectApi } from '../api/project.api';
import type { Project, ProjectProgressResponse } from '../types/project.types';

export const useProject = (id: number | null) => {
  const [project, setProject] = useState<Project | null>(null);
  const [progress, setProgress] = useState<ProjectProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const [projectData, progressData] = await Promise.all([
          projectApi.getProject(id),
          projectApi.getProjectProgress(id),
        ]);
        setProject(projectData);
        setProgress(progressData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, progress, loading, error };
};