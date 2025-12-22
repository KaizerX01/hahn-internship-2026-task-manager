package com.hahn.projectmanager.service;

import com.hahn.projectmanager.dto.auth.LoginRequest;
import com.hahn.projectmanager.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void authenticate(LoginRequest request, HttpServletResponse response) {
        try {
            // Let Spring Security handle authentication
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );

            // Extract email from authenticated user
            String email = authentication.getName();

            // Generate tokens
            String accessToken = jwtService.generateAccessToken(email);
            String refreshToken = jwtService.generateRefreshToken(email);

            // Add cookies
            addCookie(response, "access_token", accessToken, 900); // 15 min
            addCookie(response, "refresh_token", refreshToken, 604800); // 7 days

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production with HTTPS for sure
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }
}