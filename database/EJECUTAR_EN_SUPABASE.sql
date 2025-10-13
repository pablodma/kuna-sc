-- ============================================
-- SCRIPT PARA CREAR BASE DE DATOS - KUNA SOUTH CONE
-- Ejecutar en: https://supabase.com/dashboard/project/lcppzendmlaikynqfjuy/sql/new
-- ============================================

-- Paso 1: Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Paso 2: Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 3: Crear tabla de ofertas de financiamiento
CREATE TABLE IF NOT EXISTS ofertas_financiamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    ingresos_anuales NUMERIC(15,2) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio >= 1990 AND anio <= 2025),
    sku VARCHAR(50) NOT NULL,
    monto_total_auto NUMERIC(15,2) NOT NULL,
    porcentaje_financiar INTEGER NOT NULL CHECK (porcentaje_financiar >= 1 AND porcentaje_financiar <= 100),
    monto_financiado NUMERIC(15,2) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Campos del CRM
    deal_id VARCHAR(100),
    subsidiary INTEGER,
    country VARCHAR(10)
);

-- Paso 4: Crear tabla de ajustes del sistema
CREATE TABLE IF NOT EXISTS ajustes_sistema (
    id SERIAL PRIMARY KEY,
    porcentaje_maximo INTEGER NOT NULL CHECK (porcentaje_maximo >= 1 AND porcentaje_maximo <= 100),
    actualizado_por VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 5: Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_ofertas_user_id ON ofertas_financiamiento(user_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_deal_id ON ofertas_financiamiento(deal_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_fecha_creacion ON ofertas_financiamiento(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_ajustes_timestamp ON ajustes_sistema(timestamp);

-- Paso 6: Insertar configuración inicial del sistema
INSERT INTO ajustes_sistema (porcentaje_maximo, actualizado_por) 
VALUES (50, 'system')
ON CONFLICT DO NOTHING;

-- Paso 7: Crear usuario administrador
-- Usuario: admin | Contraseña: admin123
INSERT INTO users (username, password_hash, role) 
VALUES (
    'admin', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 
    'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

-- Paso 8: Crear usuario normal de prueba
-- Usuario: user | Contraseña: user123
INSERT INTO users (username, password_hash, role) 
VALUES (
    'user', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'USER'
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- VERIFICACIÓN - Ejecutar después para confirmar
-- ============================================

-- Ver usuarios creados:
-- SELECT username, role, created_at FROM users;

-- Ver configuración:
-- SELECT * FROM ajustes_sistema;

-- Ver todas las tablas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';




