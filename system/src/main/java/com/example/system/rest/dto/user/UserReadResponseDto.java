package com.example.system.rest.dto.user;

import com.example.system.domain.model.UserStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserReadResponseDto {

    Long id;
    String username;
    String email;
    String firstName;
    String lastName;
    String bio;
    UserStatus status;
    boolean isProfilePrivate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
