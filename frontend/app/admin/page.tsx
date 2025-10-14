'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Settings, 
  TrendingUp, 
  Users, 
  Shield,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Activity
} from 'lucide-react';
import { OfertaRules, PriorityRule, EmployeeMetrics, QualityMetrics } from '@/lib/adminTypes';
import { 
  MOCK_EMPLOYEE_METRICS, 
  MOCK_QUALITY_METRICS, 
  MOCK_EMPLOYEE_LOGS,
  MOCK_PRIORITY_RULES 
} from '@/lib/mockAdminData';

type TabType = 'oferta-rules' | 'priority-rules' | 'performance' | 'logs';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('oferta-rules');
  
  // Estados para Reglas de Oferta
  const [ofertaRulesAR, setOfertaRulesAR] = useState<OfertaRules>({
    porcentajeMinimo: 10,
    porcentajeMaximo: 80,
    cuotasMinimas: 6,
    cuotasMaximas: 72,
    intervalo: 6,
    countryCode: 'AR'
  });
  
  const [ofertaRulesCL, setOfertaRulesCL] = useState<OfertaRules>({
    porcentajeMinimo: 15,
    porcentajeMaximo: 70,
    cuotasMinimas: 12,
    cuotasMaximas: 60,
    intervalo: 6,
    countryCode: 'CL'
  });
  
  // Estados para Reglas de Prioridad
  const [priorityRules, setPriorityRules] = useState<PriorityRule[]>(MOCK_PRIORITY_RULES);
  
  // Estados para Performance
  const [employeeMetrics] = useState<EmployeeMetrics[]>(MOCK_EMPLOYEE_METRICS);
  const [qualityMetrics] = useState<QualityMetrics[]>(MOCK_QUALITY_METRICS);
  const [employeeLogs] = useState(MOCK_EMPLOYEE_LOGS);

  // Verificar permisos de admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Solo administradores pueden acceder a esta sección</p>
          <button
            onClick={() => router.push('/leads')}
            className="px-4 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors"
          >
            Volver a Leads
          </button>
        </div>
      </div>
    );
  }

  const handleSaveOfertaRules = () => {
    // TODO: Conectar con API
    console.log('Guardando reglas de oferta:', { AR: ofertaRulesAR, CL: ofertaRulesCL });
    alert('✅ Reglas guardadas exitosamente (mock)');
  };

  const handleTogglePriorityRule = (id: string) => {
    setPriorityRules(priorityRules.map(rule => 
      rule.id === id ? { ...rule, activa: !rule.activa } : rule
    ));
  };

  const handleDeletePriorityRule = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta regla?')) {
      setPriorityRules(priorityRules.filter(rule => rule.id !== id));
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'OFFER_ACCEPTED': return 'bg-green-100 text-green-800';
      case 'OFFER_REJECTED': return 'bg-red-100 text-red-800';
      case 'SIMULATION_CREATED': return 'bg-blue-100 text-blue-800';
      case 'LEAD_ASSIGNED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white animate-fadeIn">
          <button
            onClick={() => router.push('/leads')}
            className="flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Leads
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-white/90">Configuración del sistema y métricas de performance</p>
            </div>
            <Settings className="w-12 h-12 opacity-20" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-2 mb-6 animate-slideIn">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('oferta-rules')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'oferta-rules'
                  ? 'bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5 mr-2" />
              Reglas de Oferta
            </button>
            <button
              onClick={() => setActiveTab('priority-rules')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'priority-rules'
                  ? 'bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Prioridad de Leads
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'performance'
                  ? 'bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-5 h-5 mr-2" />
              Logs
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-scaleIn">
          {activeTab === 'oferta-rules' && (
            <div className="space-y-6">
              {/* Argentina */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">🇦🇷</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Argentina</h2>
                    <p className="text-sm text-gray-600">Configuración de reglas de oferta</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje Mínimo a Financiar
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesAR.porcentajeMinimo}
                        onChange={(e) => setOfertaRulesAR({ ...ofertaRulesAR, porcentajeMinimo: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        max="100"
                      />
                      <span className="text-gray-600 font-semibold">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje Máximo a Financiar
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesAR.porcentajeMaximo}
                        onChange={(e) => setOfertaRulesAR({ ...ofertaRulesAR, porcentajeMaximo: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        max="100"
                      />
                      <span className="text-gray-600 font-semibold">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuotas Mínimas
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesAR.cuotasMinimas}
                        onChange={(e) => setOfertaRulesAR({ ...ofertaRulesAR, cuotasMinimas: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        step={ofertaRulesAR.intervalo}
                      />
                      <span className="text-gray-600 font-semibold">meses</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuotas Máximas
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesAR.cuotasMaximas}
                        onChange={(e) => setOfertaRulesAR({ ...ofertaRulesAR, cuotasMaximas: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        step={ofertaRulesAR.intervalo}
                      />
                      <span className="text-gray-600 font-semibold">meses</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo de Cuotas
                    </label>
                    <select
                      value={ofertaRulesAR.intervalo}
                      onChange={(e) => setOfertaRulesAR({ ...ofertaRulesAR, intervalo: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                    >
                      <option value="3">Cada 3 meses</option>
                      <option value="6">Cada 6 meses</option>
                      <option value="12">Cada 12 meses</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chile */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">🇨🇱</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chile</h2>
                    <p className="text-sm text-gray-600">Configuración de reglas de oferta</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje Mínimo a Financiar
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesCL.porcentajeMinimo}
                        onChange={(e) => setOfertaRulesCL({ ...ofertaRulesCL, porcentajeMinimo: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        max="100"
                      />
                      <span className="text-gray-600 font-semibold">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje Máximo a Financiar
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesCL.porcentajeMaximo}
                        onChange={(e) => setOfertaRulesCL({ ...ofertaRulesCL, porcentajeMaximo: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        max="100"
                      />
                      <span className="text-gray-600 font-semibold">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuotas Mínimas
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesCL.cuotasMinimas}
                        onChange={(e) => setOfertaRulesCL({ ...ofertaRulesCL, cuotasMinimas: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        step={ofertaRulesCL.intervalo}
                      />
                      <span className="text-gray-600 font-semibold">meses</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuotas Máximas
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={ofertaRulesCL.cuotasMaximas}
                        onChange={(e) => setOfertaRulesCL({ ...ofertaRulesCL, cuotasMaximas: parseInt(e.target.value) })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                        min="1"
                        step={ofertaRulesCL.intervalo}
                      />
                      <span className="text-gray-600 font-semibold">meses</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo de Cuotas
                    </label>
                    <select
                      value={ofertaRulesCL.intervalo}
                      onChange={(e) => setOfertaRulesCL({ ...ofertaRulesCL, intervalo: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent"
                    >
                      <option value="3">Cada 3 meses</option>
                      <option value="6">Cada 6 meses</option>
                      <option value="12">Cada 12 meses</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveOfertaRules}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Configuración
                </button>
              </div>
            </div>
          )}

          {activeTab === 'priority-rules' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Reglas de Prioridad</h2>
                  <p className="text-gray-600">Define cómo se priorizan los leads automáticamente</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors">
                  <Plus className="w-5 h-5 mr-2" />
                  Nueva Regla
                </button>
              </div>

              {/* Lista de Reglas */}
              {priorityRules.map(rule => (
                <div
                  key={rule.id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    rule.prioridad === 'ALTA' ? 'border-red-500' :
                    rule.prioridad === 'MEDIA' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{rule.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rule.prioridad === 'ALTA' ? 'bg-red-100 text-red-800' :
                          rule.prioridad === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rule.prioridad}
                        </span>
                        <span className="text-sm text-gray-500">Puntaje: {rule.puntaje}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{rule.descripcion}</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {rule.condicion}
                      </code>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleTogglePriorityRule(rule.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          rule.activa 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={rule.activa ? 'Desactivar' : 'Activar'}
                      >
                        {rule.activa ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDeletePriorityRule(rule.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

{activeTab === 'performance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard de Performance</h2>
              
              {/* Métricas por Empleado */}
              {employeeMetrics.map((metrics, idx) => {
                const quality = qualityMetrics.find(q => q.employeeId === metrics.employeeId);
                
                return (
                  <div key={metrics.employeeId} className="bg-white rounded-lg shadow-md p-6">
                    {/* Header del Empleado */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                          {metrics.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{metrics.employeeName}</h3>
                          <p className="text-sm text-gray-600">{metrics.role.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getQualityColor(quality?.scoreCalidadTotal || 0)}`}>
                        Score: {quality?.scoreCalidadTotal}/100
                      </div>
                    </div>

                    {/* Métricas en Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {/* Volumen */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Leads Atendidos</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.leadsAtendidos}</p>
                        <p className="text-xs text-gray-500">de {metrics.leadsAsignados} asignados</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Ofertas Aceptadas</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.ofertasAceptadas}</p>
                        <p className="text-xs text-gray-500">de {metrics.ofertasGeneradas} generadas</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Tasa Conversión</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.tasaConversion.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">promedio</p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Tiempo Promedio</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.tiempoPromedioAtencion}</p>
                        <p className="text-xs text-gray-500">minutos</p>
                      </div>
                    </div>

                    {/* Calidad del Crédito */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Calidad del Crédito</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Score Crediticio Promedio</p>
                          <p className="text-lg font-bold text-gray-900">{metrics.scoreCrediticioPromedio}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Tasa Default Predicha</p>
                          <p className={`text-lg font-bold ${
                            metrics.tasaDefaultPredicted < 8 ? 'text-green-600' : 
                            metrics.tasaDefaultPredicted < 12 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {metrics.tasaDefaultPredicted.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Relación Deuda/Ingreso</p>
                          <p className="text-lg font-bold text-gray-900">{quality?.relacionDeuda.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Valor Cartera Total</p>
                          <p className="text-lg font-bold text-[#2E5BFF]">
                            ${(metrics.valorCarteraTotal / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Distribución de Riesgo */}
                    {quality && (
                      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Distribución de Riesgo</h4>
                        <div className="flex space-x-2">
                          <div className="flex-1 bg-red-100 rounded h-8 flex items-center justify-center text-red-800 font-semibold text-sm">
                            Alto: {quality.creditosAltoRiesgo}
                          </div>
                          <div className="flex-1 bg-yellow-100 rounded h-8 flex items-center justify-center text-yellow-800 font-semibold text-sm">
                            Medio: {quality.creditosMedioRiesgo}
                          </div>
                          <div className="flex-1 bg-green-100 rounded h-8 flex items-center justify-center text-green-800 font-semibold text-sm">
                            Bajo: {quality.creditosBajoRiesgo}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Registro de Actividad</h2>
                <p className="text-gray-600">Últimas acciones realizadas por los empleados</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {employeeLogs.map(log => (
                  <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                            {log.action.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-gray-900">{log.employeeName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString('es-AR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{log.details}</p>
                        <p className="text-xs text-gray-500">
                          Deal ID: <span className="font-mono">{log.dealId}</span> • Lead: <span className="font-mono">{log.leadId}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

