export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string | null;
}

export interface ToggleTaskCompletionRequest {
  completed: boolean;
}

export interface TasksPageResponse {
  content: Task[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface TaskFilters {
  completed?: boolean;
  search?: string;
}