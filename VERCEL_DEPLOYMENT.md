# 🚀 Deploy Frontend en Vercel - Guía Completa

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Ir a Vercel
1. Abre https://vercel.com/new
2. Inicia sesión con tu cuenta (GitHub, GitLab, o Bitbucket)

### Paso 2: Importar Proyecto
1. Selecciona "Import Git Repository"
2. Busca y selecciona: `pablodma/kuna-sc`
3. Click en "Import"

### Paso 3: Configurar el Proyecto
En la pantalla de configuración:

**Framework Preset:** Next.js (debería detectarse automáticamente)

**Root Directory:** 
```
frontend
```
⚠️ **IMPORTANTE:** Haz click en "Edit" y configura `frontend` como root directory

**Build and Output Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### Paso 4: Configurar Variables de Entorno
En la sección "Environment Variables", agrega:

**Variable:**
```
NEXT_PUBLIC_API_URL
```

**Value:**
```
https://kuna-sc-production.up.railway.app
```

**Environment:** Production, Preview, Development (marca los 3)

### Paso 5: Deploy
1. Click en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye y deploya
3. ¡Listo! Vercel te dará una URL tipo `https://kuna-sc.vercel.app`

---

## Opción 2: Deploy con Vercel CLI

### Paso 1: Instalar Vercel CLI
```bash
npm i -g vercel
```

### Paso 2: Login
```bash
vercel login
```
(Seguir instrucciones para autenticarte)

### Paso 3: Deploy desde el directorio frontend
```bash
cd frontend
vercel
```

### Paso 4: Configurar en primera ejecución
- **Set up and deploy?** Yes
- **Which scope?** (Selecciona tu cuenta)
- **Link to existing project?** No
- **Project name?** kuna-sc-frontend (o el que prefieras)
- **In which directory is your code located?** ./ (enter)
- **Want to override the settings?** Yes
  - **Build Command?** npm run build (enter)
  - **Output Directory?** .next (enter)
  - **Development Command?** npm run dev (enter)

### Paso 5: Agregar variable de entorno
```bash
vercel env add NEXT_PUBLIC_API_URL production
```
Cuando pregunte el valor, ingresa:
```
https://kuna-sc-production.up.railway.app
```

### Paso 6: Redeploy para aplicar variables
```bash
vercel --prod
```

---

## ✅ Verificar Deployment

Una vez deployado, prueba los siguientes endpoints desde tu app:

1. **Login:** 
   - URL: Tu dominio de Vercel + `/login`
   - Credenciales: `admin` / `admin123`

2. **Dashboard:**
   - URL: Tu dominio de Vercel + `/dashboard`
   - Debe cargar el formulario de simulación

3. **Settings (Admin):**
   - URL: Tu dominio de Vercel + `/settings`
   - Requiere login como admin

---

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado
1. En el dashboard de Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio personalizado

### Variables de Entorno Adicionales
Si necesitas agregar más variables:
1. Project Settings → Environment Variables
2. Add New
3. Redeploy para aplicar cambios

### Ver Logs y Debugging
1. En el dashboard de Vercel
2. Deployments → Selecciona el deployment
3. View Function Logs o Build Logs

---

## 🐛 Troubleshooting

### Error: Cannot connect to backend
**Solución:** Verifica que `NEXT_PUBLIC_API_URL` esté configurada correctamente en Vercel

### Error: CORS issues
**Solución:** Verifica que el backend tenga configurado el CORS_ALLOWED_ORIGINS correcto en Railway

### Error 404 en rutas
**Solución:** Vercel maneja las rutas automáticamente con Next.js, pero verifica que el `next.config.js` esté correcto

---

## 📝 URLs Importantes

- **Backend (Railway):** https://kuna-sc-production.up.railway.app
- **Frontend (Vercel):** https://[tu-proyecto].vercel.app
- **GitHub Repo:** https://github.com/pablodma/kuna-sc

---

## 🎯 Siguiente Paso

Después del deploy, actualiza la variable `CORS_ALLOWED_ORIGINS` en Railway para incluir tu dominio de Vercel:

```bash
# En Railway dashboard o CLI
CORS_ALLOWED_ORIGINS=https://[tu-proyecto].vercel.app,https://[tu-proyecto]-*.vercel.app
```

Esto permite que el frontend en Vercel se conecte al backend en Railway sin errores de CORS.

---

**¡Creado automáticamente el 14 de Octubre, 2025!**

