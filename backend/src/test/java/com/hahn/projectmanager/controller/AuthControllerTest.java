package com.hahn.projectmanager.controller;

import com.hahn.projectmanager.security.CustomUserDetailsService;
import com.hahn.projectmanager.security.JwtService;
import com.hahn.projectmanager.service.AuthService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    JwtService jwtService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @Test
    void login_validRequest_returns200() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())  // ← ADD THIS
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "test@mail.com",
                                  "password": "password"
                                }
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void refresh_invalidToken_returns401() throws Exception {
        when(jwtService.isTokenValid("bad"))
                .thenReturn(false);

        mockMvc.perform(post("/api/auth/refresh")
                        .with(csrf())  // ← ADD THIS
                        .cookie(new Cookie("refresh_token", "bad")))
                .andExpect(status().isUnauthorized());
    }
}