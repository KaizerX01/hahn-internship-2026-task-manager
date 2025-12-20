package com.hahn.projectmanager.dto.task;

public record ToggleTaskCompletionRequest(
        boolean completed
) {}