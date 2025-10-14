'use client';

import { TramiteStage, TramiteStatus, STAGE_LABELS } from '@/lib/leads';
import { Check, Circle, XCircle } from 'lucide-react';

interface TramiteStepperProps {
  etapaActual: TramiteStage;
  estadoOferta: TramiteStatus;
  estadoHandoff: TramiteStatus;
  estadoDictamen: TramiteStatus;
  onStageClick?: (stage: TramiteStage) => void;
}

export default function TramiteStepper({
  etapaActual,
  estadoOferta,
  estadoHandoff,
  estadoDictamen,
  onStageClick
}: TramiteStepperProps) {
  const steps = [
    { stage: TramiteStage.OFERTA, label: STAGE_LABELS[TramiteStage.OFERTA], status: estadoOferta },
    { stage: TramiteStage.HANDOFF, label: STAGE_LABELS[TramiteStage.HANDOFF], status: estadoHandoff },
    { stage: TramiteStage.DICTAMEN, label: STAGE_LABELS[TramiteStage.DICTAMEN], status: estadoDictamen }
  ];

  const getStepStyle = (step: typeof steps[0], index: number) => {
    const isActive = step.stage === etapaActual;
    const isCompleted = step.status === TramiteStatus.COMPLETADO;
    const isRejected = step.status === TramiteStatus.RECHAZADO;
    const isPending = step.status === TramiteStatus.PENDIENTE;

    if (isRejected) {
      return {
        circle: 'bg-red-100 border-red-500 text-red-600',
        line: 'bg-red-200',
        label: 'text-red-600 font-semibold'
      };
    }

    if (isCompleted) {
      return {
        circle: 'bg-green-100 border-green-500 text-green-600',
        line: 'bg-green-300',
        label: 'text-green-600 font-medium'
      };
    }

    if (isActive) {
      return {
        circle: 'bg-blue-100 border-[#2E5BFF] text-[#2E5BFF] ring-4 ring-blue-100',
        line: 'bg-gray-200',
        label: 'text-[#2E5BFF] font-semibold'
      };
    }

    if (isPending) {
      return {
        circle: 'bg-gray-50 border-gray-300 text-gray-400',
        line: 'bg-gray-200',
        label: 'text-gray-500'
      };
    }

    return {
      circle: 'bg-gray-100 border-gray-400 text-gray-500',
      line: 'bg-gray-200',
      label: 'text-gray-600'
    };
  };

  const getIcon = (status: TramiteStatus) => {
    if (status === TramiteStatus.COMPLETADO) {
      return <Check className="w-5 h-5" />;
    }
    if (status === TramiteStatus.RECHAZADO) {
      return <XCircle className="w-5 h-5" />;
    }
    return <Circle className="w-5 h-5" />;
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const styles = getStepStyle(step, index);
          const showLine = index < steps.length - 1;

          return (
            <div key={step.stage} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => onStageClick?.(step.stage)}
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                disabled={!onStageClick}
              >
                <div
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ${styles.circle}
                  `}
                >
                  {getIcon(step.status)}
                </div>
                <span className={`mt-2 text-sm ${styles.label}`}>
                  {step.label}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {step.status === TramiteStatus.COMPLETADO && '✓ Completado'}
                  {step.status === TramiteStatus.EN_PROCESO && '⏳ En proceso'}
                  {step.status === TramiteStatus.PENDIENTE && '○ Pendiente'}
                  {step.status === TramiteStatus.RECHAZADO && '✕ Rechazado'}
                </span>
              </button>

              {/* Connecting Line */}
              {showLine && (
                <div className="flex-1 h-1 mx-4 relative">
                  <div className={`absolute inset-0 rounded ${styles.line}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

