package com.example.system.repository;

import com.example.system.domain.model.FriendRequest;
import com.example.system.domain.model.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    
    Optional<FriendRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);
    
    @Query("SELECT f FROM FriendRequest f WHERE f.receiver.id = :receiverId AND f.status = :status")
    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, FriendRequestStatus status);
}
