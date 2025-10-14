import { Lead, LeadPriority, TramiteStage, TramiteStatus } from './leads';

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-001',
    dealId: 'DEAL-2025-001',
    prioridad: LeadPriority.ALTA,
    cliente: {
      id: 'cli-001',
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '38542123',
      email: 'juan.perez@email.com',
      telefono: '+54 9 11 2345-6789',
      ingresosAnuales: 8500000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-001',
      marca: 'Toyota',
      modelo: 'Corolla',
      version: 'XEI CVT',
      anio: 2022,
      sku: 'TOY-COR-22-001',
      precio: 12500000,
      kilometros: 25000,
      imagen: '/images/toyota-corolla.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.EN_PROCESO,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-14T10:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-14T14:30:00'),
    asignadoA: 'María González',
    subsidiary: 1,
    countryCode: 'AR'
  },
  {
    id: 'lead-002',
    dealId: 'DEAL-2025-002',
    prioridad: LeadPriority.ALTA,
    cliente: {
      id: 'cli-002',
      nombre: 'Carla',
      apellido: 'Rodríguez',
      dni: '40123456',
      email: 'carla.rodriguez@email.com',
      telefono: '+54 9 11 3456-7890',
      ingresosAnuales: 12000000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-002',
      marca: 'Volkswagen',
      modelo: 'T-Cross',
      version: 'Highline',
      anio: 2023,
      sku: 'VW-TCR-23-002',
      precio: 18500000,
      kilometros: 15000,
      imagen: '/images/vw-tcross.jpg'
    },
    etapaActual: TramiteStage.HANDOFF,
    estadoOferta: TramiteStatus.COMPLETADO,
    estadoHandoff: TramiteStatus.EN_PROCESO,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-13T09:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-14T11:15:00'),
    asignadoA: 'Pedro Sánchez',
    subsidiary: 1,
    countryCode: 'AR'
  },
  {
    id: 'lead-003',
    dealId: 'DEAL-2025-003',
    prioridad: LeadPriority.MEDIA,
    cliente: {
      id: 'cli-003',
      nombre: 'Roberto',
      apellido: 'Fernández',
      dni: '35789012',
      email: 'roberto.fernandez@email.com',
      telefono: '+54 9 11 4567-8901',
      ingresosAnuales: 6500000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-003',
      marca: 'Chevrolet',
      modelo: 'Onix',
      version: 'Premier',
      anio: 2021,
      sku: 'CHV-ONX-21-003',
      precio: 9500000,
      kilometros: 35000,
      imagen: '/images/chevrolet-onix.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-14T12:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-14T12:00:00'),
    subsidiary: 2,
    countryCode: 'AR'
  },
  {
    id: 'lead-004',
    dealId: 'DEAL-CL-2025-001',
    prioridad: LeadPriority.ALTA,
    cliente: {
      id: 'cli-004',
      nombre: 'Matías',
      apellido: 'Silva',
      dni: '18345678-9',
      email: 'matias.silva@email.cl',
      telefono: '+56 9 8765 4321',
      ingresosAnuales: 18000000,
      countryCode: 'CL'
    },
    vehiculo: {
      id: 'veh-004',
      marca: 'Hyundai',
      modelo: 'Tucson',
      version: 'Limited',
      anio: 2023,
      sku: 'HYU-TUC-23-004',
      precio: 15500000,
      kilometros: 8000,
      imagen: '/images/hyundai-tucson.jpg'
    },
    etapaActual: TramiteStage.DICTAMEN,
    estadoOferta: TramiteStatus.COMPLETADO,
    estadoHandoff: TramiteStatus.COMPLETADO,
    estadoDictamen: TramiteStatus.EN_PROCESO,
    fechaCreacion: new Date('2025-10-10T08:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-14T09:45:00'),
    asignadoA: 'Camila Torres',
    subsidiary: 3,
    countryCode: 'CL'
  },
  {
    id: 'lead-005',
    dealId: 'DEAL-2025-005',
    prioridad: LeadPriority.BAJA,
    cliente: {
      id: 'cli-005',
      nombre: 'Laura',
      apellido: 'Martínez',
      dni: '42567890',
      email: 'laura.martinez@email.com',
      telefono: '+54 9 11 5678-9012',
      ingresosAnuales: 5000000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-005',
      marca: 'Fiat',
      modelo: 'Cronos',
      version: 'Drive',
      anio: 2020,
      sku: 'FIA-CRO-20-005',
      precio: 7500000,
      kilometros: 45000,
      imagen: '/images/fiat-cronos.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-14T15:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-14T15:00:00'),
    subsidiary: 1,
    countryCode: 'AR'
  },
  {
    id: 'lead-006',
    dealId: 'DEAL-CL-2025-002',
    prioridad: LeadPriority.MEDIA,
    cliente: {
      id: 'cli-006',
      nombre: 'Diego',
      apellido: 'Muñoz',
      dni: '19456789-0',
      email: 'diego.munoz@email.cl',
      telefono: '+56 9 7654 3210',
      ingresosAnuales: 14000000,
      countryCode: 'CL'
    },
    vehiculo: {
      id: 'veh-006',
      marca: 'Nissan',
      modelo: 'Kicks',
      version: 'Exclusive',
      anio: 2022,
      sku: 'NIS-KIC-22-006',
      precio: 11500000,
      kilometros: 18000,
      imagen: '/images/nissan-kicks.jpg'
    },
    etapaActual: TramiteStage.HANDOFF,
    estadoOferta: TramiteStatus.COMPLETADO,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-12T11:00:00'),
    fechaUltimaActualizacion: new Date('2025-10-13T16:20:00'),
    asignadoA: 'Fernanda López',
    subsidiary: 3,
    countryCode: 'CL'
  }
];

