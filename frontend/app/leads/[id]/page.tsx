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

  // Estado para el sticky header
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with Kavak Branding + Stepper */}
      <div className="bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] shadow-lg">
        <div className="px-6 pt-3 pb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push('/leads')}
              className="flex items-center text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a leads
            </button>
            <div className="text-right">
              <p className="text-xs text-white/70">Última actualización</p>
              <p className="text-xs font-medium text-white">{formatDate(lead.fechaUltimaActualizacion)}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-white">
              {lead.dealId} {country.flag} <span className="text-sm font-normal text-white/80 ml-2">Trámite de Financiamiento</span>
            </h1>
          </div>
          
          {/* Stepper integrado - compacto */}
          <TramiteStepper
            etapaActual={lead.etapaActual}
            estadoOferta={lead.estadoOferta}
            estadoHandoff={lead.estadoHandoff}
            estadoDictamen={lead.estadoDictamen}
            onStageClick={(stage) => setActiveTab(stage)}
          />
        </div>
      </div>

      {/* Sticky Info Bar - Cliente y Vehículo */}
      <div 
        className={`sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'py-4'
        }`}
      >
        <div className="px-6">
          <div className="flex items-center justify-between gap-6">
            {/* Cliente Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`bg-blue-100 p-2 rounded-lg transition-all ${isScrolled ? 'scale-90' : ''}`}>
                <User className={`text-[#2E5BFF] transition-all ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </div>
              <div className={`transition-all ${isScrolled ? 'space-y-0' : 'space-y-1'}`}>
                <p className={`font-bold text-gray-900 transition-all ${isScrolled ? 'text-sm' : 'text-base'}`}>
                  {lead.cliente.nombre} {lead.cliente.apellido}
                </p>
                {!isScrolled && (
                  <>
                    <p className="text-xs text-gray-500">
                      {lead.countryCode === 'AR' ? 'DNI' : 'RUT'}: {lead.cliente.dni}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.cliente.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.cliente.telefono}
                      </span>
                    </div>
                  </>
                )}
                {isScrolled && (
                  <p className="text-xs text-gray-500">
                    {lead.countryCode === 'AR' ? 'DNI' : 'RUT'}: {lead.cliente.dni} • {lead.cliente.email}
                  </p>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="h-12 w-px bg-gray-300"></div>

            {/* Vehículo Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`bg-teal-100 p-2 rounded-lg transition-all ${isScrolled ? 'scale-90' : ''}`}>
                <Car className={`text-[#00D4AA] transition-all ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </div>
              <div className={`transition-all ${isScrolled ? 'space-y-0' : 'space-y-1'}`}>
                <p className={`font-bold text-gray-900 transition-all ${isScrolled ? 'text-sm' : 'text-base'}`}>
                  {lead.vehiculo.marca} {lead.vehiculo.modelo}
                </p>
                {!isScrolled && (
                  <>
                    <p className="text-xs text-gray-500">
                      {lead.vehiculo.version} • {lead.vehiculo.anio}
                    </p>
                    <p className="text-xs text-gray-500">
                      SKU: {lead.vehiculo.sku} • {lead.vehiculo.kilometros?.toLocaleString()} km
                    </p>
                  </>
                )}
                {isScrolled && (
                  <p className="text-xs text-gray-500">
                    {lead.vehiculo.version} • {lead.vehiculo.anio} • {lead.vehiculo.sku}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`font-bold text-[#2E5BFF] transition-all ${isScrolled ? 'text-base' : 'text-xl'}`}>
                  {formatCurrency(lead.vehiculo.precio)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Full Width Content */}
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
  );
}


