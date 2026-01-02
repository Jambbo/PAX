package com.example.system.rest.security;

import com.example.system.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service("ownership")
@RequiredArgsConstructor
public class OwnershipService implements SecurityService {

    private final PostRepository postRepository;

    public boolean isOwner(Long postId) {
        return postRepository.existsByIdAndAuthorId(postId, getCurrentUserId());

    }

    @Override
    public String getCurrentUserId() {
        return ((JwtAuthenticationToken)
                SecurityContextHolder.getContext()
                        .getAuthentication())
                .getToken()
                .getSubject();
    }
}
