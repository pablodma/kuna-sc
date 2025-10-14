-- Script de inicialización de datos
-- Este script se ejecuta automáticamente al iniciar Spring Boot si está configurado

-- Actualizar password del usuario admin a "admin123"
-- Hash BCrypt generado para "admin123": $2a$10$rI3V7vEJF9zJI3JxQqXZyuNyqQ7dLJPnC6JX3xYV0JhHZR5YXqJ6W
UPDATE users 
SET password_hash = '$2a$10$rI3V7vEJF9zJI3JxQqXZyuNyqQ7dLJPnC6JX3xYV0JhHZR5YXqJ6W'
WHERE username = 'admin' AND password_hash != '$2a$10$rI3V7vEJF9zJI3JxQqXZyuNyqQ7dLJPnC6JX3xYV0JhHZR5YXqJ6W';

