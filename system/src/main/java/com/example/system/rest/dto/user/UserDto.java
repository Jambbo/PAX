package com.example.system.rest.dto.user;

import com.example.system.domain.model.UserStatus;
import com.example.system.rest.validation.OnCreate;
import com.example.system.rest.validation.OnUpdate;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDto {

    @Null(message = "id must be null.", groups = OnCreate.class)
    @NotNull(message = "id must be provided for update.", groups = OnUpdate.class)
    Long id;

    @NotNull(message = "username must be not mull", groups = {OnUpdate.class, OnCreate.class})
    @Length(
            min = 3,
            max = 255,
            message = "Name length must be within a range of {min} and {max}.",
            groups = {OnCreate.class, OnUpdate.class}
    )
    String username;

    @Email(message = "email must be valid.",
            groups = {OnCreate.class, OnUpdate.class})
    @NotNull(message = "email must be not mull",
            groups = {OnUpdate.class, OnCreate.class})
    @Length(max = 255, message = "email is too long.",
            groups = {OnCreate.class, OnUpdate.class})
    String email;


    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "password is required.", groups = OnCreate.class)
    @Length(min = 8, max = 255,
            message = "password length must be between {min} and {max}.",
            groups = {OnCreate.class, OnUpdate.class})
    String password;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "password confirmation is required.", groups = OnCreate.class)
    @Length(min = 8, max = 255, groups = {OnCreate.class, OnUpdate.class})
    String passwordConfirmation;

    @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
    String firstName;

    @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
    String lastName;

    @Length(max = 500, groups = {OnCreate.class, OnUpdate.class})
    String bio;

    UserStatus status;

    boolean isProfilePrivate;

    @Null(message = "createdAt is server-managed.", groups = {OnCreate.class, OnUpdate.class})
    LocalDateTime createdAt;

    @Null(message = "updatedAt is server-managed.", groups = {OnCreate.class, OnUpdate.class})
    LocalDateTime updatedAt;

    @AssertTrue(message = "password and passwordConfirmation must match",
            groups = {OnCreate.class, OnUpdate.class})
    public boolean isPasswordMatching() {
        if (password == null && passwordConfirmation == null) return true;
        if (password == null || passwordConfirmation == null) return false;
        return password.equals(passwordConfirmation);
    }

}
