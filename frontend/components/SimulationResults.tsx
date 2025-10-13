'use client';

import { useState } from 'react';
import { SimulacionResponse } from '@/lib/types';

interface SimulationResultsProps {
  simulation: SimulacionResponse;
}

export default function SimulationResults({ simulation }: SimulationResultsProps) {
  const [selectedPlazo, setSelectedPlazo] = useState(36); // Default 36 meses
  const [showDetails, setShowDetails] = useState(false);

  const selectedSimulation = simulation.simulaciones.find(s => s.meses === selectedPlazo);
  const plazos = simulation.simulaciones.map(s => s.meses);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  if (!selectedSimulation) {
    return <div>Error: No se encontró la simulación seleccionada</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultados de la Simulación</h2>
      
      {/* Resumen de montos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Monto Total del Vehículo</h3>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(simulation.montoTotal)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Monto a Financiar</h3>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(simulation.montoFinanciado)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Cuota Mensual</h3>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(selectedSimulation.cuotaMensual)}</p>
        </div>
      </div>

      {/* Slider de plazos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar plazo: {selectedPlazo} meses
        </label>
        <div className="relative">
          <input
            type="range"
            min={Math.min(...plazos)}
            max={Math.max(...plazos)}
            step="6"
            value={selectedPlazo}
            onChange={(e) => setSelectedPlazo(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.min(...plazos)} meses</span>
            <span>{Math.max(...plazos)} meses</span>
          </div>
        </div>
      </div>

      {/* Card principal con información destacada */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Cuota Mensual</h3>
          <p className="text-4xl font-bold mb-2">{formatCurrency(selectedSimulation.cuotaMensual)}</p>
          <p className="text-indigo-100">Para {selectedPlazo} meses</p>
        </div>
        
        {/* Primera cuota destacada */}
        <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
          <p className="text-sm font-medium">Primera cuota: {formatCurrency(selectedSimulation.cuotaMensual * 1.1)}</p>
          <p className="text-xs text-indigo-100">Incluye gastos administrativos</p>
        </div>
      </div>

      {/* Botón para ver más detalles */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {showDetails ? 'Ocultar detalles' : 'Ver más detalles'}
        </button>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Detalles Financieros</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700">TNA (Tasa Nominal Anual)</h5>
              <p className="text-2xl font-bold text-red-600">{formatPercentage(selectedSimulation.tna)}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700">TAE (Tasa Anual Efectiva)</h5>
              <p className="text-2xl font-bold text-orange-600">{formatPercentage(selectedSimulation.tae)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-medium text-gray-700 mb-2">Total a pagar</h5>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(selectedSimulation.cuotaMensual * selectedPlazo)}
            </p>
            <p className="text-sm text-gray-600">
              {selectedPlazo} cuotas de {formatCurrency(selectedSimulation.cuotaMensual)}
            </p>
          </div>
        </div>
      )}

      {/* Tabla de todas las opciones */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Todas las opciones disponibles</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuota Mensual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TNA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TAE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {simulation.simulaciones.map((sim) => (
                <tr 
                  key={sim.meses} 
                  className={sim.meses === selectedPlazo ? 'bg-indigo-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sim.meses} meses
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sim.cuotaMensual)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPercentage(sim.tna)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPercentage(sim.tae)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sim.cuotaMensual * sim.meses)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}






