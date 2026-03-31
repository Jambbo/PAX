package com.example.system.service.user;

import com.example.system.domain.model.FriendRequest;
import com.example.system.domain.model.Post;
import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.rest.dto.user.UserWriteDto;

import java.util.List;

public interface UserService {
    User getUserById(String userId);

    List<User> findAll();

    User update(String id, UserWriteDto userWriteDto);

    User getByUsername(String username);

    boolean existsByUsername(String username);

    void deleteUser(String userId);

    User updateStatus(String userId, UserStatus status);

    User toggleProfilePrivacy(String userId);

    Long getUsersCount();

    List<User> findLatestUsers(int limit);

    User addBookmark(String userId, Long postId);

    User removeBookmark(String userId, Long postId);

    List<Post> getBookmarkedPosts(String userId);

    boolean isBookmarked(String userId, Long postId);

    List<User> search(String query, String userId);

    List<Post> getLikedPostsByUserId(String userId);

    User addFriend(String userId, String friendId);

    User removeFriend(String userId, String friendId);

    List<User> getFriends(String userId);

    boolean isFriend(String userId, String friendId);

    void sendFriendRequest(String senderId, String receiverId);

    void acceptFriendRequest(String userId, Long requestId);

    void declineFriendRequest(String userId, Long requestId);

    void cancelFriendRequest(String senderId, Long requestId);

    void cancelFriendRequestByReceiverId(String senderId, String receiverId);

    List<FriendRequest> getPendingFriendRequests(String userId);
}