package com.example.system.rest.controller;

import com.example.system.domain.model.User;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserDto;
import com.example.system.rest.validation.OnCreate;
import com.example.system.rest.validation.OnUpdate;
import com.example.system.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    public ResponseEntity<?> register(@Validated(OnCreate.class) @RequestBody final UserDto userDto){
        User user = userMapper.fromDto(userDto);
        UserDto dto = userMapper.toDto(userService.register(user));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") final Long userId) {
        UserDto dto = userMapper.toDto(userService.findUserById(userId));
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<UserDto> dto = userMapper.toDto(userService.findAll());
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<?> update(
            @Validated(OnUpdate.class)
            @RequestBody UserDto userDto
    ) {
        User user = userMapper.fromDto(userDto);
        UserDto dto = userMapper.toDto(userService.update(user));
        return ResponseEntity.ok(dto);
    }


}
