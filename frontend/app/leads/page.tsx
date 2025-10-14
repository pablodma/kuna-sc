'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_LEADS } from '@/lib/mockLeads';
import { 
  Lead, 
  LeadPriority, 
  TramiteStage,
  TramiteStatus,
  PRIORITY_COLORS, 
  PRIORITY_LABELS,
  STAGE_LABELS,
  STATUS_LABELS 
} from '@/lib/leads';
import { COUNTRIES } from '@/lib/countries';
import { Search, Filter, ArrowUpDown, Car, User, Clock, Settings } from 'lucide-react';
import CountrySelector from '@/components/CountrySelector';
import { useAuthStore } from '@/store/authStore';

export default function LeadsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<LeadPriority | 'ALL'>('ALL');
  const [filterStage, setFilterStage] = useState<TramiteStage | 'ALL'>('ALL');
  const [filterCountry, setFilterCountry] = useState<'ALL' | 'AR' | 'CL'>('ALL');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cliente.dni.includes(searchTerm) ||
      lead.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || lead.prioridad === filterPriority;
    const matchesStage = filterStage === 'ALL' || lead.etapaActual === filterStage;
    const matchesCountry = filterCountry === 'ALL' || lead.countryCode === filterCountry;

    return matchesSearch && matchesPriority && matchesStage && matchesCountry;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number, countryCode: 'AR' | 'CL') => {
    const country = COUNTRIES[countryCode];
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calcular aging (días desde creación)
  const getAging = (createdAt: Date): number => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getAgingColor = (days: number): string => {
    if (days <= 2) return 'bg-green-100 text-green-800 border-green-300';
    if (days <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (days <= 7) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  // Separar leads sin asignar
  const unassignedLeads = filteredLeads.filter(lead => !lead.asignadoA).sort((a, b) => {
    // Ordenar por prioridad y luego por aging
    const priorityOrder = { [LeadPriority.ALTA]: 0, [LeadPriority.MEDIA]: 1, [LeadPriority.BAJA]: 2 };
    const priorityDiff = priorityOrder[a.prioridad] - priorityOrder[b.prioridad];
    if (priorityDiff !== 0) return priorityDiff;
    return getAging(b.fechaCreacion) - getAging(a.fechaCreacion); // Más antiguos primero
  });

  const assignedLeads = filteredLeads.filter(lead => lead.asignadoA);

  const handleTakeLead = (leadId: string) => {
    // TODO: Conectar con API para asignar lead al usuario actual
    alert(`Lead ${leadId} tomado! (Implementar asignación real)`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Kavak Branding */}
        <div className="mb-8 bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leads y Oportunidades</h1>
              <p className="text-white/90">Gestiona todas las oportunidades de financiamiento</p>
            </div>
            <div className="flex items-center space-x-4">
              <CountrySelector />
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center font-medium backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </button>
              )}
              <div className="text-right">
                <p className="text-sm font-semibold">KAVAK</p>
                <p className="text-[#00D4AA] font-bold">CRÉDITO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, DNI, deal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as LeadPriority | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value={LeadPriority.ALTA}>Alta</option>
              <option value={LeadPriority.MEDIA}>Media</option>
              <option value={LeadPriority.BAJA}>Baja</option>
            </select>

            {/* Stage Filter */}
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as TramiteStage | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
            >
              <option value="ALL">Todas las etapas</option>
              <option value={TramiteStage.OFERTA}>Oferta</option>
              <option value={TramiteStage.HANDOFF}>Handoff</option>
              <option value={TramiteStage.DICTAMEN}>Dictamen</option>
            </select>

            {/* Country Filter */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value as 'ALL' | 'AR' | 'CL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
            >
              <option value="ALL">Todos los países</option>
              <option value="AR">{COUNTRIES.AR.flag} Argentina</option>
              <option value="CL">{COUNTRIES.CL.flag} Chile</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{filteredLeads.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredLeads.filter(l => l.prioridad === LeadPriority.ALTA).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <ArrowUpDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredLeads.filter(l => 
                    l.estadoOferta === TramiteStatus.EN_PROCESO ||
                    l.estadoHandoff === TramiteStatus.EN_PROCESO ||
                    l.estadoDictamen === TramiteStatus.EN_PROCESO
                  ).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLeads.filter(l => 
                    l.estadoOferta === TramiteStatus.COMPLETADO &&
                    l.estadoHandoff === TramiteStatus.COMPLETADO &&
                    l.estadoDictamen === TramiteStatus.COMPLETADO
                  ).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Sin Asignar - Priority Section */}
        {unassignedLeads.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-t-xl p-4 text-white flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-3 animate-pulse" />
                <div>
                  <h2 className="text-xl font-bold">Leads Sin Asignar</h2>
                  <p className="text-sm text-white/90">¡Toma un lead y comienza a trabajar!</p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold">{unassignedLeads.length}</span>
                <span className="text-sm ml-2">esperando</span>
              </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {unassignedLeads.map((lead) => {
                  const aging = getAging(lead.fechaCreacion);
                  const country = COUNTRIES[lead.countryCode];
                  
                  return (
                    <div
                      key={lead.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-[#2E5BFF] bg-gradient-to-br from-white to-gray-50"
                    >
                      {/* Header con Prioridad y Aging */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_COLORS[lead.prioridad]}`}>
                          {PRIORITY_LABELS[lead.prioridad]}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${getAgingColor(aging)}`}>
                          🕐 {aging} {aging === 1 ? 'día' : 'días'}
                        </span>
                      </div>

                      {/* Información del Cliente */}
                      <div className="mb-3">
                        <p className="font-bold text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-2 text-[#2E5BFF]" />
                          {lead.cliente.nombre} {lead.cliente.apellido}
                        </p>
                        <p className="text-sm text-gray-600 ml-6">{country.flag} {lead.dealId}</p>
                      </div>

                      {/* Información del Vehículo */}
                      <div className="mb-3 bg-blue-50 rounded-lg p-2">
                        <p className="text-sm font-semibold text-gray-900 flex items-center">
                          <Car className="w-4 h-4 mr-2 text-[#00D4AA]" />
                          {lead.vehiculo.marca} {lead.vehiculo.modelo}
                        </p>
                        <p className="text-xs text-gray-600 ml-6">
                          {lead.vehiculo.anio} • {formatCurrency(lead.vehiculo.precio, lead.countryCode)}
                        </p>
                      </div>

                      {/* Fecha de Creación */}
                      <p className="text-xs text-gray-500 mb-3">
                        Creado: {formatDate(lead.fechaCreacion)}
                      </p>

                      {/* Botón Tomar Lead */}
                      <button
                        onClick={() => handleTakeLead(lead.id)}
                        className="w-full py-2 bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Tomar Lead
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leads Asignados - Table */}
        {assignedLeads.length > 0 && (
          <div className="mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-t-lg p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Leads Asignados</h2>
              <p className="text-sm text-gray-600">Leads que ya tienen un comercial trabajando</p>
            </div>
            <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etapa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última actualización
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${PRIORITY_COLORS[lead.prioridad]}`}>
                        {PRIORITY_LABELS[lead.prioridad]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{lead.dealId}</span>
                        <span className="ml-2 text-lg">{COUNTRIES[lead.countryCode].flag}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.cliente.nombre} {lead.cliente.apellido}
                      </div>
                      <div className="text-sm text-gray-500">{lead.cliente.dni}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.vehiculo.marca} {lead.vehiculo.modelo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.vehiculo.version} • {lead.vehiculo.anio}
                      </div>
                      <div className="text-sm font-semibold text-gray-700">
                        {formatCurrency(lead.vehiculo.precio, lead.countryCode)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {STAGE_LABELS[lead.etapaActual]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.asignadoA || 'Sin asignar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.fechaUltimaActualizacion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/leads/${lead.id}`);
                        }}
                        className="text-[#2E5BFF] hover:text-[#00D4AA] font-semibold transition-colors"
                      >
                        Ver detalle →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {assignedLeads.length === 0 && unassignedLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron leads que coincidan con los filtros</p>
            </div>
          )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

