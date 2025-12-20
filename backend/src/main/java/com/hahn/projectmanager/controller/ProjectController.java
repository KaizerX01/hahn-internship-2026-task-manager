package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.dto.project.CreateProjectRequest;
import com.hahn.projectmanager.dto.project.ProjectResponse;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, user));
    }

    @GetMapping
    public Page<ProjectResponse> list(
            @AuthenticationPrincipal User user,
            Pageable pageable
    ) {
        return projectService.getUserProjects(user, pageable);
    }

}
