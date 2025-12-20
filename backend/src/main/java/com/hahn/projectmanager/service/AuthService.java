package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.auth.LoginRequest;
import com.hahn.projectmanager.entity.User;
import com.hahn.projectmanager.exception.InvalidCredentialsException;
import com.hahn.projectmanager.repository.UserRepository;
import com.hahn.projectmanager.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void authenticate(
            LoginRequest request,
            HttpServletResponse response
    ) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        addCookie(response, "access_token", accessToken, 900);
        addCookie(response, "refresh_token", refreshToken, 604800);
    }

    private void addCookie(
            HttpServletResponse response,
            String name,
            String value,
            int maxAge
    ) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // ofc we will change that in prod (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }
}
