package com.example.system.service.auth;

import com.example.system.domain.model.Role;
import com.example.system.domain.model.User;
import com.example.system.rest.dto.auth.LoginRequestDto;
import com.example.system.rest.dto.auth.LoginResponseDto;
import com.example.system.rest.security.JwtTokenProvider;
import com.example.system.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public User register(User user) {
        if (userService.existsByUsername(user.getUsername())) {
            throw new RuntimeException();//TODO create ResourceAlreadyExistsException
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userService.create(user);
    }

    @Override
    public LoginResponseDto login(final LoginRequestDto request) {
        User user = userService.getByUsername(request.getUsername());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        return LoginResponseDto.builder()
                .id(user.getId())
                .access(jwtTokenProvider.createAccessToken(user.getId(), user.getUsername(), Set.of(Role.USER)))
                .refresh(jwtTokenProvider.createRefreshToken(user.getId(), user.getUsername()))
                .build();
    }

    @Override
    public LoginResponseDto refresh(final String refreshToken) {
        return jwtTokenProvider.refreshUserTokens(refreshToken);
    }
}
