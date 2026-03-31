package com.example.system.rest.dto.user;

import com.example.system.domain.model.FriendRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FriendRequestReadDto {
    private Long id;
    private UserReadResponseDto sender;
    private UserReadResponseDto receiver;
    private FriendRequestStatus status;
    private LocalDateTime createdAt;
}
