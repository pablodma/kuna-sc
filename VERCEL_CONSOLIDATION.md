# 🔄 Consolidar Proyectos de Vercel

## 📊 Situación Actual

Tenés **2 proyectos en Vercel** que apuntan al mismo repo:

| Proyecto | URL | Root Directory | Creado por |
|----------|-----|----------------|------------|
| **kuna-sc** | https://kuna-sc.vercel.app | `.` (raíz) | GitHub Integration |
| **frontend** | https://frontend-xi-indol-93.vercel.app | `frontend/` | Vercel CLI manual |

## ⚠️ Problema

- El proyecto `kuna-sc` se creó automáticamente cuando conectaste el repo a Vercel
- El proyecto `frontend` se creó accidentalmente cuando hicimos `vercel` desde el directorio `frontend/`
- Ambos están activos pero apuntan a diferentes partes del repo

## ✅ Solución Recomendada: Usar `kuna-sc` con Root Directory

### Opción A: Configurar `kuna-sc` para el frontend (Recomendado)

1. **Ve a Settings del proyecto kuna-sc:**
   https://vercel.com/desarrolladoresksa-gmailcoms-projects/kuna-sc/settings

2. **En "General" → "Root Directory":**
   - Click en "Edit"
   - Cambia de `.` a `frontend`
   - Click en "Save"

3. **En "Environment Variables":**
   - Agrega: `NEXT_PUBLIC_API_URL` = `https://kuna-sc-production.up.railway.app`
   - Para: Production, Preview, Development

4. **Redeploy:**
   - Ve a "Deployments"
   - Click en el último deployment
   - Click en "Redeploy"

5. **Eliminar proyecto redundante:**
   ```bash
   # Eliminar el proyecto "frontend"
   vercel remove frontend --yes
   ```

6. **Vincular el directorio local al proyecto correcto:**
   ```bash
   cd frontend
   rm -rf .vercel  # Eliminar vinculación vieja
   vercel link     # Vincular al proyecto kuna-sc
   ```

**Resultado:** El proyecto `kuna-sc` deployará el frontend en https://kuna-sc.vercel.app

---

## 🎯 Resultado Final

Después de la consolidación:

- **Frontend:** https://kuna-sc.vercel.app
- **Backend:** https://kuna-sc-production.up.railway.app
- **Repositorio:** https://github.com/pablodma/kuna-sc
- **Proyecto Vercel:** kuna-sc (solo uno)

---

## 📝 Pasos Detallados para Consolidar

### 1. Configurar Root Directory en kuna-sc

**En el Dashboard de Vercel:**

```
Project: kuna-sc
└── Settings
    └── General
        └── Root Directory: frontend
```

### 2. Configurar Variables de Entorno

**Environment Variables:**
```
NEXT_PUBLIC_API_URL = https://kuna-sc-production.up.railway.app
```

### 3. Actualizar CORS en Railway

**En Railway, variable `CORS_ALLOWED_ORIGINS`:**
```
https://kuna-sc.vercel.app,https://kuna-sc-*.vercel.app
```

### 4. Limpiar proyecto redundante

```bash
# Eliminar proyecto "frontend"
vercel remove frontend --yes

# O desde el dashboard:
# https://vercel.com/desarrolladoresksa-gmailcoms-projects/frontend/settings
# Scroll down → Delete Project
```

### 5. Vincular local al proyecto correcto

```bash
cd frontend
rm -rf .vercel
vercel link
# Selecciona: kuna-sc
```

---

## 🚀 Comandos de Deploy Post-Consolidación

```bash
# Desde la raíz del proyecto
git push origin main  # Auto-deploy en Vercel

# O manualmente desde frontend/
cd frontend
vercel --prod
```

---

## ⚡ Ventajas de la Consolidación

✅ **Un solo proyecto** - Más fácil de gestionar
✅ **URL coherente** - `kuna-sc.vercel.app` (más profesional)
✅ **Auto-deploy** - Push a GitHub → Deploy automático
✅ **Sin confusión** - Todo bajo el proyecto `kuna-sc`

---

## 🐛 Si Algo Sale Mal

Si la configuración no funciona:

1. **Rollback:** Ve a Deployments y redeploy un deployment anterior
2. **Logs:** Revisa los build logs en el dashboard
3. **Soporte:** Vercel tiene muy buen soporte en https://vercel.com/support

---

## 📌 Estado Actual vs Estado Ideal

### Estado Actual (2 proyectos):
```
GitHub: pablodma/kuna-sc
├── backend/     → Railway
└── frontend/    → Vercel "frontend" + Vercel "kuna-sc" ❌
```

### Estado Ideal (1 proyecto):
```
GitHub: pablodma/kuna-sc
├── backend/     → Railway (https://kuna-sc-production.up.railway.app)
└── frontend/    → Vercel "kuna-sc" (https://kuna-sc.vercel.app) ✅
```

---

**¿Querés que ejecute los pasos de consolidación ahora?**

