package com.hahn.projectmanager.dto.project;


import jakarta.validation.constraints.NotBlank;

public record UpdateProjectRequest(
        @NotBlank String title,
        String description
) {}