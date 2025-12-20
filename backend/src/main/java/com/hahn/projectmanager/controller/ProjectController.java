package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.dto.project.CreateProjectRequest;
import com.hahn.projectmanager.dto.project.ProjectProgressResponse;
import com.hahn.projectmanager.dto.project.ProjectResponse;
import com.hahn.projectmanager.dto.project.UpdateProjectRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.ProjectService;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Create a new project
     */
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, user));
    }

    /**
     * List all projects for authenticated user (with pagination)
     */
    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> listProjects(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "id") Pageable pageable
    ) {
        return ResponseEntity.ok(projectService.getUserProjects(user, pageable));
    }

    /**
     * Get a specific project by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.getProjectById(id, user));
    }

    /**
     * Update an existing project
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, request, user));
    }

    /**
     * Delete a project
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        projectService.deleteProject(id, user);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get project progress (dedicated endpoint)
     */
    @GetMapping("/{id}/progress")
    public ResponseEntity<ProjectProgressResponse> getProjectProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.getProjectProgress(id, user));
    }
}