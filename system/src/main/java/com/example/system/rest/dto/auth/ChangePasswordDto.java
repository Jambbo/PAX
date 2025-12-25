package com.example.system.rest.dto.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDto(

        @NotBlank String currentPassword,
        @NotBlank String newPassword,
        @NotBlank String newPasswordConfirmation
) {

    @AssertTrue
    public boolean isMatching() {
        return newPassword.equals(newPasswordConfirmation);
    }

}
