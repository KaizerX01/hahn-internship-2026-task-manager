package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    UserService userService;

    @Test
    void register_validRequest_returns201() throws Exception {
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "John",
                                  "email": "john@mail.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void register_invalidRequest_returns400() throws Exception {
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "email": "bad",
                                  "password": "123"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}