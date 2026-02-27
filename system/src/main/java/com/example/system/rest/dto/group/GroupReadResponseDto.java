package com.example.system.rest.dto.group;

import com.example.system.domain.model.GroupPrivacy;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GroupReadResponseDto(

        Long id,
        String name,
        String description,
        GroupPrivacy privacy,
        String location,

        String ownerId,
        String ownerUsername,

        Set<String> adminIds,

        int memberCount,
        int postCount,

        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {}

