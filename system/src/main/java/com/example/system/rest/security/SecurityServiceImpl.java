package com.example.system.rest.security;

import com.example.system.domain.model.Post;
import com.example.system.service.post.PostService;
import com.example.system.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("ssi")
@RequiredArgsConstructor
public class SecurityServiceImpl implements SecurityService{

    private final UserService userService;
    private final PostService postService;

    @Override
    public JwtEntity getUserFromRequest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!authentication.isAuthenticated()){
            return null;
        }
        if(authentication.getPrincipal().equals("anonymousUser")){
            return null;
        }
        return (JwtEntity) authentication.getPrincipal();
    }

    @Override
    public boolean canAccessUser(final Long userId) {
        JwtEntity user = getUserFromRequest();
        return userId==user.getId();
    }

    //TODO implement those
    @Override
    public boolean canModifyPost(Long postId) {
        return false;
    }

    @Override
    public boolean canModifyPost(Post post) {
        return false;
    }

    @Override
    public boolean canModifyGroup(Long groupId) {
        return false;
    }
}
