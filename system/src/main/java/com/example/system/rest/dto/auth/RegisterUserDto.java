package com.example.system.rest.dto.auth;

import com.example.system.rest.validation.OnCreate;
import com.example.system.rest.validation.OnUpdate;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record RegisterUserDto(

        @NotBlank
        @Length(min = 3, max = 255)
        String username,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Length(min = 8, max = 255)
        String password,

        @NotBlank
        String passwordConfirmation,

        @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
        String firstName,

        @Length(max = 100, groups = {OnCreate.class, OnUpdate.class})
        String lastName

) {
    @AssertTrue
    public boolean isMatching() {
        return password.equals(passwordConfirmation);
    }
}
