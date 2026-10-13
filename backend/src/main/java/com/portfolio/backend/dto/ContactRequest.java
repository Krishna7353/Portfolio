package com.portfolio.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Body of POST /api/contact.
 * "website" is a honeypot: it is hidden in the UI, so only bots fill it in.
 */
public record ContactRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 5, max = 2000) String message,
        String website
) {
}
