import React from 'react';
import { useTranslations } from 'next-intl';
import { IStep } from '@/lib/types/beerMasterGame';
import { Beer, Lock, CheckCircle } from 'lucide-react';

interface JourneyMapProps {
    steps: IStep[];
    onStepSelect: (stepId: string) => void;
    activeStepId: string | null;
}

export default function JourneyMap({
    steps,
    onStepSelect,
    activeStepId,
}: JourneyMapProps) {
    const t = useTranslations('bm_game');

    return (
        <div className="relative w-full bg-beer-softFoam rounded-xl p-8 shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 transform -rotate-12">
                    <Beer className="w-full h-full" />
                </div>
                <div className="absolute bottom-1/3 right-1/3 w-12 h-12 transform rotate-45">
                    <Beer className="w-full h-full" />
                </div>
            </div>

            <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-amber-200 transform -translate-y-1/2 bg-beer-foam" />

                <div className="relative flex justify-between items-center min-h-[150px]">
                    {steps
                        .sort((a, b) => a.step_number - b.step_number)
                        .map((step, index) => {
                            const isActive = step.id === activeStepId;
                            const isCompleted = step.is_completed;
                            const isLocked = !step.is_unlocked;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => onStepSelect(step.id)}
                                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isActive
                                            ? 'ring-4 ring-beer-blonde scale-110'
                                            : isCompleted
                                            ? 'bg-green-500'
                                            : isLocked
                                            ? 'bg-gray-300'
                                            : 'bg-beer-softBlonde hover:scale-105'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    ) : isLocked ? (
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    ) : (
                                        <Beer className="w-6 h-6 text-beer-gold" />
                                    )}

                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                        <span className="text-sm font-medium text-beer-draft">
                                            {`${t('step')} ${step.step_number}`}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
