package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.auth.LoginRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.InvalidCredentialsException;
import com.hahn.projectmanager.repository.UserRepository;
import com.hahn.projectmanager.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtService jwtService;

    @Mock
    HttpServletResponse response;

    @InjectMocks
    AuthService authService;

    @Test
    void authenticate_success_setsCookies() {

        User user = User.builder()
                .email("test@mail.com")
                .password("encoded")
                .build();

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password", "encoded"))
                .thenReturn(true);

        when(jwtService.generateAccessToken("test@mail.com"))
                .thenReturn("access-token");

        when(jwtService.generateRefreshToken("test@mail.com"))
                .thenReturn("refresh-token");

        LoginRequest request =
                new LoginRequest("test@mail.com", "password");

        authService.authenticate(request, response);

        verify(response, times(2)).addCookie(any(Cookie.class));
    }

    @Test
    void authenticate_invalidPassword_throwsException() {

        User user = User.builder()
                .email("test@mail.com")
                .password("encoded")
                .build();

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(any(), any()))
                .thenReturn(false);

        LoginRequest request =
                new LoginRequest("test@mail.com", "wrong");

        assertThatThrownBy(() ->
                authService.authenticate(request, response))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
