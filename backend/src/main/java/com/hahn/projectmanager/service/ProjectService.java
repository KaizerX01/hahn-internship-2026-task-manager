package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.project.CreateProjectRequest;
import com.hahn.projectmanager.dto.project.ProjectProgressResponse;
import com.hahn.projectmanager.dto.project.ProjectResponse;
import com.hahn.projectmanager.dto.project.UpdateProjectRequest;
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

        return mapToResponse(project);
    }

    public Page<ProjectResponse> getUserProjects(User user, Pageable pageable) {
        return projectRepository.findByOwner(user, pageable)
                .map(this::mapToResponse);
    }

    public ProjectResponse getProjectById(Long id, User user) {
        Project project = findProjectAndCheckOwnership(id, user);
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request, User user) {
        Project project = findProjectAndCheckOwnership(id, user);

        project.setTitle(request.title());
        project.setDescription(request.description());

        projectRepository.save(project);

        return mapToResponse(project);
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