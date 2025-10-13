# Sistema de Simulación de Ofertas de Crédito Kavak

## 📋 Descripción

Sistema completo para simular ofertas de crédito automotor con integración de datos del CRM. Permite a los usuarios del backoffice cargar datos del cliente y vehículo, seleccionar el porcentaje a financiar, y generar simulaciones de cuotas con desglose financiero completo.

## 🏗️ Arquitectura

- **Frontend**: React + Next.js 14 con TypeScript
- **Backend**: Java + Spring Boot 3.x
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT Bearer Token
- **Estilos**: TailwindCSS

## 📁 Estructura del Proyecto

```
kuna-ar/
├── backend/                 # API Spring Boot
│   ├── src/main/java/
│   │   └── com/kavak/financingoffer/
│   │       ├── controller/  # Controladores REST
│   │       ├── entity/      # Entidades JPA
│   │       ├── repository/  # Repositorios
│   │       ├── service/     # Lógica de negocio
│   │       ├── security/    # Configuración JWT
│   │       └── dto/         # Data Transfer Objects
│   └── pom.xml
├── frontend/                # Aplicación Next.js
│   ├── app/                 # App Router
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilidades y API
│   └── store/               # Estado global (Zustand)
├── database/                # Scripts SQL
│   ├── schema.sql           # Esquema completo
│   └── README.md            # Documentación BD
└── README.md                # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Java 17+
- Node.js 18+
- Maven 3.6+
- Cuenta de Supabase

### 1. Configurar Base de Datos

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script `database/schema.sql` en el SQL Editor
3. Obtener las credenciales de conexión

### 2. Configurar Backend

```bash
cd backend

# Crear archivo de configuración
cp src/main/resources/application.yml src/main/resources/application-local.yml

# Editar variables de entorno
# DATABASE_URL=jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=[tu-password]
# JWT_SECRET=[generar-un-secret-seguro]

# Instalar dependencias y ejecutar
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Editar .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 🔐 Usuarios por Defecto

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Permisos**: Acceso completo, configuración del sistema

### Usuario Normal
- **Usuario**: `user`
- **Contraseña**: `user123`
- **Permisos**: Crear simulaciones, ver sus propias ofertas

## 📊 Funcionalidades

### Para Usuarios (USER)
- ✅ Login/Registro
- ✅ Simular orden de venta
- ✅ Precarga automática de datos del CRM
- ✅ Selección de vehículo (marca, modelo, versión)
- ✅ Slider de porcentaje a financiar
- ✅ Visualización de cuotas (12-84 meses)
- ✅ Desglose financiero (TNA, TAE, total)

### Para Administradores (ADMIN)
- ✅ Todas las funcionalidades de usuario
- ✅ Configuración del porcentaje máximo de financiamiento
- ✅ Acceso a todas las ofertas del sistema

## 🔌 Integración con CRM

El sistema está preparado para recibir datos del CRM en formato JSON:

```json
{
  "deal_id": "0199b526-6c22-7cf5-bd9b-df77004d769e",
  "fiscal_data": {
    "full_name": "Mariano Gabriel Cabrera",
    "document_number": "23422486909"
  },
  "sales_order": {
    "product": {
      "name": "Toyota Corolla XEI",
      "sku": "32311304"
    },
    "initial_value": "991250"
  }
}
```

### Mapeo de Datos
- `fiscal_data.full_name` → Nombre y apellido del cliente
- `fiscal_data.document_number` → DNI
- `sales_order.product.name` → Marca/Modelo del vehículo
- `sales_order.product.sku` → SKU
- `sales_order.initial_value` → Precio del vehículo

## 🛠️ API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Simulaciones
- `POST /api/financing-offers` - Crear simulación (autenticado)

### Configuración
- `GET /api/settings` - Obtener configuración (autenticado)
- `PATCH /api/settings` - Actualizar configuración (solo ADMIN)

## 🎨 Mock de BeClever

El servicio mock genera:
- Monto total aleatorio ($5M - $20M ARS)
- Simulaciones para plazos: 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84 meses
- TNA entre 70-90%
- TAE calculado
- Cuotas mensuales con fórmulas financieras realistas

## 🚀 Deployment

### Backend (Vercel/Heroku)
```bash
# Crear Dockerfile
# Configurar variables de entorno de producción
# Deploy con Maven o Docker
```

### Frontend (Vercel)
```bash
# Conectar repositorio a Vercel
# Configurar variables de entorno
# Deploy automático desde Git
```

### Variables de Entorno de Producción

**Backend:**
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

**Frontend:**
- `NEXT_PUBLIC_API_URL`

## 📈 Monitoreo

### Logs
- Backend: Logs de Spring Boot con niveles configurables
- Frontend: Console logs en desarrollo

### Métricas
- Consulta `estadisticas_ofertas` en la base de datos
- Dashboard de Supabase para métricas de BD

## 🔧 Desarrollo

### Comandos Útiles

```bash
# Backend
mvn clean install          # Instalar dependencias
mvn spring-boot:run        # Ejecutar en desarrollo
mvn test                   # Ejecutar tests

# Frontend
npm install                # Instalar dependencias
npm run dev                # Desarrollo
npm run build              # Build de producción
npm run lint               # Linter
```

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

## 🐛 Troubleshooting

### Error de Conexión a BD
- Verificar credenciales de Supabase
- Confirmar que el proyecto esté activo
- Revisar configuración de firewall

### Error de JWT
- Verificar JWT_SECRET
- Confirmar que los tokens no hayan expirado
- Revisar configuración de CORS

### Error de CORS
- Verificar CORS_ALLOWED_ORIGINS
- Confirmar que el frontend esté en la lista permitida

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs del backend y frontend
2. Verificar configuración de variables de entorno
3. Consultar documentación de Supabase
4. Revisar issues en el repositorio

## 📄 Licencia

Este proyecto es propiedad de Kavak y está destinado para uso interno.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Mantenido por**: Equipo de Desarrollo Kavak






