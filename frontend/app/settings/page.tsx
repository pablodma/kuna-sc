'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { settingsApi } from '@/lib/api';
import { AjustesSistema, SettingsRequest } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AjustesSistema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsRequest>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    loadSettings();
  }, [isAuthenticated, user, router]);

  const loadSettings = async () => {
    try {
      const currentSettings = await settingsApi.getSettings();
      setSettings(currentSettings);
      setValue('porcentajeMaximo', currentSettings.porcentajeMaximo);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Error al cargar la configuración');
    }
  };

  const onSubmit = async (data: SettingsRequest) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      const updatedSettings = await settingsApi.updateSettings(data);
      setSettings(updatedSettings);
      setSuccess('Configuración actualizada exitosamente');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
              <p className="text-gray-600">Panel de administración</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Configuración de Financiamiento
            </h2>

            {/* Información actual */}
            {settings && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Configuración Actual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Porcentaje máximo:</span>
                    <span className="ml-2 text-blue-900">{settings.porcentajeMaximo}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Última actualización:</span>
                    <span className="ml-2 text-blue-900">
                      {new Date(settings.timestamp).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Actualizado por:</span>
                    <span className="ml-2 text-blue-900">{settings.actualizadoPor}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de actualización */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje Máximo de Financiamiento
                </label>
                <div className="relative">
                  <input
                    {...register('porcentajeMaximo', {
                      required: 'El porcentaje máximo es requerido',
                      min: { value: 1, message: 'El porcentaje debe ser al menos 1%' },
                      max: { value: 100, message: 'El porcentaje no puede exceder 100%' }
                    })}
                    type="number"
                    min="1"
                    max="100"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-8"
                    placeholder="Ingrese el porcentaje máximo"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors.porcentajeMaximo && (
                  <p className="mt-1 text-sm text-red-600">{errors.porcentajeMaximo.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Este valor determina el porcentaje máximo que los usuarios pueden seleccionar para financiar un vehículo.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Configuración'}
                </button>
              </div>
            </form>

            {/* Información adicional */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Importante</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Cambios en la configuración
                    </h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Los cambios se aplicarán inmediatamente a todas las nuevas simulaciones</li>
                        <li>Las simulaciones existentes no se verán afectadas</li>
                        <li>Se recomienda notificar a los usuarios sobre cambios significativos</li>
                        <li>Todos los cambios quedan registrados con timestamp y usuario</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






