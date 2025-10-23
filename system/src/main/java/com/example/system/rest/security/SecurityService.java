package com.example.system.rest.security;

import com.example.system.domain.model.Post;

public interface SecurityService {

    JwtEntity getUserFromRequest();

    boolean canAccessUser(Long userId);

    boolean canModifyPost(Long postId);

    boolean canModifyPost(Post post);

    boolean canModifyGroup(Long groupId);

}
