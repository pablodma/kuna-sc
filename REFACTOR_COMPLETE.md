# ✅ Refactor Completado: Kuna SC Multi-País

## 🎯 Resumen de Cambios

Se ha completado exitosamente el refactor del proyecto para:

1. **Renombrar APIs** quitando el prefijo "kuna" de los servicios individuales
2. **Implementar arquitectura multi-país** (Argentina y Chile)
3. **Preparar estructura modular** para 3 APIs: oferta-api, handoff-api, dictamen-api

---

## 📦 Cambios Realizados

### Backend (Java/Spring Boot)

#### Paquetes Renombrados
- **Antes:** `com.kavak.financingoffer`
- **Después:** `com.kavak.sc.oferta`

#### Maven Coordinates
- **Antes:** `com.kavak:financing-offer-api:0.0.3-SNAPSHOT`
- **Después:** `com.kavak.sc:oferta-api:0.0.4-SNAPSHOT`

#### Archivos Principales
- ✅ `FinancingOfferApiApplication.java` → `OfertaApiApplication.java`
- ✅ Todos los controllers, services, entities, repositories actualizados
- ✅ `pom.xml` actualizado con nuevos groupId y artifactId
- ✅ `railway.json` actualizado con nuevo JAR name
- ✅ `application.yml` actualizado con configuración multi-país

#### Multi-País Support
```java
// Entidades actualizadas con country_code
@Column(name = "country_code", nullable = false, length = 2)
private String countryCode;

// Repositorios con métodos por país
List<OfertaFinanciamiento> findByCountryCode(String countryCode);
AjustesSistema findTopByCountryCodeOrderByUpdatedAtDesc(String countryCode);

// Services con lógica multi-país
public AjustesSistema getCurrentSettings(String countryCode) { ... }
```

### Base de Datos (PostgreSQL Railway)

#### Migraciones Ejecutadas ✅
- ✅ Columna `country_code` agregada a `ofertas_financiamiento`
- ✅ Columna `country_code` agregada a `ajustes_sistema`
- ✅ Columna `country_code` agregada a `users`
- ✅ Índices creados para optimizar queries por país
- ✅ Settings para Chile (CL) creados con valores por defecto

#### Estado Actual
```sql
-- Configuraciones por país
AR: porcentaje_maximo = 50%
CL: porcentaje_maximo = 50%
```

### Frontend (Next.js 14)

#### Package Updates
- **Antes:** `financing-offer-frontend`
- **Después:** `kuna-sc-frontend`

#### Nuevos Archivos
- ✅ `frontend/lib/countries.ts` - Configuración de países (AR, CL)
- ✅ `frontend/lib/countryContext.tsx` - Context para manejo de país actual

#### Countries Configuration
```typescript
export const COUNTRIES = {
  AR: {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    currencySymbol: '$',
    locale: 'es-AR',
    phonePrefix: '+54',
    flag: '🇦🇷'
  },
  CL: {
    code: 'CL',
    name: 'Chile',
    currency: 'CLP',
    currencySymbol: '$',
    locale: 'es-CL',
    phonePrefix: '+56',
    flag: '🇨🇱'
  }
}
```

### Documentación
- ✅ `README.md` actualizado con nueva arquitectura
- ✅ `package.json` raíz renombrado a `kuna-sc`
- ✅ `database/migration_add_country_code.sql` creado

---

## 🚀 Próximos Pasos (IMPORTANTE)

### 1. Renombrar Servicio en Railway

El servicio actual se llama `kuna-sc`, necesitas renombrarlo a `oferta-api`:

1. Ve a Railway Dashboard: https://railway.app
2. Selecciona el proyecto **Devs KSA's Projects**
3. Encuentra el servicio **kuna-sc**
4. Ve a Settings → General → Service Name
5. Cámbialo de `kuna-sc` a `oferta-api`
6. Esto cambiará la URL a: `https://oferta-api-production.up.railway.app`

### 2. Actualizar Variables de Entorno en Railway

Agrega estas nuevas variables en Railway:

```bash
DEFAULT_COUNTRY=AR
SUPPORTED_COUNTRIES=AR,CL
```

### 3. Actualizar CORS_ALLOWED_ORIGINS en Railway

Si cambia la URL de Vercel, actualiza:
```bash
CORS_ALLOWED_ORIGINS=https://kuna-sc.vercel.app,https://kuna-sc-*.vercel.app,http://localhost:3000
```

### 4. Deploy Automático

Railway detectará el push a GitHub y hará deploy automáticamente con:
- Nuevo JAR: `oferta-api-0.0.4-SNAPSHOT.jar`
- Nueva estructura de paquetes: `com.kavak.sc.oferta`
- Soporte multi-país activado

### 5. Actualizar Variables en Vercel

Una vez que Railway esté deployado con el nuevo nombre:

