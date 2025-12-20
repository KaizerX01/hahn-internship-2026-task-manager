package com.hahn.projectmanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String secretKey;
    private final long accessExpiration;
    private final long refreshExpiration;

    public JwtService(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.access.expiration}") long accessExpiration,
            @Value("${jwt.refresh.expiration}") long refreshExpiration) {
        this.secretKey = secretKey;
        this.accessExpiration = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String email) {
        return buildToken(email, accessExpiration);
    }

    public String generateRefreshToken(String email) {
        return buildToken(email, refreshExpiration);
    }

    private String buildToken(String email, long expiration) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}