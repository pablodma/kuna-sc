'use client';

import { useState } from 'react';
import { SimulacionEscenario, SelectedSimulation } from '@/lib/types';
import { CheckCircle, TrendingUp } from 'lucide-react';

interface SimulationResultsProps {
  resultados: SimulacionEscenario[];
  onSelectSimulation: (selection: SelectedSimulation) => void;
  countryCode: string;
}

export default function SimulationResults({
  resultados,
  onSelectSimulation,
  countryCode
}: SimulationResultsProps) {
  const [selectedOption, setSelectedOption] = useState<{
    escenarioId: string;
    cuotas: number;
  } | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(countryCode === 'AR' ? 'es-AR' : 'es-CL', {
      style: 'currency',
      currency: countryCode === 'AR' ? 'ARS' : 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectOption = (
    escenarioId: string,
    porcentaje: number,
    montoFinanciar: number,
    cuotas: number,
    valorCuota: number,
    tna: number,
    tea: number
  ) => {
    setSelectedOption({ escenarioId, cuotas });
    onSelectSimulation({
      escenarioId,
      porcentaje,
      montoFinanciar,
      cuotas,
      valorCuota,
      tna,
      tea
    });
  };

  const isSelected = (escenarioId: string, cuotas: number) => {
    return (
      selectedOption?.escenarioId === escenarioId &&
      selectedOption?.cuotas === cuotas
    );
  };

  return (
    <div className="space-y-6 animate-scaleIn">
      <div className="flex items-center mb-4">
        <TrendingUp className="w-6 h-6 text-[#2E5BFF] mr-2" />
        <h3 className="text-xl font-bold text-gray-900">
          Resultados de Simulación
        </h3>
      </div>

      {resultados.map((escenario, escIdx) => (
        <div
          key={escenario.escenarioId}
          className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200"
        >
          {/* Header del Escenario */}
          <div className="bg-gradient-to-r from-[#2E5BFF] to-[#00D4AA] p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">Escenario {escIdx + 1}</h4>
                <p className="text-sm text-white/90">
                  Financiando el {escenario.porcentaje}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90">Monto a Financiar</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(escenario.montoFinanciar)}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de Opciones */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuotas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Cuota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TNA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TEA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {escenario.opciones.map((opcion) => {
                  const selected = isSelected(escenario.escenarioId, opcion.cuotas);
                  return (
                    <tr
                      key={opcion.cuotas}
                      className={`hover:bg-gray-50 transition-colors ${
                        selected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {opcion.cuotas} meses
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(opcion.valorCuota)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {opcion.tna.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {opcion.tea.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleSelectOption(
                              escenario.escenarioId,
                              escenario.porcentaje,
                              escenario.montoFinanciar,
                              opcion.cuotas,
                              opcion.valorCuota,
                              opcion.tna,
                              opcion.tea
                            )
                          }
                          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                            selected
                              ? 'bg-green-500 text-white'
                              : 'bg-[#2E5BFF] text-white hover:bg-[#00D4AA]'
                          }`}
                        >
                          {selected ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Seleccionada
                            </>
                          ) : (
                            'Elegir'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {selectedOption && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
          <p className="text-green-800 font-semibold">
            ✓ Has seleccionado una opción. Puedes continuar al siguiente paso.
          </p>
        </div>
      )}
    </div>
  );
}
