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
  const [selectedForShare, setSelectedForShare] = useState<{
    escenario: SimulacionEscenario;
    cuotas: number;
    valorCuota: number;
    tna: number;
    tea: number;
  } | null>(null);

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

  const handleShare = (
    escenario: SimulacionEscenario,
    cuotas: number,
    valorCuota: number,
    tna: number,
    tea: number
  ) => {
    setSelectedForShare({ escenario, cuotas, valorCuota, tna, tea });
    setShowShareModal(true);
  };

  const handlePrint = () => {
    if (!selectedForShare) return;
    
    // Generar contenido para imprimir
    const printContent = generatePrintContent(selectedForShare);
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSendEmail = () => {
    // TODO: Integrar con API de envío de email
    alert('Funcionalidad de envío por email - Por implementar\n\nSe enviará la cotización con:\n- Datos del vehículo\n- Escenario seleccionado\n- Tabla de amortización completa\n- Disclaimer sobre UVA');
  };

  const generatePrintContent = (data: {
    escenario: SimulacionEscenario;
    cuotas: number;
    valorCuota: number;
    tna: number;
    tea: number;
  }) => {
    const schedule = generatePaymentSchedule(
      data.escenario.montoFinanciar,
      data.cuotas,
      data.valorCuota,
      data.tna
    );

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cotización de Financiamiento - KAVAK CRÉDITO</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            color: #333;
            font-size: 12px;
          }
          .header {
            background: linear-gradient(135deg, #2E5BFF 0%, #00D4AA 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .vehicle-info {
            background: #f8f9fa;
            border: 2px solid #2E5BFF;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .vehicle-info h2 {
            color: #2E5BFF;
            font-size: 18px;
            margin-bottom: 15px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          .info-item {
            padding: 10px;
            background: white;
            border-radius: 5px;
          }
          .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }
          .scenario-info {
            background: #e3f2fd;
            border-left: 4px solid #2E5BFF;
            padding: 20px;
            margin-bottom: 20px;
          }
          .scenario-info h3 {
            color: #2E5BFF;
            font-size: 16px;
            margin-bottom: 15px;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 10px;
          }
          .summary-item {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 5px;
          }
          .summary-label {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #2E5BFF;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          th {
            background: #2E5BFF;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #e0e0e0;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .disclaimer {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
          .disclaimer h4 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .disclaimer p {
            color: #856404;
            font-size: 11px;
            line-height: 1.6;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
            font-size: 10px;
          }
          @media print {
            body { padding: 20px; }
            .header { break-inside: avoid; }
            .vehicle-info { break-inside: avoid; }
            .scenario-info { break-inside: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KAVAK CRÉDITO</h1>
          <p>Cotización de Financiamiento Vehicular</p>
          <p style="margin-top: 10px; font-size: 12px;">Fecha: ${new Date().toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>

        ${vehicleInfo ? `
        <div class="vehicle-info">
          <h2>🚗 Información del Vehículo</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Vehículo</div>
              <div class="info-value">${vehicleInfo}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Precio del Vehículo</div>
              <div class="info-value">${formatCurrency(data.escenario.montoFinanciar / (data.escenario.porcentaje / 100))}</div>
            </div>
            <div class="info-item">
              <div class="info-label">% a Financiar</div>
              <div class="info-value">${data.escenario.porcentaje}%</div>
            </div>
          </div>
        </div>
        ` : ''}

        ${clientName ? `
        <div class="vehicle-info">
          <h2>👤 Cliente</h2>
          <div class="info-item">
            <div class="info-value">${clientName}</div>
          </div>
        </div>
        ` : ''}

        <div class="scenario-info">
          <h3>📊 Resumen de Financiamiento</h3>
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Monto a Financiar</div>
              <div class="summary-value">${formatCurrency(data.escenario.montoFinanciar)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Plazo</div>
              <div class="summary-value">${data.cuotas} meses</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Cuota Mensual</div>
              <div class="summary-value">${formatCurrency(data.valorCuota)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">TNA / TEA</div>
              <div class="summary-value">${data.tna.toFixed(2)}% / ${data.tea.toFixed(2)}%</div>
            </div>
          </div>
        </div>

        <h3 style="color: #2E5BFF; margin-bottom: 15px; font-size: 16px;">📅 Cronograma de Pagos Estimado</h3>
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th style="text-align: right;">Cuota</th>
              <th style="text-align: right;">Capital</th>
              <th style="text-align: right;">Interés</th>
              <th style="text-align: right;">Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${schedule.map(pago => `
              <tr>
                <td>${pago.mes}</td>
                <td style="text-align: right; font-weight: bold;">${formatCurrency(pago.cuota)}</td>
                <td style="text-align: right; color: #00D4AA;">${formatCurrency(pago.capital)}</td>
                <td style="text-align: right; color: #ff9800;">${formatCurrency(pago.interes)}</td>
                <td style="text-align: right;">${formatCurrency(pago.saldo)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="disclaimer">
          <h4>⚠️ Información Importante</h4>
          <p>
            <strong>Los valores presentados en esta cotización son estimados y de carácter informativo.</strong><br><br>
            
            • El valor de la cuota mensual puede variar según el valor de la <strong>UVA (Unidad de Valor Adquisitivo)</strong> al momento del pago.<br>
            • La TNA (Tasa Nominal Anual) y TEA (Tasa Efectiva Anual) son referenciales.<br>
            • Los montos finales estarán sujetos a análisis crediticio y aprobación.<br>
            • Esta cotización tiene una validez de 7 días corridos desde su emisión.<br>
            • Para información actualizada y confirmación de valores, consulte con su asesor de KAVAK CRÉDITO.<br><br>
            
            <strong>Sistema de Actualización UVA:</strong> Las cuotas se ajustan mensualmente según la variación del índice UVA publicado por el Banco Central.
          </p>
        </div>

        <div class="footer">
          <p><strong>KAVAK CRÉDITO</strong> | Financiamiento Vehicular</p>
          <p>Documento generado automáticamente | No válido como contrato</p>
        </div>
      </body>
      </html>
    `;
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

      {/* Escenarios en Grid Responsive (igual que en formulario) */}
      <div className={`grid gap-6 ${
        resultados.length === 1 ? 'grid-cols-1' :
        resultados.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {resultados.map((escenario, escIdx) => {
          return (
            <div
              key={escenario.escenarioId}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-[#2E5BFF] transition-all animate-scaleIn"
              style={{
                animationDelay: `${escIdx * 100}ms`
              }}
            >
              {/* Header del Escenario - Compacto */}
              <div className="bg-gradient-to-br from-[#2E5BFF] to-[#00D4AA] p-4 text-white">
                <div>
                  <h4 className="text-xl font-bold">Escenario {escIdx + 1}</h4>
                  <p className="text-sm text-white/90">
                    Financiando el {escenario.porcentaje}% • {formatCurrency(escenario.montoFinanciar)}
                  </p>
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

                        {/* Botones: Elegir + Compartir */}
                        <div className="flex items-center gap-2">
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
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 min-w-[100px] justify-center ${
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
                          
                          {/* Botón Compartir (por cuota) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(escenario, opcion.cuotas, opcion.valorCuota, opcion.tna, opcion.tea);
                            }}
                            className="p-2 text-gray-400 hover:text-[#2E5BFF] hover:bg-blue-50 rounded-lg transition-all"
                            title="Compartir esta cotización"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
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
