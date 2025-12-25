package com.example.system.service.auth;

import com.example.system.domain.model.User;
import com.example.system.rest.dto.auth.ChangePasswordDto;
import com.example.system.rest.dto.auth.LoginRequestDto;
import com.example.system.rest.dto.auth.LoginResponseDto;

public interface AuthService {
    User register(User user);

    LoginResponseDto login(LoginRequestDto dto);

    LoginResponseDto refresh(String refreshToken);

    void changePassword(Long id, ChangePasswordDto dto);

}
