package com.example.system.rest.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequestDto {

    @NotNull(
            message = "Username must be not null."
    )
    String username;

    @NotNull(
            message = "Password must be not null."
    )
    String password;


}
