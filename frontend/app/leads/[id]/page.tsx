'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_LEADS } from '@/lib/mockLeads';
import { TramiteStage } from '@/lib/leads';
import TramiteStepper from '@/components/TramiteStepper';
import { COUNTRIES } from '@/lib/countries';
import { ArrowLeft, User, Car, Calendar, Building, Phone, Mail, FileText } from 'lucide-react';
import SimulatorForm from '@/components/SimulatorForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const lead = MOCK_LEADS.find(l => l.id === id);
  const [activeTab, setActiveTab] = useState<TramiteStage>(TramiteStage.OFERTA);

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead no encontrado</h2>
          <p className="text-gray-600 mb-4">El lead que buscas no existe</p>
          <button
            onClick={() => router.push('/leads')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a leads
          </button>
        </div>
      </div>
    );
  }

  const country = COUNTRIES[lead.countryCode];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/leads')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a leads
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lead.dealId} {country.flag}
              </h1>
              <p className="text-gray-600">
                {lead.cliente.nombre} {lead.cliente.apellido} • {lead.vehiculo.marca} {lead.vehiculo.modelo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(lead.fechaUltimaActualizacion)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <TramiteStepper
            etapaActual={lead.etapaActual}
            estadoOferta={lead.estadoOferta}
            estadoHandoff={lead.estadoHandoff}
            estadoDictamen={lead.estadoDictamen}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cliente Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nombre completo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.cliente.nombre} {lead.cliente.apellido}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DNI / RUT</p>
                  <p className="text-sm font-medium text-gray-900">{lead.cliente.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                    {lead.cliente.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                    {lead.cliente.telefono}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ingresos anuales</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(lead.cliente.ingresosAnuales)}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehiculo Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Vehículo</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Vehículo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.vehiculo.marca} {lead.vehiculo.modelo}
                  </p>
                  <p className="text-sm text-gray-600">{lead.vehiculo.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Año / Kilometraje</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.vehiculo.anio} • {lead.vehiculo.kilometros.toLocaleString()} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="text-sm font-medium text-gray-900">{lead.vehiculo.sku}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(lead.vehiculo.precio)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Asignado a</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lead.asignadoA || 'Sin asignar'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sucursal</p>
                  <p className="text-sm font-medium text-gray-900">
                    Sucursal #{lead.subsidiary}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">País</p>
                  <p className="text-sm font-medium text-gray-900">
                    {country.flag} {country.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de creación</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(lead.fechaCreacion)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stage Forms */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg shadow-sm border-b border-gray-200">
              <div className="flex space-x-1 p-2">
                <button
                  onClick={() => setActiveTab(TramiteStage.OFERTA)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === TramiteStage.OFERTA
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Oferta
                </button>
                <button
                  onClick={() => setActiveTab(TramiteStage.HANDOFF)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === TramiteStage.HANDOFF
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Handoff
                </button>
                <button
                  onClick={() => setActiveTab(TramiteStage.DICTAMEN)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === TramiteStage.DICTAMEN
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dictamen
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-lg shadow-sm p-6">
              {activeTab === TramiteStage.OFERTA && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Simulación de Oferta</h3>
                  <SimulatorForm
                    onSimulationComplete={(result) => {
                      console.log('Simulación completada:', result);
                    }}
                    crmData={{
                      cliente: {
                        nombre: lead.cliente.nombre,
                        apellido: lead.cliente.apellido,
                        dni: lead.cliente.dni,
                        ingresosAnuales: lead.cliente.ingresosAnuales
                      },
                      vehiculo: {
                        marca: lead.vehiculo.marca,
                        modelo: lead.vehiculo.modelo,
                        version: lead.vehiculo.version,
                        anio: lead.vehiculo.anio,
                        sku: lead.vehiculo.sku
                      },
                      dealId: lead.dealId,
                      subsidiary: lead.subsidiary,
                      country: lead.countryCode
                    }}
                  />
                </div>
              )}

              {activeTab === TramiteStage.HANDOFF && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Handoff</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-blue-900 font-medium mb-2">Funcionalidad Handoff</p>
                    <p className="text-blue-700 text-sm">
                      Esta sección estará disponible próximamente para gestionar la entrega del vehículo
                    </p>
                  </div>
                </div>
              )}

              {activeTab === TramiteStage.DICTAMEN && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Procesamiento de Dictamen</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <p className="text-purple-900 font-medium mb-2">Funcionalidad Dictamen</p>
                    <p className="text-purple-700 text-sm">
                      Esta sección estará disponible próximamente para procesar el dictamen de financiamiento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

