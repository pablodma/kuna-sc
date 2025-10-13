# MVP Parte 1: Oferta de Crédito

## 📅 Objetivo

Simular una orden de venta de crédito automotor. El usuario del backoffice podrá:

1. Cargar datos del cliente y del vehículo (todos editables)
2. Seleccionar el % a financiar (máx. 50%, editable por admin)
3. Simular condiciones de crédito a través de un servicio mock (`BeClever`)
4. Visualizar cuotas para 12 a 84 meses con desglose financiero

---

## 📊 Arquitectura General

- **Frontend:** React + Next.js (repositorio separado)
- **Backend:** Java + Spring Boot (`financing-offer-api`)
- **Autenticación:** JWT Bearer Token
- **Base de Datos:** Supabase (PostgreSQL)
- **Repositorios GitLab:** Separados por frontend y backend

---

## 💻 Frontend

### Pantalla: Simular Orden de Venta

- Botón principal: `Simular Orden de Venta`
- Al hacer clic, se despliega un formulario editable con los siguientes campos:

#### Cliente
- Nombre
- Apellido
- DNI
- Ingresos declarados

#### Vehículo
- Marca (select)
- Modelo (select)
- Versión (select)
- Año
- SKU (input editable o autogenerado)

#### Ajustes
- % a financiar (slider hasta 50%)
- Solo usuarios admin pueden modificar ese máximo desde "Ajustes"

### Acción: `Generar Simulación`

- Envía `POST` al backend con la información del formulario
- El backend devuelve:
  - Monto total del auto (random entre $5M y $20M)
  - Monto a financiar según % definido
  - Simulación de cuotas para 12 a 84 meses

### UI Resultante
- Slider horizontal para seleccionar plazo
- Muestra:
  - Cuota mensual
  - Primera cuota destacada
  - Botón `Ver más` para desplegar TNA, TAE y total estimado

---

## ⚙️ Backend: `financing-offer-api`

### Seguridad
- Middleware JWT
- Roles: `user`, `admin`

### Endpoints Principales

#### POST `/api/financing-offers`
Crea simulación de crédito con datos del cliente y vehículo

**Request Body:**
```json
{
  "cliente": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "40123123",
    "ingresosAnuales": 8500000
  },
  "vehiculo": {
    "marca": "Toyota",
    "modelo": "Corolla",
    "version": "XEI",
    "anio": 2020,
    "sku": "KAV123456"
  },
  "porcentajeFinanciar": 45
}
```

**Respuesta:**
```json
{
  "montoTotal": 12500000,
  "montoFinanciado": 5625000,
  "simulaciones": [
    {
      "meses": 12,
      "cuotaMensual": 512000,
      "TNA": 82.3,
      "TAE": 102.1
    },
    ...
  ]
}
```

#### GET `/api/settings`
- Devuelve valor actual del % máximo de financiamiento

#### PATCH `/api/settings`
- Modifica el valor del % (solo `admin`)

---

## 📂 Base de Datos: Supabase

### Tabla: `ofertas_financiamiento`
| Campo                 | Tipo        |
|----------------------|-------------|
| id                   | UUID        |
| nombre               | VARCHAR     |
| apellido             | VARCHAR     |
| dni                  | VARCHAR     |
| ingresos_anuales     | NUMERIC     |
| marca                | VARCHAR     |
| modelo               | VARCHAR     |
| version              | VARCHAR     |
| anio                 | INT         |
| sku                  | VARCHAR     |
| monto_total_auto     | NUMERIC     |
| porcentaje_financiar | INT         |
| monto_financiado     | NUMERIC     |
| fecha_creacion       | TIMESTAMP   |

### Tabla: `ajustes_sistema`
| Campo             | Tipo      |
|-------------------|-----------|
| porcentaje_maximo | INT       |
| actualizado_por   | VARCHAR   |
| timestamp         | TIMESTAMP |

---

## 🛠️ Mock: Servicio BeClever

Simulador dummy local en backend que:
- Genera monto total aleatorio ($5M - $20M)
- Genera escenarios de simulación para:
  - Plazos de 12 a 84 meses (incremento de 6)
  - Cada uno con cuota mensual, TNA, TAE generados aleatoriamente

---

## 📆 Roadmap MVP

| Tarea                               | Estado |
|------------------------------------|--------|
| UI Simular Orden de Venta          | ✅     |
| Validación de campos obligatorios   | ✅     |
| Simulador de cuotas (BeClever)     | ✅     |
| Slider de % a financiar            | ✅     |
| Endpoint de configuración (admin)  | ✅     |
| Integración JWT                    | ✅     |
| Integración con Supabase          | ✅     |

