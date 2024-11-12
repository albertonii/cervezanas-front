import React from 'react';
import RewardBadge from './RewardBadge';
import { IStep } from '@/lib/types/beerMasterGame';
import { Lock, CheckCircle, ArrowRight, QrCode } from 'lucide-react';

interface StepCardProps {
    step: IStep;
    onSelect: (stepId: number) => void;
    isActive: boolean;
}

export default function StepCard({ step, onSelect, isActive }: StepCardProps) {
    const getStepStatus = () => {
        if (!step.isUnlocked) return <Lock className="w-6 h-6 text-gray-400" />;
        if (step.isCompleted)
            return <CheckCircle className="w-6 h-6 text-green-500" />;
        if (!step.isQRScanned)
            return <QrCode className="w-6 h-6 text-amber-500" />;
        return <ArrowRight className="w-6 h-6 text-amber-500" />;
    };

    return (
        <div
            className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ${
                step.isUnlocked
                    ? 'bg-white cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-100 opacity-75'
            } ${isActive ? 'ring-2 ring-amber-500' : ''}`}
            onClick={() => step.isUnlocked && onSelect(step.id)}
        >
            <div className="absolute top-4 right-4">{getStepStatus()}</div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
                Paso {step.id}: {step.title}
            </h3>

            <p className="text-gray-600 mb-4">{step.description}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span>{step.location}</span>
                </div>
                {step.isQRScanned && !step.isCompleted && (
                    <span className="text-sm text-amber-600">
                        {step.currentQuestionIndex + 1}/{step.questions.length}{' '}
                        preguntas
                    </span>
                )}
            </div>

            {step.reward && (
                <RewardBadge
                    reward={step.reward}
                    correctAnswers={step.correctAnswers}
                    totalQuestions={step.questions.length}
                />
            )}
        </div>
    );
}
