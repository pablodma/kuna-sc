# Backend - API de Simulación de Crédito

## 📋 Descripción

API REST desarrollada en Java con Spring Boot para el sistema de simulación de ofertas de crédito automotor. Proporciona endpoints para autenticación, creación de simulaciones y configuración del sistema.

## 🏗️ Tecnologías

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - Autenticación JWT
- **Spring Data JPA** - Persistencia
- **PostgreSQL** - Base de datos
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate

## 📁 Estructura

```
src/main/java/com/kavak/financingoffer/
├── controller/          # Controladores REST
│   ├── AuthController.java
│   ├── FinancingOfferController.java
│   └── SettingsController.java
├── entity/              # Entidades JPA
│   ├── User.java
│   ├── OfertaFinanciamiento.java
│   └── AjustesSistema.java
├── repository/          # Repositorios
│   ├── UserRepository.java
│   ├── OfertaFinanciamientoRepository.java
│   └── AjustesSistemaRepository.java
├── service/             # Lógica de negocio
│   ├── UserService.java
│   ├── FinancingOfferService.java
│   ├── BeCleverService.java
│   └── AjustesSistemaService.java
├── security/            # Configuración de seguridad
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   └── SecurityConfig.java
├── dto/                 # Data Transfer Objects
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── FinancingOfferRequest.java
│   ├── SimulacionResponse.java
│   └── SettingsRequest.java
├── exception/           # Manejo de excepciones
│   └── GlobalExceptionHandler.java
└── FinancingOfferApiApplication.java
```

## 🚀 Configuración

### Variables de Entorno

```yaml
# Base de datos
DATABASE_URL: jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres
DATABASE_USERNAME: postgres
DATABASE_PASSWORD: [tu-password]

# JWT
JWT_SECRET: [generar-un-secret-seguro]
JWT_EXPIRATION: 86400000  # 24 horas

# CORS
CORS_ALLOWED_ORIGINS: http://localhost:3000
CORS_ALLOWED_METHODS: GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS: *
CORS_ALLOW_CREDENTIALS: true

# Admin por defecto
ADMIN_USERNAME: admin
ADMIN_PASSWORD: admin123
```

### Configuración de Desarrollo

```bash
# Crear perfil local
cp src/main/resources/application.yml src/main/resources/application-local.yml

# Ejecutar con perfil local
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/login`
Iniciar sesión de usuario.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

#### POST `/api/auth/register`
Registrar nuevo usuario.

**Request:**
```json
{
  "username": "nuevo_usuario",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "USER"
}
```

### Simulaciones

#### POST `/api/financing-offers`
Crear nueva simulación de crédito.

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: application/json
```

**Request:**
```json
{
  "cliente": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "40123123",
    "ingresosAnuales": 8500000
  },
  "vehiculo": {
    "marca": "Toyota",
    "modelo": "Corolla",
    "version": "XEI",
    "anio": 2020,
    "sku": "KAV123456"
  },
  "porcentajeFinanciar": 45,
  "dealId": "0199b526-6c22-7cf5-bd9b-df77004d769e",
  "subsidiary": 8,
  "country": "AR"
}
```

**Response:**
```json
{
  "montoTotal": 12500000,
  "montoFinanciado": 5625000,
  "simulaciones": [
    {
      "meses": 12,
      "cuotaMensual": 512000,
      "tna": 82.3,
      "tae": 102.1
    },
    {
      "meses": 24,
      "cuotaMensual": 285000,
      "tna": 78.5,
      "tae": 98.7
    }
  ]
}
```

### Configuración

#### GET `/api/settings`
Obtener configuración actual del sistema.

**Headers:**
```
Authorization: Bearer [jwt-token]
```

**Response:**
```json
{
  "id": 1,
  "porcentajeMaximo": 50,
  "actualizadoPor": "admin",
  "timestamp": "2025-01-08T20:25:41.591Z"
}
```

#### PATCH `/api/settings`
Actualizar configuración del sistema (solo ADMIN).

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: application/json
```

**Request:**
```json
{
  "porcentajeMaximo": 60
}
```

**Response:**
```json
{
  "id": 2,
  "porcentajeMaximo": 60,
  "actualizadoPor": "admin",
  "timestamp": "2025-01-08T21:30:15.123Z"
}
```

## 🔐 Seguridad

### JWT Authentication
- Tokens con expiración configurable (24 horas por defecto)
- Algoritmo HS256 para firma
- Interceptor automático para validación

### Roles
- **USER**: Puede crear simulaciones y ver sus propias ofertas
- **ADMIN**: Acceso completo, puede modificar configuración del sistema

### CORS
- Configurado para permitir requests desde el frontend
- Credenciales habilitadas
- Métodos HTTP permitidos: GET, POST, PUT, DELETE, PATCH, OPTIONS

## 🧪 Testing

### Ejecutar Tests
```bash
mvn test
```

### Tests de Integración
```bash
mvn test -Dtest=*IntegrationTest
```

### Coverage
```bash
mvn jacoco:report
```

## 📊 Mock BeClever

El servicio mock simula el comportamiento del servicio real de BeClever:

### Características
- Genera monto total aleatorio entre $5M - $20M ARS
- Calcula simulaciones para plazos de 12 a 84 meses (incremento de 6)
- TNA entre 70-90% (aleatorio)
- TAE calculado usando fórmula financiera
- Cuotas mensuales con fórmula de cuota fija

### Fórmulas Utilizadas
```java
// TAE = (1 + TNA/12)^12 - 1
double tae = (Math.pow(1 + tna / 1200, 12) - 1) * 100;

// Cuota fija: C = P * [r(1+r)^n] / [(1+r)^n - 1]
double cuota = monto * (r * factor) / (factor - 1);
```

## 🐛 Manejo de Errores

### Excepciones Globales
- `MethodArgumentNotValidException` - Errores de validación
- `RuntimeException` - Errores de negocio
- `Exception` - Errores genéricos

### Formato de Error
```json
{
  "error": "Mensaje de error descriptivo"
}
```

### Códigos HTTP
- `200` - OK
- `400` - Bad Request (validación)
- `401` - Unauthorized (JWT inválido)
- `403` - Forbidden (sin permisos)
- `500` - Internal Server Error

## 📈 Monitoreo

### Logs
- Configuración con Logback
- Niveles configurables por paquete
- Logs estructurados en JSON (producción)

### Métricas
- Actuator endpoints habilitados
- Health checks
- Métricas de JVM

## 🚀 Deployment

### Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/financing-offer-api-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Variables de Producción
```bash
export DATABASE_URL="jdbc:postgresql://..."
export JWT_SECRET="[secret-seguro]"
export CORS_ALLOWED_ORIGINS="https://tu-frontend.com"
```

## 🔧 Desarrollo

### Comandos Útiles
```bash
# Limpiar e instalar
mvn clean install

# Ejecutar en desarrollo
mvn spring-boot:run

# Generar documentación
mvn javadoc:javadoc

# Análisis de código
mvn spotbugs:check
mvn checkstyle:check
```

### IDE Setup
- **IntelliJ IDEA**: Importar como proyecto Maven
- **VS Code**: Extensiones Java y Spring Boot
- **Eclipse**: Importar proyecto Maven existente

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs de la aplicación
2. Verificar configuración de variables de entorno
3. Consultar documentación de Spring Boot
4. Revisar issues en el repositorio

---

**Versión**: 1.0.0  
**Java**: 17+  
**Spring Boot**: 3.2.0






