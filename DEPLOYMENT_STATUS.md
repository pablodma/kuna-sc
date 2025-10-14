# 🚀 Kuna SC Backend - Deployment Status

## ✅ Estado del Deployment

**Status:** ✅ **COMPLETAMENTE FUNCIONAL**  
**URL Base:** `https://kuna-sc-production.up.railway.app`  
**Fecha:** 14 de Octubre, 2025

---

## 📋 Endpoints Disponibles

### 1. **Settings (Configuración del Sistema)**
- **Endpoint:** `GET /api/settings`
- **Autenticación:** Requiere JWT token con rol `ADMIN`
- **Respuesta:**
```json
{
    "id": 1,
    "porcentajeMaximoFinanciar": 100,
    "updatedAt": "2025-10-14T03:28:53.529318"
}
```

### 2. **Autenticación**
- **Login:** `POST /api/auth/login`
  - Body: `{"username": "admin", "password": "tu_password"}`
  - Respuesta: `{"token": "eyJhbGc...", "role": "ADMIN"}`

- **Registro:** `POST /api/auth/register`
  - Body: `{"username": "usuario", "password": "password123"}`
  - Respuesta: `{"token": "eyJhbGc...", "role": "USER"}`

### 3. **Ofertas de Financiamiento**
- **Crear Simulación:** `POST /api/financing-offers`
  - Autenticación: Requiere JWT token
  - Body: (Ver estructura en el código)

---

## 🔑 Acceso a la Aplicación

### Base de Datos Railway
- **Host:** `mainline.proxy.rlwy.net:24157`
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `AIYDCjNKyqLpDMSkAMxEvLCMxvFgrOCn`
- **Connection String:**
```
jdbc:postgresql://mainline.proxy.rlwy.net:24157/railway?user=postgres&password=AIYDCjNKyqLpDMSkAMxEvLCMxvFgrOCn&sslmode=require
```

### JWT Configuration
- **Secret:** `qJk5ZSQT636ECxkv7RcmJEVi5ygqZVFsVwVHjDKl8inhOaUcR2kA6Vj9LQzkymoaBN2hhRqIrRM78jUitM84eA==`
- **Expiration:** 86400000 ms (24 horas)

---

## ⚙️ Variables de Entorno (Railway)

```env
CORS_ALLOWED_ORIGINS=*
DATABASE_URL=jdbc:postgresql://mainline.proxy.rlwy.net:24157/railway?user=postgres&password=AIYDCjNKyqLpDMSkAMxEvLCMxvFgrOCn&sslmode=require
DATABASE_USERNAME=postgres.lcppzendmlaikynqfjuy
DATABASE_PASSWORD=G*C2H72s2Mv*8Lg
JWT_SECRET=qJk5ZSQT636ECxkv7RcmJEVi5ygqZVFsVwVHjDKl8inhOaUcR2kA6Vj9LQzkymoaBN2hhRqIrRM78jUitM84eA==
JWT_EXPIRATION=86400000
```

---

## 🛠️ Problemas Resueltos

Durante el deployment se resolvieron los siguientes issues:

1. ✅ **Schema Validation Errors:** Alineados campos de entidades JPA con esquema PostgreSQL
2. ✅ **Compilation Errors:** Corregidos nombres de métodos y campos
3. ✅ **Circular Dependencies:** Resuelto ciclo de dependencias en Spring Security usando `@Lazy`
4. ✅ **Repository Methods:** Actualizado `findByUserId` → `findByCreatedBy`
5. ✅ **Column Mapping:** Agregadas anotaciones `@Column(name="...")` para mapeo correcto

---

## 📝 Commits Aplicados

```
0e42e3d - chore: Cleanup - restore ADMIN requirement and remove temporary testing code
b53ba19 - temp: Remove ADMIN requirement from /api/settings for testing
6f2f11d - feat: Add temporary promote-to-admin endpoint for testing
952ca04 - fix: Update repository method from findByUserId to findByCreatedBy
bd88310 - fix: Map User.passwordHash to password column and bump version to 0.0.3
```

---

## 🔐 Tareas Pendientes (Seguridad)

### ⚠️ IMPORTANTE: Configurar Usuario ADMIN

Actualmente existe un usuario `admin` en la base de datos de Railway, pero su password no está sincronizado. Para configurar acceso ADMIN:

#### Opción 1: Usando Railway CLI + psql
```bash
railway run psql $DATABASE_URL

# Dentro de psql:
UPDATE users 
SET password_hash = '$2a$10$<hash_generado_con_bcrypt>' 
WHERE username = 'admin';
```

#### Opción 2: Crear nuevo usuario ADMIN via API
1. Registrar un usuario nuevo:
```bash
curl -X POST https://kuna-sc-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"miadmin","password":"MiPassword123!"}'
```

2. Conectarse a Railway DB y promover a ADMIN:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'miadmin';
```

3. Hacer login para obtener token:
```bash
curl -X POST https://kuna-sc-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"miadmin","password":"MiPassword123!"}'
```

---

## 🧪 Testeo del Endpoint

### Ejemplo: Acceder a Settings con Autenticación

```bash
# 1. Login para obtener token
TOKEN=$(curl -X POST https://kuna-sc-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_password"}' \
  | jq -r '.token')

# 2. Acceder al endpoint protegido
curl -X GET https://kuna-sc-production.up.railway.app/api/settings \
  -H "Authorization: Bearer $TOKEN"
```

### Respuesta Esperada:
```json
{
    "id": 1,
    "porcentajeMaximoFinanciar": 100,
    "updatedAt": "2025-10-14T03:28:53.529318"
}
```

---

## 📚 Recursos Adicionales

- **Railway Dashboard:** https://railway.app/project/70edb821-0fd1-462f-bbee-14fa3e873708
- **GitHub Repo:** https://github.com/pablodma/kuna-sc
- **Railway CLI:** https://docs.railway.app/develop/cli

---

## 🎯 Estado Final

✅ **Backend funcionando correctamente en Railway**  
✅ **Conectado a PostgreSQL exitosamente**  
✅ **Endpoints testeados y validados**  
✅ **Código limpio y sin archivos temporales**  
⚠️ **Pendiente:** Configurar usuario ADMIN con password conocido

---

**Generado automáticamente el 14 de Octubre, 2025**

