package com.example.system.rest.security;

import com.example.system.domain.model.Role;
import com.example.system.domain.model.User;
import com.example.system.rest.dto.auth.LoginResponseDto;
import com.example.system.rest.security.jwt.JwtProperties;
import com.example.system.service.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;



import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    public String createAccessToken(Long userId, String username, Set<Role> roles) {
        Claims claims = Jwts.claims()
                .subject(username)
                .add("id", userId)
                .add("roles", resolveRoles(roles))
                .build();
        Instant validity = Instant.now()
                .plus(jwtProperties.getAccess());
        return Jwts.builder()
                .claims(claims)
                .expiration(Date.from(validity))
                .signWith(key)
                .compact();
    }

    public List<String> resolveRoles(Set<Role> roles) {
        return roles.stream()
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    public String createRefreshToken(final Long userId, final String username) {
        Claims claims = Jwts.claims()
                .subject(username)
                .add("id", userId)
                .build();
        Instant validity = Instant.now()
                .plus(jwtProperties.getRefresh());
        return Jwts.builder()
                .claims(claims)
                .expiration(Date.from(validity))
                .signWith(key)
                .compact();
    }

    public LoginResponseDto refreshUserTokens(String refreshToken) {
        if (!validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token is invalid");
        }
        Long userId = Long.valueOf(getId(refreshToken));
        User user = userService.findUserById(userId);
        String username = user.getUsername();
        return LoginResponseDto.builder()
                .access(createAccessToken(userId, username, user.getRoles()))
                .refresh(createRefreshToken(userId, user.getUsername()))
                .build();
    }

    public boolean validateToken(String token) {
        Jws<Claims> claims = Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
        return !claims.getPayload().getExpiration().before(new Date());
    }

    public String getId(String token) {
        return Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload().get("id")
                .toString();
    }

    public String getUsername(String token) {
        return Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload().getSubject();
    }

    public Authentication getAuthentication(String token) {
        String username = getUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails != null) {
            return new UsernamePasswordAuthenticationToken(
                    userDetails,
                    "",
                    userDetails.getAuthorities()
            );
        }
        return null;
    }

}