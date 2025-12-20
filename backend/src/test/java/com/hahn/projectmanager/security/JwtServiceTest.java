package com.hahn.projectmanager.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    JwtService jwtService = new JwtService(
            "Kp9mV3xR8nQ2wE5tY7uI0oP4sA6dF1gH3jK5lZ8cX9bN2mQ4wE6rT8yU1iO3pA7s",
            3600000L,  // 1 hour
            86400000L  // 24 hours
    );

    @Test
    void generateAccessToken_andValidate() {
        String token = jwtService.generateAccessToken("test@mail.com");

        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractEmail(token))
                .isEqualTo("test@mail.com");
    }

    @Test
    void invalidToken_returnsFalse() {
        String badToken = "invalid.token.value";

        assertThat(jwtService.isTokenValid(badToken))
                .isFalse();
    }
}