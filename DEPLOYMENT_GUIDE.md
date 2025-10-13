# 🚀 Guía de Deployment - Sistema de Simulación de Crédito Kavak

## ✅ Estado Actual

- ✅ **Código sincronizado en GitHub**: https://github.com/pablodma/kuna-sc
- ✅ **Base de datos Supabase**: Configurada y lista
- ✅ **Variables de entorno**: Configuradas en el proyecto

---

## 📋 Próximos Pasos para Deployment

### 1. Deploy del Frontend en Vercel

#### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. **Ve a**: https://vercel.com/new
2. **Importa tu repositorio de GitHub**:
   - Selecciona `pablodma/kuna-sc`
   - Vercel detectará automáticamente que es un proyecto Next.js
3. **Configura el proyecto**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. **Configura Variables de Entorno** (en Vercel):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lcppzendmlaikynqfjuy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcHB6ZW5kbWxhaWt5bnFmanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODk1NDUsImV4cCI6MjA3NTk2NTU0NX0.lJTO6QzBbapg_qtsAHY1eNKDMcM7j1phfCR-qz3Xn0s
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_JWT_SECRET=0ZVBBt8z6UBs2OIfumc0mjj8k12uawB9m18iaZmnPjedlNCTKzL4uGqO7WrAYA3uDZktMlSyPhp4BieUqBQNQw==
   ```
5. **Deploy** → Vercel construirá y desplegará automáticamente

#### Opción B: Usando Vercel CLI

```bash
cd frontend
vercel login
vercel --prod
```

Luego configura las variables de entorno en el dashboard.

---

### 2. Ejecutar Scripts SQL en Supabase

1. **Ve al Dashboard de Supabase**: https://supabase.com/dashboard
2. **Selecciona tu proyecto**: `lcppzendmlaikynqfjuy`
3. **Ve a SQL Editor** (menú lateral izquierdo)
4. **Clic en "New query"**
5. **Copia y pega** todo el contenido del archivo `database/schema.sql`
6. **Ejecuta el script** (botón "Run" o Ctrl+Enter)

Esto creará:
- ✅ Tablas: `users`, `ofertas_financiamiento`, `ajustes_sistema`
- ✅ Índices para performance
- ✅ Funciones helper
- ✅ Políticas de seguridad (RLS)
- ✅ Usuarios por defecto: `admin`/`admin123` y `user`/`user123`
- ✅ Configuración inicial del sistema (50% máximo)

---

### 3. Deploy del Backend

#### Opción A: Railway (Recomendado)

1. **Ve a**: https://railway.app
2. **Crea una cuenta** o inicia sesión con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecciona**: `pablodma/kuna-sc`
5. **Configura**:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
6. **Variables de Entorno** (en Railway):
   ```
   DATABASE_URL=jdbc:postgresql://db.lcppzendmlaikynqfjuy.supabase.co:5432/postgres?sslmode=require
   DATABASE_USERNAME=postgres.lcppzendmlaikynqfjuy
   DATABASE_PASSWORD=PyvKRQ6954CvpFao
   JWT_SECRET=0ZVBBt8z6UBs2OIfumc0mjj8k12uawB9m18iaZmnPjedlNCTKzL4uGqO7WrAYA3uDZktMlSyPhp4BieUqBQNQw==
   CORS_ALLOWED_ORIGINS=https://[tu-app].vercel.app,http://localhost:3000
   PORT=8080
   ```
7. **Deploy** → Railway construirá y desplegará el backend
8. **Copia la URL** que te da Railway (ej: `https://kuna-sc-backend-production.up.railway.app`)

#### Opción B: Heroku

1. **Instala Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Desde la terminal**:
   ```bash
   cd backend
   heroku login
   heroku create kuna-sc-backend
   heroku config:set DATABASE_URL="jdbc:postgresql://db.lcppzendmlaikynqfjuy.supabase.co:5432/postgres?sslmode=require"
   heroku config:set DATABASE_USERNAME="postgres.lcppzendmlaikynqfjuy"
   heroku config:set DATABASE_PASSWORD="PyvKRQ6954CvpFao"
   heroku config:set JWT_SECRET="0ZVBBt8z6UBs2OIfumc0mjj8k12uawB9m18iaZmnPjedlNCTKzL4uGqO7WrAYA3uDZktMlSyPhp4BieUqBQNQw=="
   git push heroku main
   ```

