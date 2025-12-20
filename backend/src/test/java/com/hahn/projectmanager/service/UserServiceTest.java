package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.auth.RegisterRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.EmailAlreadyExistsException;
import com.hahn.projectmanager.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    @Test
    void register_success_savesUser() {

        RegisterRequest request =
                new RegisterRequest("John", "john@mail.com", "password");

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password"))
                .thenReturn("encoded");

        userService.register(request);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateEmail_throwsException() {

        when(userRepository.findByEmail("john@mail.com"))
                .thenReturn(Optional.of(new User()));

        RegisterRequest request =
                new RegisterRequest("John", "john@mail.com", "password");

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class);
    }
}
