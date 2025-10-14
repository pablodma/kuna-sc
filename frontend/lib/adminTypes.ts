// Tipos para configuración de administrador

export interface OfertaRules {
  porcentajeMinimo: number;
  porcentajeMaximo: number;
  cuotasMinimas: number;
  cuotasMaximas: number;
  intervalo: number; // cada cuántos meses (ej: 6)
  countryCode: 'AR' | 'CL';
}

export interface PriorityRule {
  id: string;
  nombre: string;
  condicion: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  puntaje: number;
  activa: boolean;
  descripcion: string;
}

export interface EmployeeMetrics {
  employeeId: string;
  employeeName: string;
  role: string;
  period: string; // "2025-01" por ejemplo
  
  // Métricas de Volumen
  leadsAsignados: number;
  leadsAtendidos: number;
  ofertasGeneradas: number;
  ofertasAceptadas: number;
  
  // Métricas de Conversión
  tasaConversion: number; // % de ofertas aceptadas / generadas
  tasaAtencion: number; // % de leads atendidos / asignados
  
  // Métricas de Calidad de Crédito
  montoPromedioFinanciado: number;
  plazoPromedioCuotas: number;
  tasaDefaultPredicted: number; // % predicho de impago
  scoreCrediticioPromedio: number;
  
  // Métricas de Tiempo
  tiempoPromedioAtencion: number; // en minutos
  tiempoPromedioSimulacion: number; // en minutos
  
  // Métricas de Rentabilidad
  comisionesGeneradas: number;
  valorCarteraTotal: number;
}

export interface EmployeeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  timestamp: Date;
  action: 'LEAD_ASSIGNED' | 'LEAD_VIEWED' | 'SIMULATION_CREATED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED' | 'COMMENT_ADDED';
  leadId: string;
  dealId: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface QualityMetrics {
  employeeId: string;
  employeeName: string;
  
  // Calidad del Crédito
  ingresosPromedioClientes: number;
  relacionDeuda: number; // Deuda/Ingreso promedio
  ticketPromedio: number;
  
  // Distribución de Riesgo
  creditosAltoRiesgo: number;
  creditosMedioRiesgo: number;
  creditosBajoRiesgo: number;
  
  // Score de Calidad General (0-100)
  scoreCalidadTotal: number;
}

