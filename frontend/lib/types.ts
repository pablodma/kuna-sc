// Tipos para el sistema de simulación de crédito

export interface Cliente {
  nombre: string;
  apellido: string;
  dni: string;
  ingresosAnuales: number;
}

export interface Vehiculo {
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  sku: string;
}

export interface FinancingOfferRequest {
  cliente: Cliente;
  vehiculo: Vehiculo;
  porcentajeFinanciar: number;
  dealId?: string;
  subsidiary?: number;
  country?: string;
}

export interface Simulacion {
  meses: number;
  cuotaMensual: number;
  tna: number;
  tae: number;
}

export interface SimulacionResponse {
  montoTotal: number;
  montoFinanciado: number;
  simulaciones: Simulacion[];
}

export interface AjustesSistema {
  id: number;
  porcentajeMaximo: number;
  actualizadoPor: string;
  timestamp: string;
}

export interface SettingsRequest {
  porcentajeMaximo: number;
}

// Tipos para datos del CRM
export interface CRMData {
  'client-id': string;
  'request-id': string;
  subject: string;
  'dd.trace_id': string;
  'dd.service': string;
  'dd.env': string;
  'dd.version': string;
  'dd.span_id': string;
  '@timestamp': string;
  level: string;
  logger: string;
  message: {
    event_type: string;
    remote_host: string;
    method: string;
    url: string;
    request_payload: {
      deal_id: string;
      subsidiary: number;
      core_subsidiary: number;
      country: string;
      fiscal_data: {
        type: string;
        isperson: string;
        full_name: string;
        email: string;
        phone: string;
        uuid: string;
        nationality: string;
        bussines_name: string;
        companyname: string;
        document_number: string;
        document_type: string;
        tax_regime: string;
        location: {
          country: string;
          city: string;
          street: string;
          exterior_number: string;
          zip_code: string;
          colony: string;
          state: number;
          delegation: string;
        };
      };
      sales_order: {
        id: string;
        initial_value: string;
        order_status: string;
        currency_code: string;
        exchange_rate: string;
        payment_method: {
          type: string;
        };
        trade_in_info: {
          is_trade_in: string;
        };
        B2B_info: {
          is_B2B: string;
        };
        product: {
          name: string;
          sku: string;
          quantity: number;
          stock_id: string;
          type: string;
          externalId: string;
        };
        adjustments: any[];
      };
      payments: any[];
    };
    status_code: number;
    timestamp: string;
    elapsed_time: number;
  };
}






