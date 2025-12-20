package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.task.CreateTaskRequest;
import com.hahn.projectmanager.dto.task.TaskResponse;
import com.hahn.projectmanager.dto.task.UpdateTaskRequest;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.Task;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.AccessDeniedException;
import com.hahn.projectmanager.exception.ProjectNotFoundException;
import com.hahn.projectmanager.exception.TaskNotFoundException;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    /**
     * Get all tasks for a project with optional filtering
     */
    public Page<TaskResponse> getTasks(
            Long projectId,
            Boolean completed,
            String search,
            Pageable pageable,
            User user
    ) {
        Project project = findProjectAndCheckOwnership(projectId, user);

        Page<Task> page;

        // Use search query if search parameter is provided
        if (search != null && !search.trim().isEmpty()) {
            page = taskRepository.searchTasks(project, completed, search, pageable);
        } else if (completed == null) {
            page = taskRepository.findByProject(project, pageable);
        } else {
            page = taskRepository.findByProjectAndCompleted(project, completed, pageable);
        }

        return page.map(this::mapToResponse);
    }

    /**
     * Get a single task by ID
     */
    public TaskResponse getTaskById(Long projectId, Long taskId, User user) {
        Project project = findProjectAndCheckOwnership(projectId, user);
        Task task = findTaskAndCheckProject(taskId, project);
        return mapToResponse(task);
    }

    /**
     * Create a new task
     */
    @Transactional
    public TaskResponse createTask(
            Long projectId,
            CreateTaskRequest request,
            User user
    ) {
        Project project = findProjectAndCheckOwnership(projectId, user);

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .completed(false)
                .project(project)
                .build();

        taskRepository.save(task);

        return mapToResponse(task);
    }

    /**
     * Update an existing task
     */
    @Transactional
    public TaskResponse updateTask(
            Long projectId,
            Long taskId,
            UpdateTaskRequest request,
            User user
    ) {
        Project project = findProjectAndCheckOwnership(projectId, user);
        Task task = findTaskAndCheckProject(taskId, project);

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());

        taskRepository.save(task);

        return mapToResponse(task);
    }

    /**
     * Mark task as completed
     */
    @Transactional
    public TaskResponse markCompleted(Long projectId, Long taskId, User user) {
        Project project = findProjectAndCheckOwnership(projectId, user);
        Task task = findTaskAndCheckProject(taskId, project);

        task.setCompleted(true);
        taskRepository.save(task);

        return mapToResponse(task);
    }

    /**
     * Toggle task completion status
     */
    @Transactional
    public TaskResponse toggleCompletion(
            Long projectId,
            Long taskId,
            boolean completed,
            User user
    ) {
        Project project = findProjectAndCheckOwnership(projectId, user);
        Task task = findTaskAndCheckProject(taskId, project);

        task.setCompleted(completed);
        taskRepository.save(task);

        return mapToResponse(task);
    }

    /**
     * Delete a task
     */
    @Transactional
    public void deleteTask(Long projectId, Long taskId, User user) {
        Project project = findProjectAndCheckOwnership(projectId, user);
        Task task = findTaskAndCheckProject(taskId, project);

        taskRepository.delete(task);
    }

    // Helper methods
    private Project findProjectAndCheckOwnership(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this project");
        }

        return project;
    }

    private Task findTaskAndCheckProject(Long taskId, Project project) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        if (!task.getProject().getId().equals(project.getId())) {
            throw new AccessDeniedException("This task does not belong to the specified project");
        }

        return task;
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted()
        );
    }
}