import RewardBadge from './RewardBadge';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IStep } from '@/lib/types/beerMasterGame';
import { X, MapPin, Beer, Lock, CheckCircle } from 'lucide-react';

interface StepDetailsProps {
    step: IStep;
    onClose: () => void;
    onStartQuiz: () => void;
}

export default function StepDetails({
    step,
    onClose,
    onStartQuiz,
}: StepDetailsProps) {
    const t = useTranslations();

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('bm_game.step')} {step.id}: {step.title}
                    </h2>
                    <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{step.location}</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <Label>{step.description}</Label>
                </div>

                {step.isUnlocked && !step.isCompleted && (
                    <div
                        className={`rounded-lg p-6 ${
                            step.isQRScanned
                                ? 'bg-amber-50 border-2 border-amber-200 animate-pulse'
                                : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-amber-800">
                                {t('bm_game.actual_step')}
                            </h3>
                            {step.isQRScanned ? (
                                <Beer className="w-6 h-6 text-amber-500" />
                            ) : (
                                <Lock className="w-6 h-6 text-gray-400" />
                            )}
                        </div>

                        {step.isQRScanned ? (
                            <div className="space-y-4">
                                <Label>
                                    {t('bm_game.ready_to_start_quiz')}
                                </Label>

                                <Button onClick={onStartQuiz} primary medium>
                                    <span>{t('bm_game.start_quiz')}</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="text-gray-600">
                                <Label size="small">
                                    {t('bm_game.scan_qr_to_unlock', {
                                        qr: step.location,
                                    })}
                                </Label>
                            </div>
                        )}
                    </div>
                )}

                {step.isCompleted && (
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title color="beer-blonde" size="large">
                                    {t('bm_game.step_completed')}
                                </Title>
                                <p className="text-sm text-green-700">
                                    Respuestas correctas: {step.correctAnswers}/
                                    {step.questions.length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                )}

                {step.reward && (
                    <RewardBadge
                        reward={step.reward}
                        correctAnswers={step.correctAnswers}
                        totalQuestions={step.questions.length}
                    />
                )}
            </div>
        </div>
    );
}
