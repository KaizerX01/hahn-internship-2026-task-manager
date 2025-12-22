export interface Project {
  id: number;
  title: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface UpdateProjectRequest {
  title: string;
  description?: string;
}

export interface ProjectProgressResponse {
  projectId: number;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface ProjectsPageResponse {
  content: Project[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}