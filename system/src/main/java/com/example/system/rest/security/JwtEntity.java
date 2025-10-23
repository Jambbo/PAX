package com.example.system.rest.security;

import com.example.system.domain.model.User;
import lombok.Data;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.example.system.domain.model.Role;

import java.util.*;
import java.util.stream.Collectors;

@Data
public class JwtEntity implements UserDetails {

    private Long id;
    private final String username;
    private final String password;
    private final Collection<SimpleGrantedAuthority> authorities;


    public JwtEntity(
            User user
    ) {
        this(
                user.getId(),
                user.getUsername(),
                user.getPassword()
        );
        this.authorities.addAll(
                mapToGrantedAuthorities(List.of(Role.USER))
        );
    }

    private static Collection<SimpleGrantedAuthority> mapToGrantedAuthorities(final Collection<Role> roles) {
        return roles.stream()
                .map(Enum::name)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    private JwtEntity(
            final Long id,
            final String username,
            final String password
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = new ArrayList<>();
    }
}