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
        circle: 'bg-red-500 border-red-400 text-white',
        line: 'bg-white/30',
        label: 'text-red-300 font-semibold'
      };
    }

    if (isCompleted) {
      return {
        circle: 'bg-white border-white text-green-600',
        line: 'bg-white/50',
        label: 'text-white font-medium'
      };
    }

    if (isActive) {
      return {
        circle: 'bg-white border-white text-[#2E5BFF] ring-4 ring-white/30',
        line: 'bg-white/30',
        label: 'text-white font-bold'
      };
    }

    if (isPending) {
      return {
        circle: 'bg-white/10 border-white/40 text-white/60',
        line: 'bg-white/20',
        label: 'text-white/70'
      };
    }

    return {
      circle: 'bg-white/20 border-white/50 text-white/70',
      line: 'bg-white/30',
      label: 'text-white/80'
    };
  };

  const getIcon = (status: TramiteStatus) => {
    if (status === TramiteStatus.COMPLETADO) {
      return <Check className="w-4 h-4" />;
    }
    if (status === TramiteStatus.RECHAZADO) {
      return <XCircle className="w-4 h-4" />;
    }
    return <Circle className="w-4 h-4" />;
  };

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
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
                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ${styles.circle}
                  `}
                >
                  {getIcon(step.status)}
                </div>
                <span className={`mt-1.5 text-sm ${styles.label}`}>
                  {step.label}
                </span>
                <span className="text-xs text-white/60 mt-0.5">
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

