# Base de Datos - Sistema de Simulación de Crédito Kavak

## Descripción

Este directorio contiene los scripts SQL necesarios para configurar la base de datos PostgreSQL en Supabase para el sistema de simulación de ofertas de crédito automotor.

## Archivos

- `schema.sql` - Script principal con todas las tablas, índices, funciones y políticas de seguridad

## Configuración en Supabase

### 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear una nueva cuenta o iniciar sesión
3. Crear un nuevo proyecto
4. Seleccionar la región más cercana (recomendado: South America)
5. Configurar contraseña de la base de datos

### 2. Ejecutar Scripts

1. Ir a la sección "SQL Editor" en el dashboard de Supabase
2. Copiar y pegar el contenido de `schema.sql`
3. Ejecutar el script

### 3. Configurar Variables de Entorno

Una vez creado el proyecto, obtener las credenciales:

```bash
# En el archivo .env del backend
DATABASE_URL=jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[tu-password]
JWT_SECRET=[generar-un-secret-seguro]
```

### 4. Obtener Credenciales de Supabase

En el dashboard de Supabase:
- **Project URL**: `https://[project-ref].supabase.co`
- **API Key (anon)**: Para el frontend
- **API Key (service_role)**: Para el backend (si se usa)

## Estructura de la Base de Datos

### Tablas Principales

#### `users`
- Almacena usuarios del sistema
- Roles: `USER`, `ADMIN`
- Autenticación con JWT

#### `ofertas_financiamiento`
- Almacena todas las simulaciones generadas
- Incluye datos del cliente, vehículo y financiamiento
- Campos adicionales para integración con CRM

#### `ajustes_sistema`
- Configuración del sistema
- Principalmente el porcentaje máximo de financiamiento
- Historial de cambios

### Funciones

- `get_current_settings()` - Obtiene la configuración actual
- `update_porcentaje_maximo()` - Actualiza el porcentaje máximo

### Vistas

- `estadisticas_ofertas` - Estadísticas mensuales de ofertas

### Seguridad

- Row Level Security (RLS) habilitado
- Políticas de acceso basadas en roles
- Usuarios solo pueden ver sus propias ofertas
- Admins pueden ver y modificar todo

## Usuarios por Defecto

El script crea dos usuarios de prueba:

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: `ADMIN`

### Usuario Normal
- **Usuario**: `user`
- **Contraseña**: `user123`
- **Rol**: `USER`

## Configuración Inicial

- Porcentaje máximo de financiamiento: **50%**
- Configuración creada por: `system`

## Monitoreo y Mantenimiento

### Consultas Útiles

```sql
-- Ver todas las ofertas de un usuario
SELECT * FROM ofertas_financiamiento WHERE user_id = '[user-id]';

-- Ver estadísticas mensuales
SELECT * FROM estadisticas_ofertas;

-- Ver configuración actual
SELECT * FROM get_current_settings();

-- Ver usuarios del sistema
SELECT username, role, created_at FROM users;
```

### Backup

Supabase maneja automáticamente los backups, pero se recomienda:
- Exportar datos importantes regularmente
- Mantener copias de los scripts SQL
- Documentar cambios en la estructura

## Troubleshooting

### Error de Conexión
- Verificar que las credenciales sean correctas
- Confirmar que el proyecto esté activo en Supabase
- Revisar la configuración de firewall

### Error de Permisos
- Verificar que RLS esté configurado correctamente
- Confirmar que las políticas de seguridad sean apropiadas
- Revisar los roles de usuario

### Error de JWT
- Verificar que el JWT_SECRET sea consistente
- Confirmar que los tokens no hayan expirado
- Revisar la configuración de CORS

## Soporte

Para problemas específicos de Supabase:
- [Documentación de Supabase](https://supabase.com/docs)
- [Comunidad de Supabase](https://github.com/supabase/supabase/discussions)
- [Discord de Supabase](https://discord.supabase.com)






