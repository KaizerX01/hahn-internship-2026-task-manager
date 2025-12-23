package com.hahn.projectmanager.repository;

import com.hahn.projectmanager.dto.project.ProjectTaskCount;
import com.hahn.projectmanager.entity.Project;
import com.hahn.projectmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN FETCH p.owner WHERE p.owner = :owner")
    Page<Project> findByOwnerWithOwner(@Param("owner") User owner, Pageable pageable);



    @Query("""
       SELECT p.id as projectId,
              COUNT(t.id) as totalTasks,
              SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) as completedTasks
       FROM Project p
       LEFT JOIN p.tasks t
       WHERE p.owner = :owner
       GROUP BY p.id
       """)
    List<ProjectTaskCount> findTaskCountsByOwner(@Param("owner") User owner);

    @Query("""
   SELECT p.id as projectId,
          COUNT(t.id) as totalTasks,
          SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) as completedTasks
   FROM Project p
   LEFT JOIN p.tasks t
   WHERE p.id = :projectId
   GROUP BY p.id
   """)
    ProjectTaskCount findTaskCountByProjectId(@Param("projectId") Long projectId);


}
