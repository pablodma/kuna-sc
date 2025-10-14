package com.kavak.sc.oferta.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        try {
            // Generar hash para password "admin123"
            String adminPasswordHash = passwordEncoder.encode("admin123");
            
            // Actualizar password del usuario admin
            // La columna en Railway se llama 'password' no 'password_hash'
            int rowsUpdated = jdbcTemplate.update(
                "UPDATE users SET password = ? WHERE username = 'admin'",
                adminPasswordHash
            );
            
            if (rowsUpdated > 0) {
                log.info("✅ Admin user password initialized successfully");
            } else {
                log.warn("⚠️ Admin user not found in database");
            }
            
        } catch (Exception e) {
            log.error("❌ Error initializing admin password: {}", e.getMessage());
        }
    }
}

