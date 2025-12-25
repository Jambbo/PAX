package com.example.system.rest.dto.post;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public record PostReadResponseDto(
        Long id,
        String text,
        Long views,
        Long likes,
        Long authorId,
        Long groupId,
        List<String> images,
        String createdAt,
        String updatedAt
) {


}
