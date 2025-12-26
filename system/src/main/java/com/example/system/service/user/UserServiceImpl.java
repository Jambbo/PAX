package com.example.system.service.user;

import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.repository.UserRepository;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserWriteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public User findUserById(String userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User with id=" + userId + " not found.")
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User update(String id, UserWriteDto dto) {
        //retrieving existingUser to use its id in order to have a consistent id from db for the updated user
        User existingUser = findUserById(id);
        userMapper.updateEntityFromDto(dto, existingUser);
        return userRepository.save(existingUser);
    }

    @Override
    @Transactional(readOnly = true)
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)//TODO create ResourceNotFoundException
                .orElseThrow(() -> new RuntimeException("User with username=" + username + " not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public User updateStatus(String userId, UserStatus status) {
        User user = findUserById(userId);
        user.setStatus(status);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User toggleProfilePrivacy(String userId) {
        User user = findUserById(userId);
        user.setProfilePrivate(!user.isProfilePrivate());
        return userRepository.save(user);
    }


}
