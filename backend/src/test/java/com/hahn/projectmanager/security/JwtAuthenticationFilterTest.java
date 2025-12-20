package com.hahn.projectmanager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    JwtService jwtService;

    @Mock
    CustomUserDetailsService userDetailsService;

    @InjectMocks
    JwtAuthenticationFilter filter;

    @Test
    void validToken_setsAuthentication() throws Exception {
        String token = "valid-token";

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("access_token", token));

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        when(jwtService.isTokenValid(token)).thenReturn(true);
        when(jwtService.extractEmail(token)).thenReturn("test@mail.com");

        UserDetails user = new User("test@mail.com", "pass",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        when(userDetailsService.loadUserByUsername("test@mail.com"))
                .thenReturn(user);

        filter.doFilter(request, response, chain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        assertThat(auth).isNotNull();
        assertThat(auth.getName()).isEqualTo("test@mail.com");

        verify(chain).doFilter(request, response);
    }

    @Test
    void noToken_doesNotAuthenticate() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(request, response, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain).doFilter(request, response);
    }

    @Test
    void invalidToken_doesNotAuthenticate() throws Exception {
        String token = "invalid-token";

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("access_token", token));

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        when(jwtService.isTokenValid(token)).thenReturn(false);

        filter.doFilter(request, response, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain).doFilter(request, response);
        verify(userDetailsService, never()).loadUserByUsername(any());
    }
}