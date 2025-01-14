import RewardBadge from './RewardBadge';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { X, MapPin, Beer, Lock, CheckCircle } from 'lucide-react';
import { IBMGameStepsRegistered, IStep } from '@/lib/types/beerMasterGame';

interface StepDetailsProps {
    step: IStep;
    onClose: () => void;
    onStartQuiz: (userStepParticipation: IBMGameStepsRegistered) => void;
    userStepsParticipations: IBMGameStepsRegistered[];
}

export default function StepDetails({
    step,
    onClose,
    onStartQuiz,
    userStepsParticipations,
}: StepDetailsProps) {
    const t = useTranslations('bm_game');

    // Buscar step en userStepsParticipations
    const userStepParticipation = userStepsParticipations.find(
        (usp) => usp.step_id === step.id,
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <Title size="large" font="bold" color="gray">
                        {t('step')} {step.step_number}: {step.title}
                    </Title>
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

                {userStepParticipation?.is_unlocked &&
                    !userStepParticipation.is_completed && (
                        <div
                            className={`rounded-lg p-6 ${
                                userStepParticipation.is_qr_scanned
                                    ? 'bg-amber-50 border-2 border-amber-200 '
                                    : 'bg-gray-50 border-2 border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-amber-800">
                                    {t('actual_step')}
                                </h3>
                                {userStepParticipation.is_qr_scanned ? (
                                    <Beer className="w-6 h-6 text-amber-500" />
                                ) : (
                                    <Lock className="w-6 h-6 text-gray-400" />
                                )}
                            </div>

                            {userStepParticipation.is_qr_scanned ? (
                                <div className="space-y-4">
                                    <Label>{t('ready_to_start_quiz')}</Label>

                                    <Button
                                        onClick={() =>
                                            onStartQuiz(userStepParticipation)
                                        }
                                        primary
                                        medium
                                    >
                                        <span>{t('start_quiz')}</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    <Label size="small">
                                        {t('scan_qr_to_unlock', {
                                            qr: step.location,
                                        })}
                                    </Label>
                                </div>
                            )}
                        </div>
                    )}

                {userStepParticipation?.is_completed && (
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Title color="beer-blonde" size="large">
                                    {t('step_completed')}
                                </Title>
                                <p className="text-sm text-green-700">
                                    {t('correct_answers')}:{' '}
                                    {step.correct_answers}/
                                    {step.bm_steps_questions?.length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                )}

                {step.bm_steps_rewards && step.bm_steps_rewards[0] && (
                    <RewardBadge
                        reward={step.bm_steps_rewards[0]}
                        correctAnswers={step.correct_answers}
                        totalQuestions={step.bm_steps_questions?.length || 0}
                    />
                )}
            </div>
        </div>
    );
}
