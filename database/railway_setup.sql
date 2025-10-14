-- ==========================================
-- RAILWAY POSTGRESQL SETUP SCRIPT
-- ==========================================
-- Este script crea todas las tablas necesarias para el proyecto

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: users (usuarios del sistema)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('USER', 'ADMIN'))
);

-- Tabla: ajustes_sistema (configuración global)
CREATE TABLE IF NOT EXISTS ajustes_sistema (
    id SERIAL PRIMARY KEY,
    porcentaje_maximo_financiar INTEGER NOT NULL DEFAULT 100,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ajustes_porcentaje_check CHECK (porcentaje_maximo_financiar > 0 AND porcentaje_maximo_financiar <= 100)
);

-- Tabla: ofertas_financiamiento (simulaciones guardadas)
CREATE TABLE IF NOT EXISTS ofertas_financiamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Datos del cliente
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_apellido VARCHAR(100) NOT NULL,
    cliente_dni VARCHAR(20) NOT NULL,
    cliente_ingresos_anuales DECIMAL(15, 2) NOT NULL,
    
    -- Datos del vehículo
    vehiculo_marca VARCHAR(50) NOT NULL,
    vehiculo_modelo VARCHAR(50) NOT NULL,
    vehiculo_version VARCHAR(100) NOT NULL,
    vehiculo_anio INTEGER NOT NULL,
    vehiculo_sku VARCHAR(50) NOT NULL,
    
    -- Datos de financiamiento
    porcentaje_financiar INTEGER NOT NULL,
    monto_total DECIMAL(15, 2) NOT NULL,
    monto_financiado DECIMAL(15, 2) NOT NULL,
    
    -- Datos de integración CRM
    deal_id VARCHAR(100),
    subsidiary INTEGER,
    country VARCHAR(10),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT ofertas_porcentaje_check CHECK (porcentaje_financiar > 0 AND porcentaje_financiar <= 100),
    CONSTRAINT ofertas_anio_check CHECK (vehiculo_anio >= 1990 AND vehiculo_anio <= 2025)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_ofertas_cliente_dni ON ofertas_financiamiento(cliente_dni);
CREATE INDEX IF NOT EXISTS idx_ofertas_deal_id ON ofertas_financiamiento(deal_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_created_at ON ofertas_financiamiento(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ==========================================
-- DATOS INICIALES
-- ==========================================

-- Insertar ajuste por defecto (porcentaje máximo 100%)
INSERT INTO ajustes_sistema (porcentaje_maximo_financiar)
VALUES (100)
ON CONFLICT DO NOTHING;

-- Insertar usuarios de prueba
-- Password para ambos: "password123"
-- Hash generado con BCrypt (rounds=10)
INSERT INTO users (username, password, role)
VALUES 
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
    ('user', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER')
ON CONFLICT (username) DO NOTHING;

-- Verificar que todo se creó correctamente
SELECT 
    'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 
    'ajustes_sistema' as tabla, COUNT(*) as registros FROM ajustes_sistema
UNION ALL
SELECT 
    'ofertas_financiamiento' as tabla, COUNT(*) as registros FROM ofertas_financiamiento;

-- Fin del script



