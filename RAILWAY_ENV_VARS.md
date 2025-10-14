# 🚀 Variables de Entorno para Railway Backend

## Configuración del servicio `kuna-sc` (Backend)

Ve a Railway → Proyecto → Servicio **kuna-sc** → Pestaña **Variables**

### Variables a configurar:

#### 1. DATABASE_URL (ACTUALIZAR/CREAR)
```
jdbc:postgresql://mainline.proxy.rlwy.net:24157/railway?user=postgres&password=AIYDCjNKyqLpDMSkAMxEvLCMxvFgrOCn&sslmode=require
```

#### 2. JWT_SECRET (ya existe, no tocar)
```
qJk5ZSQT636ECxkv7RcmJEVi5ygqZVFsVwVHjDKl8inhOaUcR2kA6Vj9LQzkymoaBN2hhRqIrRM78jUitM84eA==
```

#### 3. JWT_EXPIRATION (ya existe, no tocar)
```
86400000
```

---

## ✅ Después de actualizar:

1. Railway hará **redeploy automático** del backend
2. Esperá **2-3 minutos**
3. Probá el endpoint: `https://kuna-sc-production.up.railway.app/api/settings`

---

## 🎯 Estado actual:

- ✅ Railway PostgreSQL creado
- ✅ Tablas creadas (`users`, `ajustes_sistema`, `ofertas_financiamiento`)
- ✅ Datos iniciales insertados (usuarios admin/user con password: `password123`)
- ⏳ **FALTA**: Actualizar `DATABASE_URL` en el servicio backend

---

## 📊 Usuarios de prueba creados:

| Username | Password    | Role  |
|----------|-------------|-------|
| admin    | password123 | ADMIN |
| user     | password123 | USER  |



