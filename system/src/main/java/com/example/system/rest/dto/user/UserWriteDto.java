package com.example.system.rest.dto.user;

import com.example.system.domain.model.UserStatus;
import com.example.system.rest.validation.OnCreate;
import com.example.system.rest.validation.OnUpdate;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;


public record UserWriteDto(
        @Null(message = "id must be null.", groups = OnCreate.class)
        @NotNull(message = "id must be provided for update.", groups = OnUpdate.class)
        Long id,

        @NotNull(message = "username must not be mull", groups = {OnUpdate.class, OnCreate.class})
        @Length(
                min = 3,
                max = 255,
                message = "Name length must be within a range of {min} and {max}.",
                groups = {OnCreate.class, OnUpdate.class}
        )
        String username,

        @Email(message = "email must be valid.",
                groups = {OnCreate.class, OnUpdate.class})
        @NotNull(message = "email must not be null",
                groups = {OnUpdate.class, OnCreate.class})
        @Length(max = 255, message = "email is too long.",
                groups = {OnCreate.class, OnUpdate.class})
        String email,


        @NotBlank(message = "password is required.", groups = OnCreate.class)
        @Length(min = 8, max = 255,
                message = "password length must be between {min} and {max}.",
                groups = {OnCreate.class})
        String password,

        @NotBlank(message = "password confirmation is required.", groups = OnCreate.class)
        @Length(min = 8, max = 255, groups = {OnCreate.class})
        String passwordConfirmation,

        @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
        String firstName,

        @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
        String lastName,

        @Length(max = 500, groups = {OnCreate.class, OnUpdate.class})
        String bio,

        UserStatus status,

        boolean isProfilePrivate

) {
    @AssertTrue(message = "password and passwordConfirmation must match",
            groups = {
                    OnCreate.class, OnUpdate.class
            })
    public boolean isPasswordMatching() {
        if (password == null && passwordConfirmation == null) return true;
        if (password == null || passwordConfirmation == null) return false;
        return password.equals(passwordConfirmation);
    }


}
