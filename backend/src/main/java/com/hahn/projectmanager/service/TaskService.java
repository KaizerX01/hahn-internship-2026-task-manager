package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.task.CreateTaskRequest;
import com.hahn.projectmanager.dto.task.TaskResponse;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.Task;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.ProjectNotFoundException;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;


    public Page<TaskResponse> getTasks(
            Long projectId,
            Boolean completed,
            Pageable pageable,
            User user
    ) {
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getOwner().getId().equals(user.getId()))
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        Page<Task> page = (completed == null)
                ? taskRepository.findByProject(project, pageable)
                : taskRepository.findByProjectAndCompleted(project, completed, pageable);

        return page.map(this::map);
    }


    public TaskResponse createTask(
            Long projectId,
            CreateTaskRequest request,
            User user
    ) {

        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getOwner().getId().equals(user.getId()))
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .completed(false)
                .project(project)
                .build();

        taskRepository.save(task);

        return map(task);
    }

    public void markCompleted(Long taskId, User user) {

        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getProject().getOwner().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(true);
        taskRepository.save(task);
    }

    private TaskResponse map(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted()
        );
    }
}
