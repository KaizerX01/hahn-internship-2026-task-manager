package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.dto.task.CreateTaskRequest;
import com.hahn.projectmanager.dto.task.TaskResponse;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public Page<TaskResponse> list(
            @PathVariable Long projectId,
            @RequestParam(required = false) Boolean completed,
            Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return taskService.getTasks(projectId, completed, pageable, user);
    }


    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(projectId, request, user));
    }

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<Void> complete(
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        taskService.markCompleted(taskId, user);
        return ResponseEntity.noContent().build();
    }
}
