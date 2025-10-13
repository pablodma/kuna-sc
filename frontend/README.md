# Frontend - Simulador de Crédito Kavak

## 📋 Descripción

Aplicación web desarrollada en React con Next.js 14 para el sistema de simulación de ofertas de crédito automotor. Proporciona una interfaz intuitiva para crear simulaciones, visualizar resultados y gestionar configuraciones del sistema.

## 🏗️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework de estilos
- **React Hook Form** - Manejo de formularios
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📁 Estructura

```
app/                      # App Router (Next.js 14)
├── globals.css          # Estilos globales
├── layout.tsx           # Layout principal
├── page.tsx             # Página de inicio
├── login/               # Páginas de autenticación
│   └── page.tsx
├── register/
│   └── page.tsx
├── dashboard/           # Dashboard principal
│   └── page.tsx
└── settings/            # Configuración (solo admin)
    └── page.tsx

components/              # Componentes reutilizables
├── SimulatorForm.tsx    # Formulario de simulación
└── SimulationResults.tsx # Resultados de simulación

lib/                     # Utilidades y configuración
├── api.ts              # Cliente HTTP y endpoints
├── auth.ts             # Funciones de autenticación
├── types.ts            # Tipos TypeScript
└── vehicleData.ts      # Datos mock de vehículos

store/                   # Estado global
└── authStore.ts        # Store de autenticación
```

## 🚀 Configuración

### Variables de Entorno

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# JWT Configuration (para desarrollo)
NEXT_PUBLIC_JWT_SECRET=mySecretKey
```

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎨 Funcionalidades

### Autenticación
- ✅ Login con usuario y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Manejo de JWT tokens
- ✅ Protección de rutas
- ✅ Logout automático

### Simulador de Crédito
- ✅ Precarga automática de datos del CRM
- ✅ Formulario completo de cliente y vehículo
- ✅ Datos mock de vehículos argentinos
- ✅ Slider de porcentaje a financiar
- ✅ Validaciones en tiempo real

### Resultados de Simulación
- ✅ Visualización de montos (total, financiado, cuota)
- ✅ Slider interactivo para seleccionar plazo
- ✅ Desglose financiero (TNA, TAE, total)
- ✅ Tabla completa de todas las opciones
- ✅ Formato de moneda argentina

### Panel de Administración
- ✅ Configuración del porcentaje máximo
- ✅ Historial de cambios
- ✅ Validaciones de permisos
- ✅ Interfaz intuitiva

## 🔌 Integración con CRM

### Recepción de Datos
El sistema está preparado para recibir datos del CRM en tiempo real:

```typescript
interface CRMData {
  deal_id: string;
  fiscal_data: {
    full_name: string;
    document_number: string;
  };
  sales_order: {
    product: {
      name: string;
      sku: string;
    };
    initial_value: string;
  };
}
```

### Mapeo Automático
- **Cliente**: Nombre, apellido y DNI se extraen automáticamente
- **Vehículo**: Marca, modelo y versión se parsean del nombre del producto
- **Precio**: Se obtiene del `initial_value`
- **Metadata**: Deal ID, subsidiaria y país se preservan

## 🎯 Componentes Principales

### SimulatorForm
Formulario principal con tres secciones:
1. **Datos del Cliente**: Nombre, apellido, DNI, ingresos
2. **Datos del Vehículo**: Marca, modelo, versión, año, SKU
3. **Financiamiento**: Slider de porcentaje a financiar

### SimulationResults
Visualización de resultados con:
- Cards destacados con montos principales
- Slider horizontal para seleccionar plazo
- Desglose financiero expandible
- Tabla completa de opciones

### AuthStore (Zustand)
Estado global para autenticación:
- Usuario actual y token
- Funciones de login/logout
- Persistencia en localStorage
- Interceptores de Axios

## 🚗 Datos de Vehículos

### Marcas Incluidas
- Toyota, Volkswagen, Ford, Chevrolet
- Fiat, Renault, Peugeot, Nissan

### Estructura de Datos
```typescript
const vehicleData = [
  {
    marca: 'Toyota',
    modelos: {
      'Corolla': ['XLI', 'XEI', 'SEG', 'Hybrid'],
      'Hilux': ['SRV', 'SRX', 'SR5', 'SR5 4x4']
    }
  }
];
```

## 🎨 Diseño y UX

### Principios de Diseño
- **Mobile First**: Diseño responsive
- **Accesibilidad**: Contraste adecuado, navegación por teclado
- **Consistencia**: Sistema de colores y tipografía unificado
- **Feedback**: Estados de carga, errores y éxito claros

### Paleta de Colores
- **Primary**: Indigo (600, 700)
- **Success**: Green (50, 800, 900)
- **Warning**: Yellow (50, 400, 800)
- **Error**: Red (50, 600, 700)
- **Neutral**: Gray (50, 100, 200, 500, 700, 900)

### Componentes UI
- Formularios con validación visual
- Sliders personalizados
- Cards con gradientes
- Tablas responsivas
- Modales y notificaciones

## 🔧 Desarrollo

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
style: cambios de estilo
refactor: refactorización
docs: documentación
test: tests
```

## 🧪 Testing

### Testing Manual
- Flujo completo de autenticación
- Creación de simulaciones
- Validaciones de formularios
- Responsive design
- Integración con API

### Testing Automatizado
```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- Formularios en columnas en mobile
- Tablas con scroll horizontal
- Navegación colapsable
- Botones de tamaño táctil

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en dashboard
```

### Variables de Producción
```bash
NEXT_PUBLIC_API_URL=https://tu-api.com
```

### Build Optimizado
```bash
# Generar build de producción
npm run build

# Analizar bundle
npm run build -- --analyze
```

## 🔍 SEO y Performance

### Optimizaciones
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Lazy loading automático
- **Bundle Analysis**: Análisis de tamaño
- **Caching**: Headers de cache apropiados

### Métricas
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 600ms

## 🐛 Troubleshooting

### Errores Comunes

#### Error de CORS
```bash
# Verificar configuración del backend
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Error de JWT
```bash
# Verificar token en localStorage
localStorage.getItem('token')
```

#### Error de Build
```bash
# Limpiar cache
rm -rf .next
npm run build
```

## 📞 Soporte

Para problemas técnicos:
1. Revisar console del navegador
2. Verificar Network tab en DevTools
3. Consultar documentación de Next.js
4. Revisar issues en el repositorio

---

**Versión**: 1.0.0  
**Node.js**: 18+  
**Next.js**: 14.0.4