#### Opción C: Render

1. **Ve a**: https://render.com
2. **New** → **Web Service**
3. **Conecta GitHub** y selecciona el repo
4. **Configura**:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
5. **Agrega Variables de Entorno** (igual que Railway)

---

### 4. Actualizar URL del Backend en Frontend

Una vez que tengas la URL del backend desplegado:

1. **Ve a Vercel Dashboard** → Tu proyecto → Settings → Environment Variables
2. **Edita** la variable `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://kuna-sc-backend-production.up.railway.app
   ```
3. **Guarda** y **Redeploy** el frontend

O desde CLI:
```bash
cd frontend
vercel env add NEXT_PUBLIC_API_URL
# Pega la URL del backend
vercel --prod
```

---

### 5. Actualizar CORS en Backend

Una vez que tengas la URL de Vercel:

1. **Opción A - Variables de Entorno** (Recomendado):
   - En Railway/Heroku/Render, edita la variable `CORS_ALLOWED_ORIGINS`
   - Agrega la URL de Vercel: `https://kuna-sc.vercel.app,http://localhost:3000`

2. **Opción B - Código**:
   - Edita `backend/src/main/resources/application.yml`
   - Actualiza `cors.allowed-origins`
   - Commit y push

---

## 🧪 Testing del Sistema

### 1. Test del Frontend
- Ve a tu URL de Vercel: `https://kuna-sc.vercel.app`
- Deberías ver la página de login
- Intenta registrarte o usar: `admin`/`admin123`

### 2. Test del Backend
- Ve a: `https://[tu-backend-url]/api/settings`
- Deberías recibir un 401 (no autenticado) - correcto

### 3. Test de Integración Completa
1. **Login** con `admin`/`admin123`
2. **Dashboard** → debería cargar
3. **Simular crédito** con datos de prueba
4. **Ver resultados** con el slider de plazos
5. **Settings** (como admin) → cambiar % máximo

---

## 📊 Monitoreo

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Logs**: Ver deployment logs y runtime logs
- **Analytics**: Tráfico y performance

### Railway/Heroku/Render
- **Dashboard**: Ver logs en tiempo real
- **Métricas**: CPU, memoria, requests
- **Logs**: Errores y debugging

### Supabase
- **Dashboard**: https://supabase.com/dashboard
- **Database**: Ver tablas y datos
- **Logs**: Queries y conexiones
- **API Logs**: Requests a la API

---

## 🔧 Comandos Útiles

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
npm run build
```

### Backend (Local)
```bash
cd backend
mvn clean install
mvn spring-boot:run  # http://localhost:8080
```

### Git
```bash
git status
git add .
git commit -m "mensaje"
git push origin main
```

---

## 🐛 Troubleshooting

### Error de CORS
- Verifica que la URL del frontend esté en `CORS_ALLOWED_ORIGINS`
- Revisa que no haya espacios en las URLs

### Error de Conexión a BD
- Verifica las credenciales de Supabase
- Confirma que el proyecto esté activo
- Revisa que la URL tenga `?sslmode=require`

### Error 401 en Requests
- Verifica que el JWT_SECRET sea el mismo en frontend y backend
- Confirma que el token se esté enviando en el header

### Frontend no conecta con Backend
- Verifica `NEXT_PUBLIC_API_URL` en Vercel
- Confirma que el backend esté corriendo
- Revisa CORS en el backend

---

## 📞 URLs Importantes

- **Repositorio GitHub**: https://github.com/pablodma/kuna-sc
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lcppzendmlaikynqfjuy
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Frontend URL**: `https://kuna-sc.vercel.app` (después del deploy)
- **Backend URL**: Depende de donde lo despliegues

---

## ✅ Checklist de Deployment

- [ ] Scripts SQL ejecutados en Supabase
- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Railway/Heroku/Render
- [ ] Variables de entorno configuradas en todos lados
- [ ] `NEXT_PUBLIC_API_URL` actualizado en Vercel
- [ ] `CORS_ALLOWED_ORIGINS` actualizado en backend
- [ ] Testing de login funcional
- [ ] Testing de simulación funcional
- [ ] Testing de panel admin funcional

---

**¡Listo!** Tu sistema de simulación de crédito está desplegado y funcionando 🎉
