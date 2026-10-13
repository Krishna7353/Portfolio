package com.portfolio.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ContactMessage() {
        // required by JPA
    }

    public ContactMessage(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
}
