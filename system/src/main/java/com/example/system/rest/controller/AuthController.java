package com.example.system.rest.controller;

import com.example.system.domain.model.User;
import com.example.system.rest.dto.auth.LoginRequestDto;
import com.example.system.rest.dto.auth.LoginResponseDto;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserWriteDto;
import com.example.system.rest.validation.OnCreate;
import com.example.system.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody @Validated(OnCreate.class) final UserWriteDto userWriteDto
    ) {
        User user = userMapper.toEntity(userWriteDto);
        return ResponseEntity.ok(userMapper.toDto(authService.register(user)));
    }

    @PostMapping("/login")
    public LoginResponseDto login(
            @RequestBody @Validated final LoginRequestDto dto
    ) {
        return authService.login(dto);
    }

    @PostMapping("/refresh")
    public LoginResponseDto refresh(@RequestBody String refreshToken) {
        return authService.refresh(refreshToken);
    }

}
