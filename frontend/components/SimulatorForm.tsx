'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FinancingOfferRequest, SimulacionResponse } from '@/lib/types';
import { financingApi, settingsApi } from '@/lib/api';
import { getMarcas, getModelos, getVersiones, parseCRMVehicleData } from '@/lib/vehicleData';
import { CRMData } from '@/lib/types';

interface SimulatorFormProps {
  onSimulationComplete: (simulation: SimulacionResponse) => void;
  crmData?: CRMData;
}

export default function SimulatorForm({ onSimulationComplete, crmData }: SimulatorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [maxPercentage, setMaxPercentage] = useState(50);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');

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

  // Precargar datos del CRM si están disponibles
  useEffect(() => {
    if (crmData) {
      const vehicleInfo = parseCRMVehicleData(crmData);
      const fiscalData = crmData.message.request_payload.fiscal_data;
      
      // Precargar datos del cliente
      const fullName = fiscalData.full_name.split(' ');
      setValue('cliente.nombre', fullName[0] || '');
      setValue('cliente.apellido', fullName.slice(1).join(' ') || '');
      setValue('cliente.dni', fiscalData.document_number);
      
      // Precargar datos del vehículo
      if (vehicleInfo.marca) {
        setValue('vehiculo.marca', vehicleInfo.marca);
        setSelectedMarca(vehicleInfo.marca);
      }
      if (vehicleInfo.modelo) {
        setValue('vehiculo.modelo', vehicleInfo.modelo);
        setSelectedModelo(vehicleInfo.modelo);
      }
      if (vehicleInfo.version) {
        setValue('vehiculo.version', vehicleInfo.version);
      }
      if (vehicleInfo.sku) {
        setValue('vehiculo.sku', vehicleInfo.sku);
      }
      
      // Precargar datos adicionales
      setValue('dealId', vehicleInfo.dealId);
      setValue('subsidiary', crmData.message.request_payload.subsidiary);
      setValue('country', crmData.message.request_payload.country);
    }
  }, [crmData, setValue]);

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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Simular Orden de Venta</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección Cliente */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Cliente</h3>
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

        {/* Sección Vehículo */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Vehículo</h3>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porcentaje a financiar: {watch('porcentajeFinanciar') || 0}%
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1%</span>
              <span>{maxPercentage}%</span>
            </div>
            {errors.porcentajeFinanciar && (
              <p className="mt-1 text-sm text-red-600">{errors.porcentajeFinanciar.message}</p>
            )}
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






