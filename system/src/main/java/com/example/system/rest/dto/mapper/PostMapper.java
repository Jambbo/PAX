package com.example.system.rest.dto.mapper;

import com.example.system.domain.model.Post;
import com.example.system.rest.dto.post.PostDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper extends Mappable<Post, PostDto> {
}
