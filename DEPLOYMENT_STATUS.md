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

## 🔐 Credenciales de Acceso ADMIN

### ✅ Usuario ADMIN Configurado

El usuario admin está completamente configurado y funcional:

**Credenciales:**
- **Username:** `admin`
- **Password:** `admin123`

El password se inicializa automáticamente al arrancar la aplicación mediante el `DataInitializer` component.

**Ejemplo de Login:**
```bash
curl -X POST https://kuna-sc-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN"
}
```

---

## 🧪 Testeo del Endpoint

### Ejemplo Completo: Acceder a Settings con Autenticación

```bash
# 1. Login para obtener token (usa credenciales admin/admin123)
TOKEN=$(curl -X POST https://kuna-sc-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
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
✅ **Usuario ADMIN configurado (admin/admin123)**  
✅ **Autenticación JWT funcionando correctamente**

---

**Generado automáticamente el 14 de Octubre, 2025**

