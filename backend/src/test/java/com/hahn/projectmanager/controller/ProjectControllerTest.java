package com.hahn.projectmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hahn.projectmanager.dto.project.CreateProjectRequest;
import com.hahn.projectmanager.dto.project.ProjectProgressResponse;
import com.hahn.projectmanager.dto.project.ProjectResponse;
import com.hahn.projectmanager.dto.project.UpdateProjectRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProjectService projectService;

    private ObjectMapper objectMapper;
    private User testUser;
    private ProjectResponse projectResponse;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().findAndRegisterModules();

        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("password")
                .build();

        projectResponse = new ProjectResponse(
                1L,
                "Test Project",
                "Test Description",
                10,
                5,
                50
        );
    }

    @Test
    @WithMockUser
    void createProject_ShouldReturnCreated() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("Test Project", "Test Description");

        when(projectService.createProject(any(CreateProjectRequest.class), any(User.class)))
                .thenReturn(projectResponse);

        mockMvc.perform(post("/api/projects")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.totalTasks").value(10))
                .andExpect(jsonPath("$.completedTasks").value(5))
                .andExpect(jsonPath("$.progressPercentage").value(50));

        verify(projectService).createProject(any(CreateProjectRequest.class), any(User.class));
    }

    @Test
    @WithMockUser
    void createProject_WithBlankTitle_ShouldReturnBadRequest() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("", "Test Description");

        mockMvc.perform(post("/api/projects")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void listProjects_ShouldReturnPageOfProjects() throws Exception {
        Page<ProjectResponse> page = new PageImpl<>(
                List.of(projectResponse),
                PageRequest.of(0, 10),
                1
        );

        when(projectService.getUserProjects(any(User.class), any()))
                .thenReturn(page);

        mockMvc.perform(get("/api/projects")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Project"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(projectService).getUserProjects(any(User.class), any());
    }

    @Test
    @WithMockUser
    void getProject_ShouldReturnProject() throws Exception {
        when(projectService.getProjectById(eq(1L), any(User.class)))
                .thenReturn(projectResponse);

        mockMvc.perform(get("/api/projects/1")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Project"));

        verify(projectService).getProjectById(eq(1L), any(User.class));
    }

    @Test
    @WithMockUser
    void updateProject_ShouldReturnUpdatedProject() throws Exception {
        UpdateProjectRequest request = new UpdateProjectRequest("Updated Title", "Updated Description");
        ProjectResponse updatedResponse = new ProjectResponse(
                1L,
                "Updated Title",
                "Updated Description",
                10,
                5,
                50
        );

        when(projectService.updateProject(eq(1L), any(UpdateProjectRequest.class), any(User.class)))
                .thenReturn(updatedResponse);

        mockMvc.perform(put("/api/projects/1")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated Description"));

        verify(projectService).updateProject(eq(1L), any(UpdateProjectRequest.class), any(User.class));
    }

    @Test
    @WithMockUser
    void deleteProject_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/projects/1")
                        .with(user(testUser))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(projectService).deleteProject(eq(1L), any(User.class));
    }

    @Test
    @WithMockUser
    void getProjectProgress_ShouldReturnProgress() throws Exception {
        ProjectProgressResponse progressResponse = new ProjectProgressResponse(1L, 10, 7, 70);

        when(projectService.getProjectProgress(eq(1L), any(User.class)))
                .thenReturn(progressResponse);

        mockMvc.perform(get("/api/projects/1/progress")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(1))
                .andExpect(jsonPath("$.totalTasks").value(10))
                .andExpect(jsonPath("$.completedTasks").value(7))
                .andExpect(jsonPath("$.progressPercentage").value(70));

        verify(projectService).getProjectProgress(eq(1L), any(User.class));
    }

    @Test
    void createProject_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("Test Project", "Test Description");

        mockMvc.perform(post("/api/projects")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Changed from isUnauthorized to isForbidden
    }
}