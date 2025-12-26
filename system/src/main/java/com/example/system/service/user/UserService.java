package com.example.system.service.user;

import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.rest.dto.user.UserWriteDto;

import java.util.List;

public interface UserService {
    User findUserById(Long userId);

    List<User> findAll();

    User update(Long id, UserWriteDto userWriteDto);

    User getByUsername(String username);

    boolean existsByUsername(String username);

    void deleteUser(Long userId);

    User updateStatus(Long userId, UserStatus status);

    User toggleProfilePrivacy(Long userId);

}
