import api from './axios';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksPageResponse,
  TaskFilters,
} from '../types/task.types';

export const taskApi = {
  // Get all tasks for a project with pagination and filters
  getTasks: async (
    projectId: number,
    page = 0,
    size = 20,
    filters?: TaskFilters
  ): Promise<TasksPageResponse> => {
    const params: any = { page, size, sort: 'id' };
    
    if (filters?.completed !== undefined) {
      params.completed = filters.completed;
    }
    
    if (filters?.search) {
      params.search = filters.search;
    }

    const response = await api.get<TasksPageResponse>(
      `/projects/${projectId}/tasks`,
      { params }
    );
    return response.data;
  },

  // Get a single task by ID
  getTask: async (projectId: number, taskId: number): Promise<Task> => {
    const response = await api.get<Task>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  },

  // Create a new task
  createTask: async (
    projectId: number,
    data: CreateTaskRequest
  ): Promise<Task> => {
    const response = await api.post<Task>(
      `/projects/${projectId}/tasks`,
      data
    );
    return response.data;
  },

  // Update an existing task
  updateTask: async (
    projectId: number,
    taskId: number,
    data: UpdateTaskRequest
  ): Promise<Task> => {
    const response = await api.put<Task>(
      `/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  // Delete a task
  deleteTask: async (projectId: number, taskId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  // Mark task as completed (legacy endpoint)
  markCompleted: async (
  projectId: number,
  taskId: number
): Promise<Task> => {
  const response = await api.patch<Task>(
    `/projects/${projectId}/tasks/${taskId}/complete`,
    null
  );
  return response.data;
},

toggleCompletion: async (
  projectId: number,
  taskId: number,
  completed: boolean
): Promise<Task> => {
  const response = await api.patch<Task>(
    `/projects/${projectId}/tasks/${taskId}/completion`,
    null,
    { params: { completed } }
  );
  return response.data;
},

};