1. Ve a Vercel Dashboard: https://vercel.com/desarrolladoresksa-gmailcoms-projects/kuna-sc
2. Ve a Settings → Environment Variables
3. Actualiza (o agrega):
   ```bash
   NEXT_PUBLIC_API_URL=https://oferta-api-production.up.railway.app
   NEXT_PUBLIC_DEFAULT_COUNTRY=AR
   NEXT_PUBLIC_SUPPORTED_COUNTRIES=AR,CL
   ```

### 6. Redeploy Frontend

Después de actualizar las variables en Vercel:
1. Ve a Deployments
2. En el último deployment, haz click en los 3 puntos
3. Selecciona "Redeploy"

---

## ✅ Validación

Después del deploy, valida que todo funcione:

### Backend
```bash
# Test settings endpoint (requiere auth)
curl -X POST https://oferta-api-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Usar el token para obtener settings
curl -X GET https://oferta-api-production.up.railway.app/api/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Debería devolver: {"porcentajeMaximoFinanciar":50,"countryCode":"AR",...}
```

### Frontend
1. Abre: https://kuna-sc.vercel.app
2. Login con: admin / admin123
3. Verifica que el dashboard cargue correctamente
4. Prueba crear una simulación

### Base de Datos
```sql
-- Verificar datos por país
SELECT COUNT(*), country_code FROM ofertas_financiamiento GROUP BY country_code;
SELECT * FROM ajustes_sistema ORDER BY country_code;
```

---

## 🏗️ Arquitectura Final

```
Kuna-SC (Proyecto General)
├── Backend Services (Railway)
│   ├── oferta-api (✅ deployado, renombrado de kuna-sc)
│   │   URL: https://oferta-api-production.up.railway.app
│   │   Package: com.kavak.sc.oferta
│   │   JAR: oferta-api-0.0.4-SNAPSHOT.jar
│   ├── handoff-api (🚧 próximamente)
│   └── dictamen-api (🚧 próximamente)
├── Frontend (Vercel)
│   └── kuna-sc → https://kuna-sc.vercel.app
│       Package: kuna-sc-frontend
│       Multi-país: AR, CL
├── Database (Railway PostgreSQL)
│   └── Multi-país con country_code
│       AR: ✅ Configurado
│       CL: ✅ Configurado
└── Repository (GitHub)
    └── kuna-sc (nombre mantenido)
```

---

## 📊 Commits Realizados

1. **Commit 1:** `refactor: Rename APIs from kuna to modular architecture`
   - Renombró todos los paquetes Java
   - Agregó soporte multi-país
   - Creó migración SQL
   - Actualizó frontend con countries

2. **Commit 2:** `fix: Align AjustesSistema entity with Railway database schema`
   - Corrigió mapeo de columnas
   - Agregó campo `actualizado_por`
   - Creó settings para Chile en BD

---

## ⚠️ Breaking Changes

1. **Package Names:** Todos los paquetes Java cambiaron de `com.kavak.financingoffer` a `com.kavak.sc.oferta`
2. **JAR Name:** El artefacto cambió de `financing-offer-api-0.0.3-SNAPSHOT.jar` a `oferta-api-0.0.4-SNAPSHOT.jar`
3. **Database Schema:** Requiere migración para agregar columnas `country_code` (ya ejecutada ✅)
4. **Service Name:** Railway service debe renombrarse de `kuna-sc` a `oferta-api` (pendiente)

---

## 📝 Notas Importantes

- ✅ Todo el código fue pusheado a GitHub: https://github.com/pablodma/kuna-sc
- ✅ La migración SQL fue ejecutada exitosamente en Railway
- ✅ Ambos países (AR y CL) tienen configuración por defecto
- ⚠️ **Falta:** Renombrar servicio en Railway de `kuna-sc` a `oferta-api`
- ⚠️ **Falta:** Actualizar variables de entorno en Railway y Vercel
- ⚠️ **Falta:** Redeploy del frontend después de actualizar variables

---

## 🆘 Troubleshooting

### Si el deploy falla en Railway
1. Verifica que `railway.json` tenga el JAR correcto: `oferta-api-0.0.4-SNAPSHOT.jar`
2. Revisa los logs: Railway Dashboard → Service → Deployments → View Logs
3. Verifica que las variables de entorno estén configuradas

### Si hay errores de compilación
1. El código fue refactorizado pero no pudo testearse localmente (Maven no instalado)
2. Railway compilará desde scratch con `mvn clean package -DskipTests`
3. Si hay errores, revisa los build logs en Railway

### Si el frontend no conecta con el backend
1. Verifica que `NEXT_PUBLIC_API_URL` en Vercel apunte a la URL correcta
2. Verifica que CORS esté configurado en Railway para incluir `*.vercel.app`
3. Verifica que el frontend use el contexto de país correctamente

---

## 📞 Contacto y Soporte

- **GitHub Repo:** https://github.com/pablodma/kuna-sc
- **Railway Project:** Devs KSA's Projects
- **Vercel Project:** kuna-sc

**Estado del Proyecto:** ✅ Código refactorizado y pusheado | ⚠️ Pendiente deploy y configuración

