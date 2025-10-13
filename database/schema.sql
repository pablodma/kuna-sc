-- Script SQL para Supabase PostgreSQL
-- Sistema de Simulación de Ofertas de Crédito Kavak

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ofertas de financiamiento
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
    -- Campos adicionales para integración con CRM
    deal_id VARCHAR(100),
    subsidiary INTEGER,
    country VARCHAR(10)
);

-- Tabla de ajustes del sistema
CREATE TABLE IF NOT EXISTS ajustes_sistema (
    id SERIAL PRIMARY KEY,
    porcentaje_maximo INTEGER NOT NULL CHECK (porcentaje_maximo >= 1 AND porcentaje_maximo <= 100),
    actualizado_por VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_ofertas_user_id ON ofertas_financiamiento(user_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_deal_id ON ofertas_financiamiento(deal_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_fecha_creacion ON ofertas_financiamiento(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_ajustes_timestamp ON ajustes_sistema(timestamp);

-- Insertar configuración inicial del sistema
INSERT INTO ajustes_sistema (porcentaje_maximo, actualizado_por) 
VALUES (50, 'system')
ON CONFLICT DO NOTHING;

-- Crear usuario administrador por defecto (contraseña: admin123)
-- La contraseña está hasheada con BCrypt
INSERT INTO users (username, password_hash, role) 
VALUES (
    'admin', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 
    'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

-- Crear usuario de prueba (contraseña: user123)
INSERT INTO users (username, password_hash, role) 
VALUES (
    'user', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'USER'
)
ON CONFLICT (username) DO NOTHING;

-- Comentarios sobre las tablas
COMMENT ON TABLE users IS 'Usuarios del sistema con roles USER y ADMIN';
COMMENT ON TABLE ofertas_financiamiento IS 'Ofertas de financiamiento generadas por los usuarios';
COMMENT ON TABLE ajustes_sistema IS 'Configuración del sistema, especialmente porcentajes máximos';

COMMENT ON COLUMN users.role IS 'Rol del usuario: USER (usuario normal) o ADMIN (administrador)';
COMMENT ON COLUMN ofertas_financiamiento.deal_id IS 'ID del deal en el CRM/Salesforce';
COMMENT ON COLUMN ofertas_financiamiento.subsidiary IS 'ID de la subsidiaria en el CRM';
COMMENT ON COLUMN ofertas_financiamiento.country IS 'País del cliente (ej: AR)';
COMMENT ON COLUMN ajustes_sistema.porcentaje_maximo IS 'Porcentaje máximo permitido para financiamiento';

-- Función para obtener la configuración actual del sistema
CREATE OR REPLACE FUNCTION get_current_settings()
RETURNS TABLE (
    id INTEGER,
    porcentaje_maximo INTEGER,
    actualizado_por VARCHAR,
    timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.porcentaje_maximo, a.actualizado_por, a.timestamp
    FROM ajustes_sistema a
    ORDER BY a.timestamp DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar el porcentaje máximo
CREATE OR REPLACE FUNCTION update_porcentaje_maximo(
    new_porcentaje INTEGER,
    updated_by VARCHAR
)
RETURNS TABLE (
    id INTEGER,
    porcentaje_maximo INTEGER,
    actualizado_por VARCHAR,
    timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Validar que el porcentaje esté en el rango válido
    IF new_porcentaje < 1 OR new_porcentaje > 100 THEN
        RAISE EXCEPTION 'El porcentaje debe estar entre 1 y 100';
    END IF;
    
    -- Insertar nueva configuración
    INSERT INTO ajustes_sistema (porcentaje_maximo, actualizado_por)
    VALUES (new_porcentaje, updated_by);
    
    -- Retornar la nueva configuración
    RETURN QUERY
    SELECT a.id, a.porcentaje_maximo, a.actualizado_por, a.timestamp
    FROM ajustes_sistema a
    WHERE a.actualizado_por = updated_by
    ORDER BY a.timestamp DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Vista para estadísticas de ofertas
CREATE OR REPLACE VIEW estadisticas_ofertas AS
SELECT 
    DATE_TRUNC('month', fecha_creacion) as mes,
    COUNT(*) as total_ofertas,
    AVG(porcentaje_financiar) as porcentaje_promedio,
    AVG(monto_financiado) as monto_promedio,
    SUM(monto_financiado) as monto_total_mes
FROM ofertas_financiamiento
GROUP BY DATE_TRUNC('month', fecha_creacion)
ORDER BY mes DESC;

-- Políticas de seguridad (RLS) para Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_financiamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE ajustes_sistema ENABLE ROW LEVEL SECURITY;

-- Política para usuarios: solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Política para ofertas: usuarios pueden ver sus propias ofertas, admins pueden ver todas
CREATE POLICY "Users can view own offers" ON ofertas_financiamiento
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid AND role = 'ADMIN'
        )
    );

-- Política para ofertas: usuarios pueden insertar sus propias ofertas
CREATE POLICY "Users can insert own offers" ON ofertas_financiamiento
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Política para ajustes: solo admins pueden ver y modificar
CREATE POLICY "Only admins can manage settings" ON ajustes_sistema
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid AND role = 'ADMIN'
        )
    );






