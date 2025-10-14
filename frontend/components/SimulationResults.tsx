'use client';

import { useState } from 'react';
import { SimulacionEscenario, SelectedSimulation } from '@/lib/types';
import { CheckCircle, TrendingUp, ChevronDown, ChevronUp, Mail, Printer, Share2 } from 'lucide-react';

interface SimulationResultsProps {
  resultados: SimulacionEscenario[];
  onSelectSimulation: (selection: SelectedSimulation) => void;
  countryCode: string;
  clientName?: string;
  vehicleInfo?: string;
}

export default function SimulationResults({
  resultados,
  onSelectSimulation,
  countryCode,
  clientName = 'Cliente',
  vehicleInfo = 'Vehículo'
}: SimulationResultsProps) {
  const [selectedOption, setSelectedOption] = useState<{
    escenarioId: string;
    cuotas: number;
  } | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<{
    [key: string]: number | null; // escenarioId -> cuotas expandidas
  }>({});
  const [showShareModal, setShowShareModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(countryCode === 'AR' ? 'es-AR' : 'es-CL', {
      style: 'currency',
      currency: countryCode === 'AR' ? 'ARS' : 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Generar cronograma de pagos mensual (simulado)
  const generatePaymentSchedule = (
    montoFinanciar: number,
    cuotas: number,
    valorCuota: number,
    tna: number
  ) => {
    const schedule = [];
    let saldoPendiente = montoFinanciar;
    const tasaMensual = tna / 100 / 12;

    for (let mes = 1; mes <= cuotas; mes++) {
      const interes = saldoPendiente * tasaMensual;
      const capital = valorCuota - interes;
      saldoPendiente -= capital;

      schedule.push({
        mes,
        cuota: valorCuota,
        capital,
        interes,
        saldo: Math.max(0, saldoPendiente)
      });
    }

    return schedule;
  };

  const toggleDetails = (escenarioId: string, cuotas: number) => {
    const key = `${escenarioId}-${cuotas}`;
    setExpandedDetails((prev) => ({
      ...prev,
      [key]: prev[key] === cuotas ? null : cuotas
    }));
  };

  const isDetailExpanded = (escenarioId: string, cuotas: number) => {
    const key = `${escenarioId}-${cuotas}`;
    return expandedDetails[key] === cuotas;
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

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    // TODO: Integrar con API de envío de email
    alert('Funcionalidad de envío por email - Por implementar');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="space-y-6 animate-scaleIn">
      {/* Header */}
      <div className="flex items-center mb-4">
        <TrendingUp className="w-6 h-6 text-[#2E5BFF] mr-2" />
        <h3 className="text-xl font-bold text-gray-900">
          Resultados de Simulación
        </h3>
      </div>

      {/* Escenarios en Layout Vertical */}
      <div className="space-y-6">
        {resultados.map((escenario, escIdx) => {
          const hasSelectedOption = escenario.opciones.some(op => 
            isSelected(escenario.escenarioId, op.cuotas)
          );

          return (
            <div
              key={escenario.escenarioId}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-[#2E5BFF] transition-all"
            >
              {/* Header del Escenario - Más Compacto */}
              <div className="bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold">Escenario {escIdx + 1}</h4>
                    <p className="text-sm text-white/90">
                      Financiando el {escenario.porcentaje}% • {formatCurrency(escenario.montoFinanciar)}
                    </p>
                  </div>
                  {/* Botón Compartir por Escenario */}
                  {hasSelectedOption && (
                    <button
                      onClick={() => {
                        // TODO: Compartir solo este escenario
                        handleShare();
                      }}
                      className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Compartir
                    </button>
                  )}
                </div>
              </div>

              {/* Opciones de Cuotas - Layout Compacto */}
              <div className="p-4 space-y-2">
              {escenario.opciones.map((opcion) => {
                const selected = isSelected(escenario.escenarioId, opcion.cuotas);
                const expanded = isDetailExpanded(escenario.escenarioId, opcion.cuotas);
                const schedule = generatePaymentSchedule(
                  escenario.montoFinanciar,
                  opcion.cuotas,
                  opcion.valorCuota,
                  opcion.tna
                );

                return (
                  <div
                    key={opcion.cuotas}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {/* Resumen Compacto en Una Sola Fila */}
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-4">
                        {/* Meses + Chevron */}
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <span className="text-base font-bold text-gray-900">
                            {opcion.cuotas} meses
                          </span>
                          <button
                            onClick={() => toggleDetails(escenario.escenarioId, opcion.cuotas)}
                            className="text-gray-400 hover:text-[#2E5BFF] transition-colors"
                          >
                            {expanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Cuota Mensual */}
                        <div className="flex-1 min-w-[140px]">
                          <p className="text-xs text-gray-500">Cuota mensual</p>
                          <p className="text-base font-bold text-[#2E5BFF]">
                            {formatCurrency(opcion.valorCuota)}
                          </p>
                        </div>

                        {/* TNA */}
                        <div className="min-w-[70px]">
                          <p className="text-xs text-gray-500">TNA</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {opcion.tna.toFixed(2)}%
                          </p>
                        </div>

                        {/* TEA */}
                        <div className="min-w-[70px]">
                          <p className="text-xs text-gray-500">TEA</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {opcion.tea.toFixed(2)}%
                          </p>
                        </div>

                        {/* Botón Elegir - Apagado por defecto */}
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
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 min-w-[120px] justify-center ${
                            selected
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-gray-200 text-gray-600 hover:bg-[#2E5BFF] hover:text-white hover:shadow-md'
                          }`}
                        >
                          {selected ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Elegida
                            </>
                          ) : (
                            'Elegir'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Detalle Mensual Expandible */}
                    {expanded && (
                      <div className="bg-gray-50 border-t-2 border-gray-200 max-h-64 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-100 sticky top-0">
                            <tr>
                              <th className="px-2 py-2 text-left font-medium text-gray-600">Mes</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-600">Cuota</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-600">Capital</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-600">Interés</th>
                              <th className="px-2 py-2 text-right font-medium text-gray-600">Saldo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.map((pago) => (
                              <tr key={pago.mes} className="border-b border-gray-200 hover:bg-white">
                                <td className="px-2 py-2 font-medium">{pago.mes}</td>
                                <td className="px-2 py-2 text-right">
                                  {formatCurrency(pago.cuota)}
                                </td>
                                <td className="px-2 py-2 text-right text-green-600">
                                  {formatCurrency(pago.capital)}
                                </td>
                                <td className="px-2 py-2 text-right text-orange-600">
                                  {formatCurrency(pago.interes)}
                                </td>
                                <td className="px-2 py-2 text-right font-semibold">
                                  {formatCurrency(pago.saldo)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedOption && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 animate-fadeIn">
          <p className="text-green-800 font-semibold flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Has seleccionado una opción. Puedes continuar al siguiente paso.
          </p>
        </div>
      )}

      {/* Modal de Compartir */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scaleIn">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Compartir Cotización</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleSendEmail();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                Enviar por Email
              </button>
              
              <button
                onClick={() => {
                  handlePrint();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir / Guardar PDF
              </button>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Al imprimir, usa "Guardar como PDF" en tu navegador para enviar el archivo al cliente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
