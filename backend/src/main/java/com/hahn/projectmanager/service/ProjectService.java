package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.project.CreateProjectRequest;
import com.hahn.projectmanager.dto.project.ProjectResponse;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ProjectResponse createProject(CreateProjectRequest request, User user) {

        Project project = Project.builder()
                .title(request.title())
                .description(request.description())
                .owner(user)
                .build();

        projectRepository.save(project);

        return mapToResponse(project);
    }

    public Page<ProjectResponse> getUserProjects(
            User user,
            Pageable pageable
    ) {
        return projectRepository.findByOwner(user, pageable)
                .map(this::mapToResponse);
    }


    private ProjectResponse mapToResponse(Project project) {

        long total = taskRepository.countByProject(project);
        long completed = taskRepository.countByProjectAndCompletedTrue(project);

        int progress = total == 0 ? 0 : (int) ((completed * 100) / total);

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                (int) total,
                (int) completed,
                progress
        );
    }
}
