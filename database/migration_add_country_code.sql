-- Migration: Add country_code support for multi-country architecture
-- Date: 2025-10-14
-- Description: Add country_code column to all main tables and create indexes

-- ========================================
-- 1. Add country_code to ofertas_financiamiento
-- ========================================
ALTER TABLE ofertas_financiamiento 
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) NOT NULL DEFAULT 'AR';

-- Create index for faster queries by country
CREATE INDEX IF NOT EXISTS idx_ofertas_country 
ON ofertas_financiamiento(country_code);

-- ========================================
-- 2. Add country_code to ajustes_sistema
-- ========================================
ALTER TABLE ajustes_sistema 
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) NOT NULL DEFAULT 'AR';

-- Create index for faster queries by country
CREATE INDEX IF NOT EXISTS idx_ajustes_country 
ON ajustes_sistema(country_code);

-- ========================================
-- 3. Add country_code to users (optional)
-- ========================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country_code VARCHAR(2) DEFAULT 'AR';

-- ========================================
-- 4. Create ajustes_sistema entry for Chile
-- ========================================
-- First, check if we have settings for Argentina
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM ajustes_sistema WHERE country_code = 'AR'
    ) THEN
        -- Copy Argentina settings to Chile if Chile doesn't exist yet
        INSERT INTO ajustes_sistema (porcentaje_maximo_financiar, country_code, updated_at)
        SELECT porcentaje_maximo_financiar, 'CL', NOW()
        FROM ajustes_sistema
        WHERE country_code = 'AR'
        ORDER BY updated_at DESC
        LIMIT 1
        ON CONFLICT DO NOTHING;
    ELSE
        -- Create default settings for both countries if none exist
        INSERT INTO ajustes_sistema (porcentaje_maximo_financiar, country_code, updated_at)
        VALUES (50, 'AR', NOW()), (50, 'CL', NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ========================================
-- 5. Verification queries (commented out)
-- ========================================
-- Uncomment to verify after running migration:

-- SELECT COUNT(*), country_code FROM ofertas_financiamiento GROUP BY country_code;
-- SELECT * FROM ajustes_sistema ORDER BY country_code, updated_at DESC;
-- SELECT COUNT(*), country_code FROM users WHERE country_code IS NOT NULL GROUP BY country_code;

-- ========================================
-- Migration complete
-- ========================================

