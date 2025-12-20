package com.hahn.projectmanager.dto.task;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record UpdateTaskRequest(
        @NotBlank String title,
        String description,
        LocalDate dueDate
) {}