package com.hahn.projectmanager.dto.project;


public record ProjectProgressResponse(
        Long projectId,
        int totalTasks,
        int completedTasks,
        int progressPercentage
) {}