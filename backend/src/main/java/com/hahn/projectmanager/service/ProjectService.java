package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.page.PaginatedResponse;
import com.hahn.projectmanager.dto.project.*;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.ProjectNotFoundException;
import com.hahn.projectmanager.repository.ProjectRepository;
import com.hahn.projectmanager.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, User user) {
        Project project = Project.builder()
                .title(request.title())
                .description(request.description())
                .owner(user)
                .build();

        projectRepository.save(project);

        ProjectTaskCount count = new ProjectTaskCount() {
            @Override
            public Long getProjectId() { return project.getId(); }
            @Override
            public Long getTotalTasks() { return 0L; }
            @Override
            public Long getCompletedTasks() { return 0L; }
        };

        return mapToResponse(project, count);
    }


    public PaginatedResponse<ProjectResponse> getUserProjects(User user, Pageable pageable) {
        Page<Project> projectsPage = projectRepository.findByOwnerWithOwner(user, pageable);

        List<ProjectTaskCount> counts = projectRepository.findTaskCountsByOwner(user);
        Map<Long, ProjectTaskCount> countsMap = counts.stream()
                .collect(Collectors.toMap(ProjectTaskCount::getProjectId, c -> c));

        List<ProjectResponse> responses = projectsPage.stream()
                .map(p -> mapToResponse(p, countsMap.get(p.getId())))
                .toList();

        return new PaginatedResponse<>(
                responses,
                projectsPage.getNumber(),
                projectsPage.getSize(),
                projectsPage.getTotalElements(),
                projectsPage.getTotalPages()
        );
    }



    public ProjectResponse getProjectById(Long id, User user) {
        Project project = findProjectAndCheckOwnership(id, user);

        ProjectTaskCount count = projectRepository.findTaskCountByProjectId(id);

        return mapToResponse(project, count);
    }


    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request, User user) {
        Project project = findProjectAndCheckOwnership(id, user);

        project.setTitle(request.title());
        project.setDescription(request.description());

        projectRepository.save(project);

        // Fetch task counts for this project in a single query
        ProjectTaskCount count = projectRepository.findTaskCountByProjectId(id);

        return mapToResponse(project, count);
    }


    @Transactional
    public void deleteProject(Long id, User user) {
        Project project = findProjectAndCheckOwnership(id, user);
        projectRepository.delete(project);
    }

    public ProjectProgressResponse getProjectProgress(Long id, User user) {
        Project project = findProjectAndCheckOwnership(id, user);

        long total = taskRepository.countByProject(project);
        long completed = taskRepository.countByProjectAndCompletedTrue(project);
        int progress = total == 0 ? 0 : (int) ((completed * 100) / total);

        return new ProjectProgressResponse(
                project.getId(),
                (int) total,
                (int) completed,
                progress
        );
    }

    // Helper methods
    private Project findProjectAndCheckOwnership(Long id, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this project");
        }

        return project;
    }

    private ProjectResponse mapToResponse(Project project, ProjectTaskCount count) {
        int total = count != null ? count.getTotalTasks().intValue() : 0;
        int completed = count != null ? count.getCompletedTasks().intValue() : 0;
        int progress = total == 0 ? 0 : (completed * 100) / total;

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                total,
                completed,
                progress
        );
    }

}