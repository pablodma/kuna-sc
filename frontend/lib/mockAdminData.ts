import { EmployeeMetrics, EmployeeLog, QualityMetrics, PriorityRule } from './adminTypes';

export const MOCK_EMPLOYEE_METRICS: EmployeeMetrics[] = [
  {
    employeeId: '1',
    employeeName: 'Juan Pérez',
    role: 'COMERCIAL_KAVAK',
    period: '2025-10',
    leadsAsignados: 45,
    leadsAtendidos: 42,
    ofertasGeneradas: 38,
    ofertasAceptadas: 28,
    tasaConversion: 73.7,
    tasaAtencion: 93.3,
    montoPromedioFinanciado: 18500000,
    plazoPromedioCuotas: 24,
    tasaDefaultPredicted: 8.2,
    scoreCrediticioPromedio: 720,
    tiempoPromedioAtencion: 12,
    tiempoPromedioSimulacion: 8,
    comisionesGeneradas: 2450000,
    valorCarteraTotal: 518000000
  },
  {
    employeeId: '2',
    employeeName: 'María González',
    role: 'COMERCIAL_KUNA',
    period: '2025-10',
    leadsAsignados: 52,
    leadsAtendidos: 50,
    ofertasGeneradas: 45,
    ofertasAceptadas: 38,
    tasaConversion: 84.4,
    tasaAtencion: 96.2,
    montoPromedioFinanciado: 22000000,
    plazoPromedioCuotas: 30,
    tasaDefaultPredicted: 5.1,
    scoreCrediticioPromedio: 780,
    tiempoPromedioAtencion: 9,
    tiempoPromedioSimulacion: 6,
    comisionesGeneradas: 3200000,
    valorCarteraTotal: 836000000
  },
  {
    employeeId: '3',
    employeeName: 'Carlos Rodríguez',
    role: 'COMERCIAL_KAVAK',
    period: '2025-10',
    leadsAsignados: 38,
    leadsAtendidos: 32,
    ofertasGeneradas: 28,
    ofertasAceptadas: 18,
    tasaConversion: 64.3,
    tasaAtencion: 84.2,
    montoPromedioFinanciado: 15200000,
    plazoPromedioCuotas: 18,
    tasaDefaultPredicted: 12.5,
    scoreCrediticioPromedio: 650,
    tiempoPromedioAtencion: 18,
    tiempoPromedioSimulacion: 12,
    comisionesGeneradas: 1580000,
    valorCarteraTotal: 273600000
  }
];

export const MOCK_QUALITY_METRICS: QualityMetrics[] = [
  {
    employeeId: '1',
    employeeName: 'Juan Pérez',
    ingresosPromedioClientes: 8500000,
    relacionDeuda: 0.35,
    ticketPromedio: 18500000,
    creditosAltoRiesgo: 3,
    creditosMedioRiesgo: 12,
    creditosBajoRiesgo: 23,
    scoreCalidadTotal: 78
  },
  {
    employeeId: '2',
    employeeName: 'María González',
    ingresosPromedioClientes: 12000000,
    relacionDeuda: 0.28,
    ticketPromedio: 22000000,
    creditosAltoRiesgo: 1,
    creditosMedioRiesgo: 8,
    creditosBajoRiesgo: 29,
    scoreCalidadTotal: 92
  },
  {
    employeeId: '3',
    employeeName: 'Carlos Rodríguez',
    ingresosPromedioClientes: 6200000,
    relacionDeuda: 0.42,
    ticketPromedio: 15200000,
    creditosAltoRiesgo: 7,
    creditosMedioRiesgo: 9,
    creditosBajoRiesgo: 12,
    scoreCalidadTotal: 62
  }
];

export const MOCK_EMPLOYEE_LOGS: EmployeeLog[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Juan Pérez',
    timestamp: new Date('2025-10-14T10:30:00'),
    action: 'SIMULATION_CREATED',
    leadId: 'L001',
    dealId: 'DEAL-2025-001',
    details: 'Simulación creada: 3 escenarios, 20%, 40%, 60%'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'María González',
    timestamp: new Date('2025-10-14T11:15:00'),
    action: 'OFFER_ACCEPTED',
    leadId: 'L003',
    dealId: 'DEAL-2025-003',
    details: 'Oferta aceptada: $22.000.000, 24 cuotas'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Juan Pérez',
    timestamp: new Date('2025-10-14T12:00:00'),
    action: 'OFFER_ACCEPTED',
    leadId: 'L001',
    dealId: 'DEAL-2025-001',
    details: 'Oferta aceptada: $18.500.000, 30 cuotas'
  },
  {
    id: '4',
    employeeId: '3',
    employeeName: 'Carlos Rodríguez',
    timestamp: new Date('2025-10-14T14:20:00'),
    action: 'LEAD_VIEWED',
    leadId: 'L005',
    dealId: 'DEAL-2025-005',
    details: 'Lead revisado'
  },
  {
    id: '5',
    employeeId: '2',
    employeeName: 'María González',
    timestamp: new Date('2025-10-14T15:45:00'),
    action: 'SIMULATION_CREATED',
    leadId: 'L007',
    dealId: 'DEAL-2025-007',
    details: 'Simulación creada: 2 escenarios, 30%, 50%'
  }
];

export const MOCK_PRIORITY_RULES: PriorityRule[] = [
  {
    id: '1',
    nombre: 'Cliente Premium',
    condicion: 'ingresos_anuales > 15000000',
    prioridad: 'ALTA',
    puntaje: 100,
    activa: true,
    descripcion: 'Clientes con ingresos superiores a $15M anuales'
  },
  {
    id: '2',
    nombre: 'Vehículo Alto Valor',
    condicion: 'precio_vehiculo > 30000000',
    prioridad: 'ALTA',
    puntaje: 90,
    activa: true,
    descripcion: 'Vehículos con precio superior a $30M'
  },
  {
    id: '3',
    nombre: 'Lead Antiguo',
    condicion: 'dias_desde_creacion > 7',
    prioridad: 'MEDIA',
    puntaje: 60,
    activa: true,
    descripcion: 'Leads con más de 7 días sin atención'
  },
  {
    id: '4',
    nombre: 'Retorno de Cliente',
    condicion: 'tiene_credito_anterior = true',
    prioridad: 'MEDIA',
    puntaje: 70,
    activa: false,
    descripcion: 'Cliente que ya tuvo un crédito anterior'
  },
  {
    id: '5',
    nombre: 'Score Crediticio Alto',
    condicion: 'score_crediticio > 750',
    prioridad: 'ALTA',
    puntaje: 85,
    activa: true,
    descripcion: 'Clientes con excelente historial crediticio'
  }
];

