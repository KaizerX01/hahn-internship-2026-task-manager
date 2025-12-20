package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.dto.task.CreateTaskRequest;
import com.hahn.projectmanager.dto.task.TaskResponse;
import com.hahn.projectmanager.dto.task.UpdateTaskRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * List all tasks for a project with optional filters
     * Query params: completed (true/false), search (search by title)
     */
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> listTasks(
            @PathVariable Long projectId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "id") Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                taskService.getTasks(projectId, completed, search, pageable, user)
        );
    }

    /**
     * Get a specific task
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(taskService.getTaskById(projectId, taskId, user));
    }

    /**
     * Create a new task
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(projectId, request, user));
    }

    /**
     * Update an existing task
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                taskService.updateTask(projectId, taskId, request, user)
        );
    }

    /**
     * Mark task as completed (legacy endpoint - kept for backward compatibility)
     */
    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> markTaskCompleted(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                taskService.markCompleted(projectId, taskId, user)
        );
    }

    /**
     * Toggle task completion status (more flexible)
     */
    @PatchMapping("/{taskId}/completion")
    public ResponseEntity<TaskResponse> toggleCompletion(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestParam boolean completed,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                taskService.toggleCompletion(projectId, taskId, completed, user)
        );
    }

    /**
     * Delete a task
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        taskService.deleteTask(projectId, taskId, user);
        return ResponseEntity.noContent().build();
    }
}