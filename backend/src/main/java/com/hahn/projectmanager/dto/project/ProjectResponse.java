package com.hahn.projectmanager.dto.project;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        int totalTasks,
        int completedTasks,
        int progressPercentage
) {}
