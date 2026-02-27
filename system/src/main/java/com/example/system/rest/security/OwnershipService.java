package com.example.system.rest.security;

import com.example.system.repository.GroupRepository;
import com.example.system.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service("ownership")
@RequiredArgsConstructor
public class OwnershipService implements SecurityService {

    private final PostRepository postRepository;
    private final GroupRepository groupRepository;

    public boolean isOwner(Long postId) {
        return postRepository.existsByIdAndAuthorId(postId, getCurrentUserId());

    }

    public boolean isGroupOwner(Long groupId){
        return groupRepository.existsByIdAndOwnerId(groupId, getCurrentUserId());
    }

    @Override
    public String getCurrentUserId() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth
                    .getToken()
                    .getSubject();
        }
        return null;

    }
}
