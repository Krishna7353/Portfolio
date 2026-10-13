package com.portfolio.backend.controller;

import com.portfolio.backend.dto.ContactRequest;
import com.portfolio.backend.model.ContactMessage;
import com.portfolio.backend.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final int MAX_PER_HOUR = 5;

    private final ContactMessageRepository repository;
    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public ContactController(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest req,
                                                      HttpServletRequest http) {
        // honeypot: pretend success so bots don't learn anything
        if (req.website() != null && !req.website().isBlank()) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        }

        if (tooManyRequests(http.getRemoteAddr())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many messages from this device. Please try again later."));
        }

        repository.save(new ContactMessage(
                req.name().trim(),
                req.email().trim(),
                req.message().trim()));

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "saved"));
    }

    /** Simple in-memory limit: MAX_PER_HOUR messages per IP address per hour. */
    private boolean tooManyRequests(String ip) {
        Deque<Instant> times = hits.computeIfAbsent(ip, k -> new ConcurrentLinkedDeque<>());
        Instant cutoff = Instant.now().minus(1, ChronoUnit.HOURS);
        while (!times.isEmpty() && times.peekFirst().isBefore(cutoff)) {
            times.pollFirst();
        }
        if (times.size() >= MAX_PER_HOUR) {
            return true;
        }
        times.addLast(Instant.now());
        return false;
    }

    /** Handy for health checks on Render/Railway. */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "up");
    }
}
