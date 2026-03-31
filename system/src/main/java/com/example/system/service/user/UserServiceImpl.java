package com.example.system.service.user;

import com.example.system.domain.model.Post;
import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.repository.PostRepository;
import com.example.system.repository.UserRepository;
import com.example.system.repository.FriendRequestRepository;
import com.example.system.domain.model.FriendRequest;
import com.example.system.domain.model.FriendRequestStatus;
import com.example.system.service.notification.NotificationService;
import com.example.system.domain.model.notification.NotificationType;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserWriteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PostRepository postRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public User getUserById(String userId) {
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
        User existingUser = getUserById(id);
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
        User user = getUserById(userId);
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public User updateStatus(String userId, UserStatus status) {
        User user = getUserById(userId);
        user.setStatus(status);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User toggleProfilePrivacy(String userId) {
        User user = getUserById(userId);
        user.setProfilePrivate(!user.isProfilePrivate());
        return userRepository.save(user);
    }

    @Override
    public Long getUsersCount() {
        return userRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findLatestUsers(int limit) {
        return userRepository
                .findLatestUsers(PageRequest.of(0, limit))
                .getContent();
    }

    @Override
    @Transactional
    public User addBookmark(String userId, Long postId) {
        User user = getUserById(userId);
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        user.getBookmarks().add(post);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User removeBookmark(String userId, Long postId) {
        User user = getUserById(userId);
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        user.getBookmarks().remove(post);
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getBookmarkedPosts(String userId) {
        User user = getUserById(userId);
        return new ArrayList<>(user.getBookmarks());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBookmarked(String userId, Long postId) {
        User user = getUserById(userId);
        return user.getBookmarks().stream().anyMatch(post -> post.getId().equals(postId));
    }

    @Override
    public List<User> search(String query, String userId) {
        return userRepository.findTop10ByUsernameStartingWithIgnoreCaseAndIdNotOrderByUsernameAsc(query, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getLikedPostsByUserId(String userId) {
        User user = getUserById(userId);
        return new ArrayList<>(user.getLikedPosts());

    }

    @Override
    @Transactional
    public User addFriend(String userId, String friendId) {
        if (userId.equals(friendId)) {
            throw new IllegalArgumentException("Cannot add yourself as a friend");
        }
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.getFriends().add(friend);
        friend.getFriends().add(user); // Bidirectional friendship
        userRepository.save(friend);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User removeFriend(String userId, String friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.getFriends().remove(friend);
        friend.getFriends().remove(user); // Bidirectional friendship
        userRepository.save(friend);
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFriends(String userId) {
        User user = getUserById(userId);
        return new ArrayList<>(user.getFriends());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFriend(String userId, String friendId) {
        User user = getUserById(userId);
        return user.getFriends().stream().anyMatch(friend -> friend.getId().equals(friendId));
    }

    @Override
    @Transactional
    public void sendFriendRequest(String senderId, String receiverId) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }
        
        Optional<FriendRequest> existing = friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        if (existing.isPresent()) {
            throw new IllegalStateException("Friend request already sent");
        }
        
        if (isFriend(senderId, receiverId)) {
            throw new IllegalStateException("Already friends");
        }

        User sender = getUserById(senderId);
        User receiver = getUserById(receiverId);

        FriendRequest request = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequestStatus.PENDING)
                .build();
                
        FriendRequest saved = friendRequestRepository.save(request);
        
        notificationService.createNotification(
                receiverId,
                senderId,
                NotificationType.FRIEND_REQUEST,
                saved.getId().toString()
        );
    }

    @Override
    @Transactional
    public void acceptFriendRequest(String userId, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
                
        if (!request.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to accept this request");
        }
        
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        request.setStatus(FriendRequestStatus.ACCEPTED);
        friendRequestRepository.save(request);
        
        // Actually add the friend
        addFriend(request.getSender().getId(), request.getReceiver().getId());
    }

    @Override
    @Transactional
    public void declineFriendRequest(String userId, Long requestId) {
         FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
                
        if (!request.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to decline this request");
        }
        
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        request.setStatus(FriendRequestStatus.DECLINED);
        friendRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void cancelFriendRequest(String senderId, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
                
        if (!request.getSender().getId().equals(senderId)) {
            throw new IllegalArgumentException("Not authorized to cancel this request");
        }
        
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        friendRequestRepository.delete(request);
    }

    @Override
    @Transactional
    public void cancelFriendRequestByReceiverId(String senderId, String receiverId) {
        FriendRequest request = friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
                
        if (request.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        friendRequestRepository.delete(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FriendRequest> getPendingFriendRequests(String userId) {
        return friendRequestRepository.findByReceiverIdAndStatus(userId, FriendRequestStatus.PENDING);
    }
}
