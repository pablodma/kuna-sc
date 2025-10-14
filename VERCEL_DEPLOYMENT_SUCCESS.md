# 🎉 Frontend Deployado Exitosamente en Vercel

## ✅ URLs del Frontend

### Producción:
- **URL Principal:** https://frontend-xi-indol-93.vercel.app
- **URL Alternativa:** https://frontend-desarrolladoresksa-gmailcoms-projects.vercel.app

### Preview/Staging:
- https://frontend-aho3mvdtk-desarrolladoresksa-gmailcoms-projects.vercel.app

---

## 🔧 Configuración Requerida

### ⚠️ IMPORTANTE: Agregar Variable de Entorno

Para que el frontend se conecte correctamente al backend en Railway, necesitas agregar la variable de entorno en Vercel:

#### Opción A: Dashboard de Vercel (Recomendado)

1. Ve a: https://vercel.com/desarrolladoresksa-gmailcoms-projects/frontend/settings/environment-variables

2. Agrega la siguiente variable:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://kuna-sc-production.up.railway.app`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

3. Click en "Save"

4. Redeploy el proyecto:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Opción B: CLI (si prefieres terminal)

```bash
cd frontend

# Agregar variable para Production
vercel env add NEXT_PUBLIC_API_URL production
# Cuando pregunte el valor: https://kuna-sc-production.up.railway.app

# Agregar para Preview
vercel env add NEXT_PUBLIC_API_URL preview
# Valor: https://kuna-sc-production.up.railway.app

# Redeploy
vercel --prod
```

---

## 🔐 Actualizar CORS en Railway

Para permitir que Vercel acceda al backend, actualiza la variable `CORS_ALLOWED_ORIGINS` en Railway:

### En Railway Dashboard:

1. Ve a: https://railway.app/project/70edb821-0fd1-462f-bbee-14fa3e873708

2. Selecciona el servicio `kuna-sc`

3. Ve a "Variables"

4. Edita `CORS_ALLOWED_ORIGINS` y cambia de:
   ```
   *
   ```
   
   A:
   ```
   https://frontend-xi-indol-93.vercel.app,https://frontend-desarrolladoresksa-gmailcoms-projects.vercel.app,https://*.vercel.app
   ```

5. Guarda y espera que Railway redeploy automáticamente

---

## 🧪 Testear la Aplicación

### 1. Abrir la aplicación:
```
https://frontend-xi-indol-93.vercel.app
```

### 2. Login como Admin:
- **Username:** `admin`
- **Password:** `admin123`

### 3. Probar funcionalidades:
- ✅ Dashboard → Crear simulación
- ✅ Settings → Ajustar porcentaje máximo (solo admin)
- ✅ Navegación entre páginas

---

## 📊 Stack Completo

| Componente | Plataforma | URL |
|------------|-----------|-----|
| Frontend | Vercel | https://frontend-xi-indol-93.vercel.app |
| Backend | Railway | https://kuna-sc-production.up.railway.app |
| Base de Datos | Railway (PostgreSQL) | `mainline.proxy.rlwy.net:24157` |

---

## 🔍 Monitoreo y Logs

### Ver logs del frontend (Vercel):
```bash
cd frontend
vercel logs https://frontend-xi-indol-93.vercel.app
```

O en el dashboard:
- https://vercel.com/desarrolladoresksa-gmailcoms-projects/frontend

### Ver logs del backend (Railway):
```bash
railway logs
```

O en el dashboard:
- https://railway.app/project/70edb821-0fd1-462f-bbee-14fa3e873708

---

## 🚀 Comandos Útiles

### Redeploy a producción:
```bash
cd frontend
vercel --prod
```

### Ver deployments:
```bash
vercel ls
```

### Ver variables de entorno:
```bash
vercel env ls
```

### Inspeccionar deployment:
```bash
vercel inspect [deployment-url] --logs
```

---

## ⚡ Continuous Deployment

Vercel está conectado a tu repositorio de GitHub. Cada vez que hagas push a `main`, se deployará automáticamente:

1. `git push origin main` → Trigger deploy automático
2. Vercel build & deploy
3. Nueva versión disponible en ~1-2 minutos

---

## 🎯 Checklist Post-Deployment

- [ ] Agregar `NEXT_PUBLIC_API_URL` en Vercel
- [ ] Actualizar `CORS_ALLOWED_ORIGINS` en Railway
- [ ] Hacer redeploy del frontend
- [ ] Probar login (admin/admin123)
- [ ] Probar crear simulación
- [ ] Verificar que settings carga correctamente

---

## 🐛 Troubleshooting

### Error: "Network Error" al hacer login
**Solución:** Verifica que `NEXT_PUBLIC_API_URL` esté configurada en Vercel

### Error: "CORS policy"
**Solución:** Actualiza `CORS_ALLOWED_ORIGINS` en Railway para incluir tu dominio de Vercel

### Error: "Page not found"
**Solución:** Verifica que el routing de Next.js esté correcto. Vercel maneja las rutas automáticamente.

### Frontend no carga
**Solución:** Verifica los logs con `vercel logs [url]` o en el dashboard

---

## 📝 Próximos Pasos (Opcional)

1. **Dominio Personalizado:**
   - Configura un dominio custom en Vercel (ej: `app.tudominio.com`)

2. **Analytics:**
   - Habilita Vercel Analytics para ver métricas de uso

3. **Monitoring:**
   - Configura alertas en Vercel y Railway

4. **Performance:**
   - Optimiza imágenes y assets
   - Configura caché headers

---

**Deployment completado exitosamente el 14 de Octubre, 2025** 🎊

