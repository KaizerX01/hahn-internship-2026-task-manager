import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/task.api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
} from '../types/task.types';

export const useTasks = (
  projectId: number | null,
  initialPage = 0,
  initialSize = 20,
  initialFilters?: TaskFilters
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters || {});
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks(projectId, page, size, filters);
      setTasks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, page, size, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: CreateTaskRequest) => {
    if (!projectId) throw new Error('Project ID is required');

    try {
      setError(null);
      const newTask = await taskApi.createTask(projectId, data);
      await fetchTasks(); // Refresh the list
      return newTask;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateTask = async (taskId: number, data: UpdateTaskRequest) => {
    if (!projectId) throw new Error('Project ID is required');

    try {
      setError(null);
      const updatedTask = await taskApi.updateTask(projectId, taskId, data);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!projectId) throw new Error('Project ID is required');

    try {
      setError(null);
      await taskApi.deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete task';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const toggleCompletion = async (taskId: number, completed: boolean) => {
    if (!projectId) throw new Error('Project ID is required');

    try {
      setError(null);
      const updatedTask = await taskApi.toggleCompletion(
        projectId,
        taskId,
        completed
      );
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Failed to toggle task completion';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const refresh = () => {
    fetchTasks();
  };

  const updateFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  return {
    tasks,
    loading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    filters,
    setPage,
    setSize,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    refresh,
  };
};