import { useState, useEffect } from 'react';
import { taskApi } from '../api/task.api';
import type { Task } from '../types/task.types';

export const useTask = (projectId: number | null, taskId: number | null) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !taskId) {
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const taskData = await taskApi.getTask(projectId, taskId);
        setTask(taskData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch task');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  return { task, loading, error };
};