import { CountryCode } from './countries';

// Prioridades de leads
export enum LeadPriority {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA'
}

// Estados del trámite
export enum TramiteStage {
  OFERTA = 'OFERTA',
  HANDOFF = 'HANDOFF',
  DICTAMEN = 'DICTAMEN'
}

export enum TramiteStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO'
}

// Tipos de datos
export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  ingresosAnuales: number;
  countryCode: CountryCode;
}

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  sku: string;
  precio: number;
  kilometros: number;
  imagen?: string;
}

export interface Lead {
  id: string;
  dealId: string;
  prioridad: LeadPriority;
  cliente: Cliente;
  vehiculo: Vehiculo;
  etapaActual: TramiteStage;
  estadoOferta: TramiteStatus;
  estadoHandoff: TramiteStatus;
  estadoDictamen: TramiteStatus;
  fechaCreacion: Date;
  fechaUltimaActualizacion: Date;
  asignadoA?: string;
  subsidiary: number;
  countryCode: CountryCode;
}

export const PRIORITY_COLORS = {
  [LeadPriority.ALTA]: 'text-red-600 bg-red-50 border-red-200',
  [LeadPriority.MEDIA]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  [LeadPriority.BAJA]: 'text-green-600 bg-green-50 border-green-200'
};

export const PRIORITY_LABELS = {
  [LeadPriority.ALTA]: 'Alta',
  [LeadPriority.MEDIA]: 'Media',
  [LeadPriority.BAJA]: 'Baja'
};

export const STAGE_LABELS = {
  [TramiteStage.OFERTA]: 'Oferta',
  [TramiteStage.HANDOFF]: 'Handoff',
  [TramiteStage.DICTAMEN]: 'Dictamen'
};

export const STATUS_LABELS = {
  [TramiteStatus.PENDIENTE]: 'Pendiente',
  [TramiteStatus.EN_PROCESO]: 'En Proceso',
  [TramiteStatus.COMPLETADO]: 'Completado',
  [TramiteStatus.RECHAZADO]: 'Rechazado'
};

export const STATUS_COLORS = {
  [TramiteStatus.PENDIENTE]: 'text-gray-600 bg-gray-50',
  [TramiteStatus.EN_PROCESO]: 'text-blue-600 bg-blue-50',
  [TramiteStatus.COMPLETADO]: 'text-green-600 bg-green-50',
  [TramiteStatus.RECHAZADO]: 'text-red-600 bg-red-50'
};

