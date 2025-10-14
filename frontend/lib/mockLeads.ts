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
  },
  // Leads Sin Asignar
  {
    id: 'lead-unassigned-001',
    dealId: 'DEAL-2025-010',
    prioridad: LeadPriority.ALTA,
    cliente: {
      id: 'cli-010',
      nombre: 'Roberto',
      apellido: 'Gómez',
      dni: '42987654',
      email: 'roberto.gomez@email.com',
      telefono: '+54 9 11 7654-3210',
      ingresosAnuales: 15000000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-010',
      marca: 'BMW',
      modelo: '320i',
      version: 'M Sport',
      anio: 2023,
      sku: 'BMW-320-23-001',
      precio: 28000000,
      kilometros: 5000,
      imagen: '/images/bmw-320i.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-06T09:00:00'), // 8 días atrás
    fechaUltimaActualizacion: new Date('2025-10-06T09:00:00'),
    asignadoA: undefined,
    subsidiary: 1,
    countryCode: 'AR'
  },
  {
    id: 'lead-unassigned-002',
    dealId: 'DEAL-2025-011',
    prioridad: LeadPriority.ALTA,
    cliente: {
      id: 'cli-011',
      nombre: 'Patricia',
      apellido: 'Fernández',
      dni: '19876543',
      email: 'patricia.fernandez@email.cl',
      telefono: '+56 9 8765 4321',
      ingresosAnuales: 18000000,
      countryCode: 'CL'
    },
    vehiculo: {
      id: 'veh-011',
      marca: 'Mercedes-Benz',
      modelo: 'Clase C',
      version: 'C200',
      anio: 2023,
      sku: 'MB-C200-23-001',
      precio: 35000000,
      kilometros: 8000,
      imagen: '/images/mercedes-c200.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-10T14:30:00'), // 4 días atrás
    fechaUltimaActualizacion: new Date('2025-10-10T14:30:00'),
    asignadoA: undefined,
    subsidiary: 2,
    countryCode: 'CL'
  },
  {
    id: 'lead-unassigned-003',
    dealId: 'DEAL-2025-012',
    prioridad: LeadPriority.MEDIA,
    cliente: {
      id: 'cli-012',
      nombre: 'Diego',
      apellido: 'Martínez',
      dni: '35123456',
      email: 'diego.martinez@email.com',
      telefono: '+54 9 11 2345-9876',
      ingresosAnuales: 7500000,
      countryCode: 'AR'
    },
    vehiculo: {
      id: 'veh-012',
      marca: 'Honda',
      modelo: 'Civic',
      version: 'EX',
      anio: 2021,
      sku: 'HON-CIV-21-002',
      precio: 11000000,
      kilometros: 35000,
      imagen: '/images/honda-civic.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-13T08:00:00'), // 1 día atrás
    fechaUltimaActualizacion: new Date('2025-10-13T08:00:00'),
    asignadoA: undefined,
    subsidiary: 1,
    countryCode: 'AR'
  },
  {
    id: 'lead-unassigned-004',
    dealId: 'DEAL-2025-013',
    prioridad: LeadPriority.BAJA,
    cliente: {
      id: 'cli-013',
      nombre: 'Lucia',
      apellido: 'Torres',
      dni: '18765432',
      email: 'lucia.torres@email.cl',
      telefono: '+56 9 7654 3210',
      ingresosAnuales: 5500000,
      countryCode: 'CL'
    },
    vehiculo: {
      id: 'veh-013',
      marca: 'Chevrolet',
      modelo: 'Onix',
      version: 'LT',
      anio: 2020,
      sku: 'CHV-ONX-20-001',
      precio: 7500000,
      kilometros: 50000,
      imagen: '/images/chevrolet-onix.jpg'
    },
    etapaActual: TramiteStage.OFERTA,
    estadoOferta: TramiteStatus.PENDIENTE,
    estadoHandoff: TramiteStatus.PENDIENTE,
    estadoDictamen: TramiteStatus.PENDIENTE,
    fechaCreacion: new Date('2025-10-11T16:00:00'), // 3 días atrás
    fechaUltimaActualizacion: new Date('2025-10-11T16:00:00'),
    asignadoA: undefined,
    subsidiary: 3,
    countryCode: 'CL'
  }
];

