package com.hahn.projectmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hahn.projectmanager.dto.task.CreateTaskRequest;
import com.hahn.projectmanager.dto.task.TaskResponse;
import com.hahn.projectmanager.dto.task.UpdateTaskRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
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
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    private ObjectMapper objectMapper;
    private User testUser;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        // Create ObjectMapper manually with JSR310 module
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("password")
                .build();

        taskResponse = new TaskResponse(
                1L,
                "Test Task",
                "Test Description",
                LocalDate.now().plusDays(7),
                false
        );
    }

    @Test
    @WithMockUser
    void createTask_ShouldReturnCreated() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest(
                "Test Task",
                "Test Description",
                LocalDate.now().plusDays(7)
        );

        when(taskService.createTask(eq(1L), any(CreateTaskRequest.class), any(User.class)))
                .thenReturn(taskResponse);

        mockMvc.perform(post("/api/projects/1/tasks")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(taskService).createTask(eq(1L), any(CreateTaskRequest.class), any(User.class));
    }

    @Test
    @WithMockUser
    void createTask_WithBlankTitle_ShouldReturnBadRequest() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest(
                "",
                "Test Description",
                LocalDate.now().plusDays(7)
        );

        mockMvc.perform(post("/api/projects/1/tasks")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void listTasks_ShouldReturnPageOfTasks() throws Exception {
        Page<TaskResponse> page = new PageImpl<>(
                List.of(taskResponse),
                PageRequest.of(0, 20),
                1
        );

        when(taskService.getTasks(eq(1L), isNull(), isNull(), any(), any(User.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/projects/1/tasks")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Test Task"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(taskService).getTasks(eq(1L), isNull(), isNull(), any(), any(User.class));
    }

    @Test
    @WithMockUser
    void listTasks_WithCompletedFilter_ShouldReturnFilteredTasks() throws Exception {
        TaskResponse completedTask = new TaskResponse(
                1L,
                "Completed Task",
                "Description",
                LocalDate.now(),
                true
        );

        Page<TaskResponse> page = new PageImpl<>(
                List.of(completedTask),
                PageRequest.of(0, 20),
                1
        );

        when(taskService.getTasks(eq(1L), eq(true), isNull(), any(), any(User.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/projects/1/tasks")
                        .with(user(testUser))
                        .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].completed").value(true));

        verify(taskService).getTasks(eq(1L), eq(true), isNull(), any(), any(User.class));
    }

    @Test
    @WithMockUser
    void listTasks_WithSearchQuery_ShouldReturnSearchedTasks() throws Exception {
        Page<TaskResponse> page = new PageImpl<>(
                List.of(taskResponse),
                PageRequest.of(0, 20),
                1
        );

        when(taskService.getTasks(eq(1L), isNull(), eq("Test"), any(), any(User.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/projects/1/tasks")
                        .with(user(testUser))
                        .param("search", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Task"));

        verify(taskService).getTasks(eq(1L), isNull(), eq("Test"), any(), any(User.class));
    }

    @Test
    @WithMockUser
    void getTask_ShouldReturnTask() throws Exception {
        when(taskService.getTaskById(eq(1L), eq(1L), any(User.class)))
                .thenReturn(taskResponse);

        mockMvc.perform(get("/api/projects/1/tasks/1")
                        .with(user(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService).getTaskById(eq(1L), eq(1L), any(User.class));
    }

    @Test
    @WithMockUser
    void updateTask_ShouldReturnUpdatedTask() throws Exception {
        UpdateTaskRequest request = new UpdateTaskRequest(
                "Updated Task",
                "Updated Description",
                LocalDate.now().plusDays(10)
        );

        TaskResponse updatedResponse = new TaskResponse(
                1L,
                "Updated Task",
                "Updated Description",
                LocalDate.now().plusDays(10),
                false
        );

        when(taskService.updateTask(eq(1L), eq(1L), any(UpdateTaskRequest.class), any(User.class)))
                .thenReturn(updatedResponse);

        mockMvc.perform(put("/api/projects/1/tasks/1")
                        .with(user(testUser))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.description").value("Updated Description"));

        verify(taskService).updateTask(eq(1L), eq(1L), any(UpdateTaskRequest.class), any(User.class));
    }

    @Test
    @WithMockUser
    void markTaskCompleted_ShouldReturnCompletedTask() throws Exception {
        TaskResponse completedTask = new TaskResponse(
                1L,
                "Test Task",
                "Test Description",
                LocalDate.now().plusDays(7),
                true
        );

        when(taskService.markCompleted(eq(1L), eq(1L), any(User.class)))
                .thenReturn(completedTask);

        mockMvc.perform(patch("/api/projects/1/tasks/1/complete")
                        .with(user(testUser))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        verify(taskService).markCompleted(eq(1L), eq(1L), any(User.class));
    }

    @Test
    @WithMockUser
    void toggleCompletion_ShouldUpdateCompletionStatus() throws Exception {
        TaskResponse updatedTask = new TaskResponse(
                1L,
                "Test Task",
                "Test Description",
                LocalDate.now().plusDays(7),
                true
        );

        when(taskService.toggleCompletion(eq(1L), eq(1L), eq(true), any(User.class)))
                .thenReturn(updatedTask);

        mockMvc.perform(patch("/api/projects/1/tasks/1/completion")
                        .with(user(testUser))
                        .with(csrf())
                        .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        verify(taskService).toggleCompletion(eq(1L), eq(1L), eq(true), any(User.class));
    }

    @Test
    @WithMockUser
    void deleteTask_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/projects/1/tasks/1")
                        .with(user(testUser))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(taskService).deleteTask(eq(1L), eq(1L), any(User.class));
    }

    @Test
    void createTask_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest(
                "Test Task",
                "Test Description",
                LocalDate.now().plusDays(7)
        );

        mockMvc.perform(post("/api/projects/1/tasks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}