package com.example.system.rest.controller;

import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserReadResponseDto;
import com.example.system.rest.dto.user.UserWriteDto;
import com.example.system.rest.validation.OnUpdate;
import com.example.system.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

//    @PostMapping
//    public ResponseEntity<UserReadResponseDto> register(@Validated(OnCreate.class) @RequestBody UserWriteDto userWriteDto){
//        User user = userMapper.toEntity(userWriteDto);
//        UserReadResponseDto dto = userMapper.toDto(userService.register(user));
//        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<UserReadResponseDto> getById(@PathVariable("id") final String userId) {
        UserReadResponseDto dto = userMapper.toDto(userService.findUserById(userId));
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<UserReadResponseDto>> getAll() {
        List<UserReadResponseDto> dto = userMapper.toDto(userService.findAll());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserReadResponseDto> update(
            @PathVariable("id") final String userId,
            @Validated(OnUpdate.class) @RequestBody UserWriteDto userWriteDto
    ) {
        User updatedUser = userService.update(userId, userWriteDto);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") final String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserReadResponseDto> getByUsername(@PathVariable("username") final String username) {
        UserReadResponseDto dto = userMapper.toDto(userService.getByUsername(username));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@PathVariable("username") final String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(Map.of(
                "exists", exists,
                "available", !exists
        ));
    }

    @PatchMapping("/me/status")
    public ResponseEntity<UserReadResponseDto> updateMyStatus(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, String> statusUpdate
    ) {
        UserStatus status = UserStatus.valueOf(statusUpdate.get("status"));
        User user = userService.updateStatus(jwt.getSubject(), status);
        UserReadResponseDto dto = userMapper.toDto(user);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/me/profile-privacy")
    public User toggleMyPrivacy(@AuthenticationPrincipal Jwt jwt) {
        return userService.toggleProfilePrivacy(jwt.getSubject());
    }


}
