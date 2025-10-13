'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { SimulacionResponse, CRMData } from '@/lib/types';
import SimulatorForm from '@/components/SimulatorForm';
import SimulationResults from '@/components/SimulationResults';

export default function DashboardPage() {
  const [simulation, setSimulation] = useState<SimulacionResponse | null>(null);
  const [crmData, setCrmData] = useState<CRMData | null>(null);
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simular recepción de datos del CRM
    // En un escenario real, esto vendría de una API o WebSocket
    const mockCRMData: CRMData = {
      'client-id': 'crm-adapters-api',
      'request-id': '7eb73254efecba5e6604cf3d8587ecca',
      subject: 'urn:kavak:app:crm-adapters-api',
      'dd.trace_id': '2295724407137305685',
      'dd.service': 'sales-api',
      'dd.env': 'production',
      'dd.version': '24070c25',
      'dd.span_id': '6329366359885363861',
      '@timestamp': '2025-10-08T20:25:41.591601244Z',
      level: 'INFO',
      logger: 'c.k.p.s.core.logger.LoggingFilter',
      message: {
        event_type: 'access',
        remote_host: '10.30.245.151',
        method: 'POST',
        url: 'https://sales-api.prd.kavak.io/api/crm/salesforce/sales-order-request',
        request_payload: {
          deal_id: '0199b526-6c22-7cf5-bd9b-df77004d769e',
          subsidiary: 8,
          core_subsidiary: 8,
          country: 'AR',
          fiscal_data: {
            type: '1',
            isperson: 'true',
            full_name: 'Mariano Gabriel Cabrera',
            email: 'mariano.cabrera@example.com',
            phone: '+5491123456789',
            uuid: '741069d8-4365-4e60-84ce-416b5075a460',
            nationality: '6',
            bussines_name: 'Mariano Gabriel Cabrera',
            companyname: 'Mariano Gabriel Cabrera',
            document_number: '23422486909',
            document_type: '45',
            tax_regime: '5',
            location: {
              country: 'AR',
              city: 'Buenos Aires',
              street: 'Evaristo Carriego 2537 Ingeniero Budge',
              exterior_number: '',
              zip_code: '1827',
              colony: 'Buenos Aires',
              state: 161,
              delegation: 'Buenos Aires'
            }
          },
          sales_order: {
            id: '801Rf00000ZJMwlIAH',
            initial_value: '991250',
            order_status: 'Approved',
            currency_code: 'ARS',
            exchange_rate: '',
            payment_method: {
              type: '2'
            },
            trade_in_info: {
              is_trade_in: 'false'
            },
            B2B_info: {
              is_B2B: 'false'
            },
            product: {
              name: 'Toyota Corolla XEI',
              sku: '32311304',
              quantity: 1,
              stock_id: '448465',
              type: 'Toyota Corolla XEI',
              externalId: '20e1cc4e-b78e-423e-9680-6f1589ae23dd'
            },
            adjustments: []
          },
          payments: []
        },
        status_code: 200,
        timestamp: '2025-10-08T20:25:41.591533163Z',
        elapsed_time: 53
      }
    };

    // Simular delay de recepción de datos del CRM
    setTimeout(() => {
      setCrmData(mockCRMData);
    }, 1000);
  }, [isAuthenticated, router]);

  const handleSimulationComplete = (simulationData: SimulacionResponse) => {
    setSimulation(simulationData);
  };

  const handleNewSimulation = () => {
    setSimulation(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulador de Crédito</h1>
              <p className="text-gray-600">Sistema de ofertas de financiamiento Kavak</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!simulation ? (
            <div>
              {crmData ? (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Datos del CRM cargados
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Cliente: {crmData.message.request_payload.fiscal_data.full_name}</p>
                        <p>Vehículo: {crmData.message.request_payload.sales_order.product.name}</p>
                        <p>Deal ID: {crmData.message.request_payload.deal_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Esperando datos del CRM
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Los datos del lead se cargarán automáticamente cuando estén disponibles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <SimulatorForm 
                onSimulationComplete={handleSimulationComplete}
                crmData={crmData}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Simulación Completada</h2>
                <button
                  onClick={handleNewSimulation}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Nueva Simulación
                </button>
              </div>
              
              <SimulationResults simulation={simulation} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}






