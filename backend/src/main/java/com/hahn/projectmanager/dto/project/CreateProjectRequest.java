package com.hahn.projectmanager.dto.project;

import jakarta.validation.constraints.NotBlank;

public record CreateProjectRequest(
        @NotBlank String title,
        String description
) {}
