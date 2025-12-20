package com.hahn.projectmanager.repository;

import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByProject(Project project, Pageable pageable);

    Page<Task> findByProjectAndCompleted(
            Project project,
            boolean completed,
            Pageable pageable
    );

    long countByProject(Project project);
    long countByProjectAndCompletedTrue(Project project);
}
