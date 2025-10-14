# 🔧 Variables de Entorno - Frontend

## Para Vercel

Al deployar en Vercel, configura la siguiente variable de entorno en el dashboard:

### Variable requerida:
```
NEXT_PUBLIC_API_URL=https://kuna-sc-production.up.railway.app
```

## Para desarrollo local

Crea un archivo `.env.local` en el directorio `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Verificar configuración

La aplicación usa esta variable para conectarse al backend. Puedes verificarla en:
- `lib/api.ts` - Cliente API de Axios
- `next.config.js` - Configuración de Next.js

## 🚀 Deploy en Vercel

1. Instala Vercel CLI (opcional):
   ```bash
   npm i -g vercel
   ```

2. Desde el directorio `frontend/`, ejecuta:
   ```bash
   vercel
   ```

3. O conecta el repo directamente en https://vercel.com/new

4. Configura la variable de entorno `NEXT_PUBLIC_API_URL` en el dashboard de Vercel

5. Redeploy si es necesario para que tome la variable

## 📝 Notas

- La variable **DEBE** empezar con `NEXT_PUBLIC_` para estar disponible en el cliente
- Sin esta variable, el frontend intentará conectarse a `localhost:8080` (solo funciona en dev)

