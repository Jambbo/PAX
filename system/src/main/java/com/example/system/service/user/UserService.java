package com.example.system.service.user;

import com.example.system.domain.model.User;

import java.util.List;

public interface UserService {
    User findUserById(Long userId);

    List<User> findAll();

    User update(User user);

    User register(User user);

    User getByUsername(String username);

    boolean existsByUsername(String username);

    User create(User user);
}
