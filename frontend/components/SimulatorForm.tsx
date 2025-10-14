'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FinancingOfferRequest, SimulacionResponse } from '@/lib/types';
import { financingApi, settingsApi } from '@/lib/api';
import { getMarcas, getModelos, getVersiones } from '@/lib/vehicleData';
import { Lead } from '@/lib/leads';
import { Plus, Trash2 } from 'lucide-react';

interface SimulatorFormProps {
  onSimulationComplete: (simulation: SimulacionResponse) => void;
  leadData?: Lead;
}

interface Titular {
  nombre: string;
  apellido: string;
  dni: string;
  ingresosAnuales: number;
}

export default function SimulatorForm({ onSimulationComplete, leadData }: SimulatorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [maxPercentage, setMaxPercentage] = useState(50);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [titulares, setTitulares] = useState<Titular[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinancingOfferRequest>();

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

  // Precargar datos del lead si están disponibles
  useEffect(() => {
    if (leadData) {
      // Precargar datos del cliente principal
      setValue('cliente.nombre', leadData.cliente.nombre);
      setValue('cliente.apellido', leadData.cliente.apellido);
      setValue('cliente.dni', leadData.cliente.dni);
      setValue('cliente.ingresosAnuales', leadData.cliente.ingresosAnuales);
      
      // Precargar datos del vehículo
      setValue('vehiculo.marca', leadData.vehiculo.marca);
      setSelectedMarca(leadData.vehiculo.marca);
      setValue('vehiculo.modelo', leadData.vehiculo.modelo);
      setSelectedModelo(leadData.vehiculo.modelo);
      setValue('vehiculo.version', leadData.vehiculo.version);
      setValue('vehiculo.anio', leadData.vehiculo.anio);
      setValue('vehiculo.kilometros', leadData.vehiculo.kilometros);
      setValue('vehiculo.precio', leadData.vehiculo.precio);
      setValue('vehiculo.sku', leadData.vehiculo.sku);
      
      // Precargar datos adicionales
      setValue('dealId', leadData.dealId);
      setValue('subsidiary', leadData.subsidiary);
      setValue('country', leadData.countryCode);
    }
  }, [leadData, setValue]);

  const onSubmit = async (data: FinancingOfferRequest) => {
    try {
      setIsLoading(true);
      setError('');
      
      const simulation = await financingApi.createSimulation(data);
      onSimulationComplete(simulation);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al generar simulación');
    } finally {
      setIsLoading(false);
    }
  };

  const marcas = getMarcas();
  const modelos = selectedMarca ? getModelos(selectedMarca) : [];
  const versiones = selectedMarca && selectedModelo ? getVersiones(selectedMarca, selectedModelo) : [];

  // Observar el precio y porcentaje para calcular monto a financiar
  const precioVehiculo = watch('vehiculo.precio') || 0;
  const porcentajeFinanciar = watch('porcentajeFinanciar') || 0;
  const montoAFinanciar = (precioVehiculo * porcentajeFinanciar) / 100;

  const addTitular = () => {
    setTitulares([...titulares, { nombre: '', apellido: '', dni: '', ingresosAnuales: 0 }]);
  };

  const removeTitular = (index: number) => {
    setTitulares(titulares.filter((_, i) => i !== index));
  };

  const updateTitular = (index: number, field: keyof Titular, value: string | number) => {
    const newTitulares = [...titulares];
    newTitulares[index] = { ...newTitulares[index], [field]: value };
    setTitulares(newTitulares);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección Cliente Principal */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Titular Principal</h3>
            <span className="text-sm text-gray-500">(Datos del lead)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                {...register('cliente.nombre', { required: 'Nombre es requerido' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nombre"
              />
              {errors.cliente?.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente.nombre.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                {...register('cliente.apellido', { required: 'Apellido es requerido' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Apellido"
              />
              {errors.cliente?.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente.apellido.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">DNI</label>
              <input
                {...register('cliente.dni', { required: 'DNI es requerido' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="DNI"
              />
              {errors.cliente?.dni && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente.dni.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ingresos Anuales</label>
              <input
                {...register('cliente.ingresosAnuales', { 
                  required: 'Ingresos anuales es requerido',
                  min: { value: 0, message: 'Los ingresos deben ser positivos' }
                })}
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ingresos anuales"
              />
              {errors.cliente?.ingresosAnuales && (
                <p className="mt-1 text-sm text-red-600">{errors.cliente.ingresosAnuales.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Titulares Adicionales */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Titulares Adicionales</h3>
            <button
              type="button"
              onClick={addTitular}
              className="flex items-center px-3 py-2 bg-[#2E5BFF] text-white rounded-lg hover:bg-[#00D4AA] transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Titular
            </button>
          </div>

          {titulares.length === 0 && (
            <p className="text-sm text-gray-500 italic">No hay titulares adicionales. Haz click en "Agregar Titular" para añadir uno.</p>
          )}

          {titulares.map((titular, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Titular #{index + 2}</h4>
                <button
                  type="button"
                  onClick={() => removeTitular(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={titular.nombre}
                    onChange={(e) => updateTitular(index, 'nombre', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2E5BFF] focus:border-[#2E5BFF] sm:text-sm"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    type="text"
                    value={titular.apellido}
                    onChange={(e) => updateTitular(index, 'apellido', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2E5BFF] focus:border-[#2E5BFF] sm:text-sm"
                    placeholder="Apellido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DNI</label>
                  <input
                    type="text"
                    value={titular.dni}
                    onChange={(e) => updateTitular(index, 'dni', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2E5BFF] focus:border-[#2E5BFF] sm:text-sm"
                    placeholder="DNI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ingresos Anuales</label>
                  <input
                    type="number"
                    value={titular.ingresosAnuales || ''}
                    onChange={(e) => updateTitular(index, 'ingresosAnuales', parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2E5BFF] focus:border-[#2E5BFF] sm:text-sm"
                    placeholder="Ingresos anuales"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección Vehículo */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Datos del Vehículo</h3>
            <span className="text-sm text-gray-500">(Datos del lead)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Marca</label>
              <select
                {...register('vehiculo.marca', { required: 'Marca es requerida' })}
                value={selectedMarca}
                onChange={(e) => {
                  setSelectedMarca(e.target.value);
                  setSelectedModelo('');
                  setValue('vehiculo.marca', e.target.value);
                  setValue('vehiculo.modelo', '');
                  setValue('vehiculo.version', '');
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar marca</option>
                {marcas.map((marca) => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
              {errors.vehiculo?.marca && (
                <p className="mt-1 text-sm text-red-600">{errors.vehiculo.marca.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <select
                {...register('vehiculo.modelo', { required: 'Modelo es requerido' })}
                value={selectedModelo}
                onChange={(e) => {
                  setSelectedModelo(e.target.value);
                  setValue('vehiculo.modelo', e.target.value);
                  setValue('vehiculo.version', '');
                }}
                disabled={!selectedMarca}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="">Seleccionar modelo</option>
                {modelos.map((modelo) => (
                  <option key={modelo} value={modelo}>{modelo}</option>
                ))}
              </select>
              {errors.vehiculo?.modelo && (
                <p className="mt-1 text-sm text-red-600">{errors.vehiculo.modelo.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Versión</label>
              <select
                {...register('vehiculo.version', { required: 'Versión es requerida' })}
                disabled={!selectedModelo}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="">Seleccionar versión</option>
                {versiones.map((version) => (
                  <option key={version} value={version}>{version}</option>
                ))}
              </select>
              {errors.vehiculo?.version && (
                <p className="mt-1 text-sm text-red-600">{errors.vehiculo.version.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Año</label>
              <input
                {...register('vehiculo.anio', { 
                  required: 'Año es requerido',
                  min: { value: 1990, message: 'Año debe ser 1990 o posterior' },
                  max: { value: 2025, message: 'Año no puede ser futuro' }
                })}
                type="number"
                min="1990"
                max="2025"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Año"
              />
              {errors.vehiculo?.anio && (
                <p className="mt-1 text-sm text-red-600">{errors.vehiculo.anio.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                {...register('vehiculo.sku', { required: 'SKU es requerido' })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="SKU del vehículo"
              />
              {errors.vehiculo?.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.vehiculo.sku.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección Financiamiento */}
        <div className="pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financiamiento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Porcentaje a financiar */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje a financiar: <span className="text-[#2E5BFF] font-bold">{porcentajeFinanciar}%</span>
              </label>
              <input
                {...register('porcentajeFinanciar', { 
                  required: 'Porcentaje es requerido',
                  min: { value: 1, message: 'Mínimo 1%' },
                  max: { value: maxPercentage, message: `Máximo ${maxPercentage}%` }
                })}
                type="range"
                min="1"
                max={maxPercentage}
                step="1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2E5BFF]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1%</span>
                <span>{maxPercentage}%</span>
              </div>
              {errors.porcentajeFinanciar && (
                <p className="mt-1 text-sm text-red-600">{errors.porcentajeFinanciar.message}</p>
              )}
            </div>

            {/* Monto a Financiar (calculado) */}
            <div className="bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] rounded-lg p-4 text-white">
              <p className="text-sm font-medium mb-1">Monto a Financiar</p>
              <p className="text-2xl font-bold">
                {leadData && new Intl.NumberFormat(leadData.countryCode === 'AR' ? 'es-AR' : 'es-CL', {
                  style: 'currency',
                  currency: leadData.countryCode === 'AR' ? 'ARS' : 'CLP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(montoAFinanciar)}
              </p>
              <p className="text-xs mt-1 text-white/80">
                {porcentajeFinanciar}% de {leadData && new Intl.NumberFormat(leadData.countryCode === 'AR' ? 'es-AR' : 'es-CL', {
                  style: 'currency',
                  currency: leadData.countryCode === 'AR' ? 'ARS' : 'CLP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(precioVehiculo)}
              </p>
            </div>

            {/* Cuotas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Cuotas
              </label>
              <select
                {...register('cuotas', { 
                  required: 'Cantidad de cuotas es requerida'
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2E5BFF] focus:border-[#2E5BFF] sm:text-sm"
              >
                <option value="">Seleccionar cuotas</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
                <option value="48">48 meses</option>
                <option value="60">60 meses</option>
                <option value="72">72 meses</option>
              </select>
              {errors.cuotas && (
                <p className="mt-1 text-sm text-red-600">{errors.cuotas.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Generando simulación...' : 'Generar Simulación'}
          </button>
        </div>
      </form>
    </div>
  );
}






