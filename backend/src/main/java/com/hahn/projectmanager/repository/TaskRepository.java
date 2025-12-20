package com.hahn.projectmanager.repository;

import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByProject(Project project, Pageable pageable);

    Page<Task> findByProjectAndCompleted(
            Project project,
            boolean completed,
            Pageable pageable
    );

    // Search/filter by title
    @Query("SELECT t FROM Task t WHERE t.project = :project " +
            "AND (:completed IS NULL OR t.completed = :completed) " +
            "AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> searchTasks(
            @Param("project") Project project,
            @Param("completed") Boolean completed,
            @Param("search") String search,
            Pageable pageable
    );

    long countByProject(Project project);

    long countByProjectAndCompletedTrue(Project project);
}