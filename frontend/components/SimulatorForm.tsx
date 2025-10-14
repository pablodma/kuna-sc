'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FinancingOfferRequest, SimulationScenario, SimulacionResponse, SelectedSimulation, Comment, Cliente } from '@/lib/types';
import { settingsApi } from '@/lib/api';
import { Lead } from '@/lib/leads';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import CommentThread from './CommentThread';
import SimulationResults from './SimulationResults';

interface SimulatorFormProps {
  leadData?: Lead;
  onSimulationComplete: (selection: SelectedSimulation) => void;
}

export default function SimulatorForm({ leadData, onSimulationComplete }: SimulatorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [maxPercentage, setMaxPercentage] = useState(50);
  const [titulares, setTitulares] = useState<Cliente[]>([]);
  const [escenarios, setEscenarios] = useState<SimulationScenario[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulacionResponse | null>(null);
  const [selectedSimulation, setSelectedSimulation] = useState<SelectedSimulation | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuthStore();

  interface FormData {
    cliente: {
      nombre: string;
      apellido: string;
      dni: string;
      ingresosAnuales: number;
    };
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  // Cargar configuración del sistema
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsApi.getSettings();
        setMaxPercentage(settings.porcentajeMaximo);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Precargar datos del lead
  useEffect(() => {
    if (leadData) {
      setValue('cliente.nombre', leadData.cliente.nombre);
      setValue('cliente.apellido', leadData.cliente.apellido);
      setValue('cliente.dni', leadData.cliente.dni);
      setValue('cliente.ingresosAnuales', leadData.cliente.ingresosAnuales);

      // Inicializar con un escenario por defecto
      if (escenarios.length === 0) {
        setEscenarios([{
          id: '1',
          nombre: 'Escenario 1',
          porcentajeFinanciar: 20,
          montoAFinanciar: leadData.vehiculo.precio ? (leadData.vehiculo.precio * 20) / 100 : 0
        }]);
      }
    }
  }, [leadData, setValue]);

  const formatCurrency = (amount: number) => {
    if (!leadData) return amount;
    return new Intl.NumberFormat(leadData.countryCode === 'AR' ? 'es-AR' : 'es-CL', {
      style: 'currency',
      currency: leadData.countryCode === 'AR' ? 'ARS' : 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Titulares
  const addTitular = () => {
    setTitulares([...titulares, { nombre: '', apellido: '', dni: '', ingresosAnuales: 0 }]);
  };

  const removeTitular = (index: number) => {
    setTitulares(titulares.filter((_, i) => i !== index));
  };

  const updateTitular = (index: number, field: keyof Cliente, value: string | number) => {
    const newTitulares = [...titulares];
    newTitulares[index] = { ...newTitulares[index], [field]: value };
    setTitulares(newTitulares);
  };

  // Escenarios
  const addEscenario = () => {
    if (escenarios.length >= 3) {
      alert('Máximo 3 escenarios permitidos');
      return;
    }
    const newId = (escenarios.length + 1).toString();
    setEscenarios([
      ...escenarios,
      {
        id: newId,
        nombre: `Escenario ${newId}`,
        porcentajeFinanciar: 20,
        montoAFinanciar: leadData?.vehiculo.precio ? (leadData.vehiculo.precio * 20) / 100 : 0
      }
    ]);
  };

  const removeEscenario = (id: string) => {
    setEscenarios(escenarios.filter(e => e.id !== id));
  };

  const updateEscenario = (id: string, porcentaje: number) => {
    setEscenarios(escenarios.map(e =>
      e.id === id
        ? {
            ...e,
            porcentajeFinanciar: porcentaje,
            montoAFinanciar: leadData?.vehiculo.precio
              ? (leadData.vehiculo.precio * porcentaje) / 100
              : 0
          }
        : e
    ));
  };

  // Comentarios
  const handleAddComment = (texto: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user?.username || 'unknown',
      userName: user?.username || 'Usuario',
      userRole: user?.role || 'USER',
      texto,
      timestamp: new Date(),
      parentId,
      respuestas: []
    };

    if (parentId) {
      // Agregar respuesta anidada
      const addReplyToComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              respuestas: [...(comment.respuestas || []), newComment]
            };
          }
          if (comment.respuestas && comment.respuestas.length > 0) {
            return {
              ...comment,
              respuestas: addReplyToComment(comment.respuestas)
            };
          }
          return comment;
        });
      };
      setComments(addReplyToComment(comments));
    } else {
      setComments([...comments, newComment]);
    }
  };

  // Simular (mock por ahora)
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');

      if (escenarios.length === 0) {
        setError('Debes agregar al menos un escenario');
        return;
      }

      // Mock de respuesta del backend
      // TODO: Reemplazar con llamada real al API
      const mockResponse: SimulacionResponse = {
        resultados: escenarios.map(escenario => ({
          escenarioId: escenario.id,
          porcentaje: escenario.porcentajeFinanciar,
          montoFinanciar: escenario.montoAFinanciar || 0,
          opciones: [
            {
              cuotas: 6,
              valorCuota: (escenario.montoAFinanciar || 0) / 6 * 1.15,
              tna: 45,
              tea: 55
            },
            {
              cuotas: 12,
              valorCuota: (escenario.montoAFinanciar || 0) / 12 * 1.20,
              tna: 45,
              tea: 55
            },
            {
              cuotas: 18,
              valorCuota: (escenario.montoAFinanciar || 0) / 18 * 1.25,
              tna: 47,
              tea: 57
            },
            {
              cuotas: 24,
              valorCuota: (escenario.montoAFinanciar || 0) / 24 * 1.30,
              tna: 48,
              tea: 59
            },
            {
              cuotas: 30,
              valorCuota: (escenario.montoAFinanciar || 0) / 30 * 1.35,
              tna: 50,
              tea: 62
            },
            {
              cuotas: 36,
              valorCuota: (escenario.montoAFinanciar || 0) / 36 * 1.40,
              tna: 52,
              tea: 65
            }
          ]
        }))
      };

      setSimulationResults(mockResponse);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al generar simulación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSimulation = (selection: SelectedSimulation) => {
    setSelectedSimulation(selection);
  };

  const handleContinue = () => {
    if (selectedSimulation) {
      onSimulationComplete(selectedSimulation);
    }
  };

  if (!leadData) {
    return <div>Cargando datos del lead...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Titulares (Principal + Adicionales en una sola card) */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Titulares del Crédito</h3>
              <p className="text-xs text-gray-500 mt-1">Al menos un titular es requerido</p>
            </div>
            <button
              type="button"
              onClick={addTitular}
              disabled={simulationResults !== null || titulares.length >= 5}
              className="flex items-center px-3 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Titular {titulares.length > 0 && `(${titulares.length}/5)`}
            </button>
          </div>

          {/* Titular Principal */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900">Titular Principal</h4>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Principal</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  {...register('cliente.nombre', { required: 'Nombre es requerido' })}
                  type="text"
                  disabled={simulationResults !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.cliente?.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente.nombre.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  {...register('cliente.apellido', { required: 'Apellido es requerido' })}
                  type="text"
                  disabled={simulationResults !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.cliente?.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente.apellido.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input
                  {...register('cliente.dni', { required: 'DNI es requerido' })}
                  type="text"
                  disabled={simulationResults !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.cliente?.dni && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente.dni.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Anuales</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    {leadData.countryCode === 'AR' ? '$' : '$'}
                  </span>
                  <input
                    {...register('cliente.ingresosAnuales', {
                      required: 'Ingresos anuales es requerido',
                      min: { value: 0, message: 'Los ingresos deben ser positivos' }
                    })}
                    type="number"
                    disabled={simulationResults !== null}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </div>
                {errors.cliente?.ingresosAnuales && (
                  <p className="mt-1 text-sm text-red-600">{errors.cliente.ingresosAnuales.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Titulares Adicionales - Layout Lateral */}
          {titulares.length === 0 && (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">
                ¿Se necesita más de un titular? Haz click en "Agregar Titular" arriba (máximo 5)
              </p>
            </div>
          )}

          {titulares.length > 0 && (
            <div className={`grid gap-4 ${
              titulares.length === 1 ? 'grid-cols-1' :
              titulares.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              titulares.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              titulares.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
            }`}>
              {titulares.map((titular, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 animate-scaleIn"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Titular #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTitular(index)}
                      disabled={simulationResults !== null}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={titular.nombre}
                        onChange={(e) => updateTitular(index, 'nombre', e.target.value)}
                        disabled={simulationResults !== null}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        value={titular.apellido}
                        onChange={(e) => updateTitular(index, 'apellido', e.target.value)}
                        disabled={simulationResults !== null}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">DNI</label>
                      <input
                        type="text"
                        value={titular.dni}
                        onChange={(e) => updateTitular(index, 'dni', e.target.value)}
                        disabled={simulationResults !== null}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ingresos Anuales</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">$</span>
                        <input
                          type="number"
                          value={titular.ingresosAnuales || ''}
                          onChange={(e) => updateTitular(index, 'ingresosAnuales', parseFloat(e.target.value) || 0)}
                          disabled={simulationResults !== null}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E5BFF] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Escenarios de Simulación */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-[#2E5BFF] mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Escenarios de Simulación</h3>
            </div>
            <button
              type="button"
              onClick={addEscenario}
              disabled={escenarios.length >= 3 || simulationResults !== null}
              className="flex items-center px-3 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Escenario ({escenarios.length}/3)
            </button>
          </div>

          {escenarios.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Agrega al menos un escenario para simular.
            </p>
          )}

          {/* Grid Responsive: 1 col → 2 cols → 3 cols */}
          <div className={`grid gap-4 ${
            escenarios.length === 1 ? 'grid-cols-1' :
            escenarios.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {escenarios.map((escenario, index) => (
              <div 
                key={escenario.id} 
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 animate-scaleIn"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-900">Escenario {index + 1}</h4>
                  {escenarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEscenario(escenario.id)}
                      disabled={simulationResults !== null}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje a financiar:{' '}
                      <span className="text-[#2E5BFF] font-bold">
                        {escenario.porcentajeFinanciar}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max={maxPercentage}
                      step="1"
                      value={escenario.porcentajeFinanciar}
                      onChange={(e) => updateEscenario(escenario.id, parseInt(e.target.value))}
                      disabled={simulationResults !== null}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E5BFF] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1%</span>
                      <span>{maxPercentage}%</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] rounded-lg p-3 text-white">
                    <p className="text-xs font-medium mb-1">Monto a Financiar</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(escenario.montoAFinanciar || 0)}
                    </p>
                    <p className="text-xs mt-1 text-white/80">
                      {escenario.porcentajeFinanciar}% de {formatCurrency(leadData.vehiculo.precio || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Simular */}
        {!simulationResults && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || escenarios.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generando...' : 'Generar Simulación'}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
      </form>

      {/* Resultados de Simulación */}
      {simulationResults && (
        <>
          <SimulationResults
            resultados={simulationResults.resultados}
            onSelectSimulation={handleSelectSimulation}
            countryCode={leadData.countryCode}
          />

          {selectedSimulation && (
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">¿Aceptar esta oferta?</h4>
                  <p className="text-gray-600">
                    Al aceptar, el trámite pasará a la etapa de <span className="font-semibold">Handoff</span>
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Simulación seleccionada:</span>{' '}
                      {selectedSimulation.cuotas} cuotas de {formatCurrency(selectedSimulation.valorCuota)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleContinue}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  ✓ Aceptar Oferta
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sistema de Comentarios */}
      <CommentThread comments={comments} onAddComment={handleAddComment} />
    </div>
  );
}
