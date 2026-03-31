package com.example.system.rest.controller;

import com.example.system.domain.model.FriendRequest;
import com.example.system.domain.model.Post;
import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.rest.dto.mapper.PostMapper;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.post.PostReadResponseDto;
import com.example.system.rest.dto.user.FriendRequestReadDto;
import com.example.system.rest.dto.user.UserReadResponseDto;
import com.example.system.rest.dto.user.UserWriteDto;
import com.example.system.rest.validation.OnUpdate;
import com.example.system.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
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
    private final PostMapper postMapper;

    @GetMapping("/{id}")
    public ResponseEntity<UserReadResponseDto> getById(@PathVariable("id") final String userId) {
        UserReadResponseDto dto = userMapper.toDto(userService.getUserById(userId));
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        Long usersCount = userService.getUsersCount();
        return ResponseEntity.ok(usersCount);
    }

    @GetMapping
    public ResponseEntity<List<UserReadResponseDto>> getAll() {
        List<UserReadResponseDto> dto = userMapper.toDto(userService.findAll());
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/likedPosts")
    public ResponseEntity<List<PostReadResponseDto>> getMyLikedPosts(
            @AuthenticationPrincipal Jwt jwt
    ) {
        List<Post> likedPostsByUserId = userService.getLikedPostsByUserId(jwt.getSubject());
        List<PostReadResponseDto> likedPostsDto = postMapper.toDto(likedPostsByUserId);
        return ResponseEntity.ok(likedPostsDto);
    }

    @GetMapping("/{userId}/likedPosts")
    public ResponseEntity<List<PostReadResponseDto>> getLikedPostsByUserId(@PathVariable("userId") String userId){
        List<Post> likedPostsByUserId = userService.getLikedPostsByUserId(userId);
        List<PostReadResponseDto> likedPostsDto = postMapper.toDto(likedPostsByUserId);
        return ResponseEntity.ok(likedPostsDto);
    }

    @PreAuthorize("isAuthenticated() and #jwt.subject == #userId")
    @PutMapping("/{id}")
    public ResponseEntity<UserReadResponseDto> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("id") final String userId,
            @Validated(OnUpdate.class) @RequestBody UserWriteDto userWriteDto
    ) {
        User updatedUser = userService.update(userId, userWriteDto);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @PreAuthorize("@userAuth.isAdmin()")
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

    @PreAuthorize("isAuthenticated()")
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

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/me/profile-privacy")
    public User toggleMyPrivacy(@AuthenticationPrincipal Jwt jwt) {
        return userService.toggleProfilePrivacy(jwt.getSubject());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/search")
    public ResponseEntity<List<UserReadResponseDto>> search(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String username
    ) {
        List<UserReadResponseDto> searchedUsers = userMapper.toDto(
                userService.search(username, jwt.getSubject()));
        return ResponseEntity.ok(searchedUsers);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<UserReadResponseDto>> getLatestUsers(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "5") int limit
    ) {
        List<User> users = userService.findLatestUsers(limit)
                .stream()
                .filter(u -> !u.getId().equals(jwt.getSubject()))
                .toList();

        return ResponseEntity.ok(userMapper.toDto(users));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/friends/{friendId}")
    public ResponseEntity<Void> sendFriendRequest(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("friendId") String friendId
    ) {
        userService.sendFriendRequest(jwt.getSubject(), friendId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/friend-requests/{requestId}/accept")
    public ResponseEntity<Void> acceptFriendRequest(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("requestId") Long requestId
    ) {
        userService.acceptFriendRequest(jwt.getSubject(), requestId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/friend-requests/{requestId}/decline")
    public ResponseEntity<Void> declineFriendRequest(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("requestId") Long requestId
    ) {
        userService.declineFriendRequest(jwt.getSubject(), requestId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/friend-requests/{requestId}/cancel")
    public ResponseEntity<Void> cancelFriendRequest(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("requestId") Long requestId
    ) {
        userService.cancelFriendRequest(jwt.getSubject(), requestId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/friends/{friendId}/cancel-request")
    public ResponseEntity<Void> cancelFriendRequestByReceiver(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("friendId") String friendId
    ) {
        userService.cancelFriendRequestByReceiverId(jwt.getSubject(), friendId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/friend-requests/pending")
    public ResponseEntity<List<FriendRequestReadDto>> getPendingFriendRequests(
            @AuthenticationPrincipal Jwt jwt
    ) {
        List<FriendRequest> requests = userService.getPendingFriendRequests(jwt.getSubject());
        List<FriendRequestReadDto> dtos = requests.stream()
                .map(r -> FriendRequestReadDto.builder()
                        .id(r.getId())
                        .sender(userMapper.toDto(r.getSender()))
                        .receiver(userMapper.toDto(r.getReceiver()))
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me/friends/{friendId}")
    public ResponseEntity<UserReadResponseDto> removeFriend(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("friendId") String friendId
    ) {
        User user = userService.removeFriend(jwt.getSubject(), friendId);
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<UserReadResponseDto>> getFriends(@PathVariable("userId") String userId) {
        List<User> friends = userService.getFriends(userId);
        return ResponseEntity.ok(userMapper.toDto(friends));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/friends")
    public ResponseEntity<List<UserReadResponseDto>> getMyFriends(@AuthenticationPrincipal Jwt jwt) {
        List<User> friends = userService.getFriends(jwt.getSubject());
        return ResponseEntity.ok(userMapper.toDto(friends));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/friends/{friendId}/status")
    public ResponseEntity<Map<String, Boolean>> isFriend(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable("friendId") String friendId
    ) {
        boolean isFriend = userService.isFriend(jwt.getSubject(), friendId);
        return ResponseEntity.ok(Map.of("isFriend", isFriend));
    }
}