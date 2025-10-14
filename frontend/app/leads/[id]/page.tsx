'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MOCK_LEADS } from '@/lib/mockLeads';
import { TramiteStage } from '@/lib/leads';
import TramiteStepper from '@/components/TramiteStepper';
import { COUNTRIES } from '@/lib/countries';
import { ArrowLeft, User, Car, Calendar, Building, Phone, Mail, FileText } from 'lucide-react';
import SimulatorForm from '@/components/SimulatorForm';
import { SelectedSimulation } from '@/lib/types';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const lead = MOCK_LEADS.find(l => l.id === id);
  const [activeTab, setActiveTab] = useState<TramiteStage>(TramiteStage.OFERTA);
  const [selectedSimulation, setSelectedSimulation] = useState<SelectedSimulation | null>(null);

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
    <div className="min-h-screen">
      {/* Header with Kavak Branding */}
      <div className="bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/leads')}
            className="flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a leads
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {lead.dealId} {country.flag}
              </h1>
              <p className="text-white/90">
                {lead.cliente.nombre} {lead.cliente.apellido} • {lead.vehiculo.marca} {lead.vehiculo.modelo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Última actualización</p>
              <p className="text-sm font-medium text-white">{formatDate(lead.fechaUltimaActualizacion)}</p>
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
            onStageClick={(stage) => setActiveTab(stage)}
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
                  <User className="w-5 h-5 text-[#2E5BFF]" />
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
                  <p className="text-sm text-gray-500">{lead.countryCode === 'AR' ? 'DNI' : 'RUT'}</p>
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
              </div>
            </div>

            {/* Vehiculo Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-2 rounded-lg mr-3">
                  <Car className="w-5 h-5 text-[#00D4AA]" />
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
            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === TramiteStage.OFERTA && (
                <SimulatorForm
                  leadData={lead}
                  onSimulationComplete={(result) => {
                    console.log('Simulación completada:', result);
                    setSelectedSimulation(result);
                    setActiveTab(TramiteStage.HANDOFF);
                  }}
                />
              )}

              {activeTab === TramiteStage.HANDOFF && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Handoff</h3>
                  
                  {selectedSimulation ? (
                    <div className="space-y-6">
                      {/* Simulación Seleccionada */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-2xl">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">Oferta Aceptada</h4>
                            <p className="text-sm text-gray-600">
                              Financiamiento del {selectedSimulation.porcentaje}% • {selectedSimulation.cuotas} cuotas
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Monto a Financiar</p>
                            <p className="text-lg font-bold text-[#2E5BFF]">
                              {formatCurrency(selectedSimulation.montoFinanciar)}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Cuotas</p>
                            <p className="text-lg font-bold text-gray-900">
                              {selectedSimulation.cuotas} meses
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Valor Cuota</p>
                            <p className="text-lg font-bold text-[#00D4AA]">
                              {formatCurrency(selectedSimulation.valorCuota)}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">TNA</p>
                            <p className="text-lg font-bold text-gray-900">
                              {selectedSimulation.tna.toFixed(2)}%
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">TEA</p>
                            <p className="text-lg font-bold text-gray-900">
                              {selectedSimulation.tea.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Próximos pasos de Handoff */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <p className="text-blue-900 font-medium mb-2 text-center">Funcionalidad Handoff</p>
                        <p className="text-blue-700 text-sm text-center">
                          Esta sección estará disponible próximamente para gestionar la entrega del vehículo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                      <p className="text-yellow-800">
                        Primero debes completar y aprobar una simulación en la etapa de Oferta
                      </p>
                    </div>
                  )}
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

