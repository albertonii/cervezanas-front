'use client';

import QRScanner from '../QRScanner';
import GameStats from '../GameStats';
import JourneyMap from '../JourneyMap';
import ProgressBar from '../ProgressBar';
import StepDetails from '../StepDetails';
import Leaderboard from '../Leaderboard';
import QuestionModal from '../QuestionModal';
import AchievementToast from '../AchievementToast';
import useFetchBMGameStepParticipationsByUserId from '@/hooks/useFetchBMGameStepParticipationsByUserId';
import React, { useState, useEffect } from 'react';
import { Beer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from 'react-query';
import { handleBMGameQRCodeScanned } from '../../actions';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { convertToDate, formatDateTypeDefaultInput } from '@/utils/formatDate';

import {
    IAchievement,
    IBMGameStepsRegistered,
    IGameState,
    IStep,
} from '@/lib/types/beerMasterGame';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    gameState: IGameState;
}

const Main = ({ gameState }: Props) => {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations('bm_game');

    const {
        data: userParticipationInGameSteps,
        error,
        isLoading,
        refetch,
        isFetchedAfterMount,
    } = useFetchBMGameStepParticipationsByUserId(user.id, gameState.id);

    const queryClient = useQueryClient();

    const [userStepsParticipations, setUserStepsParticipations] = useState<
        IBMGameStepsRegistered[]
    >([]);

    const achievements = gameState.bm_steps_achievements || [];
    const [steps, setSteps] = useState(gameState.bm_steps || []);
    const [activeStep, setActiveStep] = useState<IStep | null>(
        gameState.bm_steps
            ? gameState.bm_steps.reduce(
                  (prev, curr) =>
                      prev.step_number < curr.step_number ? prev : curr,
                  gameState.bm_steps[0],
              )
            : null,
    );
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [unlockedAchievement, setUnlockedAchievement] =
        useState<IAchievement | null>(null);
    const [selectedStep, setSelectedStep] = useState<IStep | null>(
        gameState.bm_steps
            ? gameState.bm_steps.reduce(
                  (prev, curr) =>
                      prev.step_number < curr.step_number ? prev : curr,
                  gameState.bm_steps[0],
              )
            : null,
    );

    const progress = steps.filter((step) => step.is_completed).length;

    useEffect(() => {
        if (isFetchedAfterMount) {
            setUserStepsParticipations(userParticipationInGameSteps || []);
        }
    }, [isFetchedAfterMount, userParticipationInGameSteps]);

    useEffect(() => {
        const checkAchievements = () => {
            const completedSteps = steps.filter((step) => step.is_completed);

            if (completedSteps.length === 1) {
                const firstStepAchievement = achievements.find(
                    (a) => a.id === 'first-step',
                );
                if (
                    firstStepAchievement &&
                    firstStepAchievement.progress === 0
                ) {
                    const unLockedAt = formatDateTypeDefaultInput(new Date());

                    setUnlockedAchievement({
                        ...firstStepAchievement,
                        unlocked_at: unLockedAt,
                    });
                }
            }

            const perfectStep = completedSteps.find(
                (step) =>
                    step.correct_answers === step.bm_steps_questions?.length,
            );
            if (perfectStep) {
                const perfectScoreAchievement = achievements.find(
                    (a) => a.id === 'perfect-score',
                );
                if (
                    perfectScoreAchievement &&
                    perfectScoreAchievement.progress === 0
                ) {
                    const unLockedAt = formatDateTypeDefaultInput(new Date());

                    setUnlockedAchievement({
                        ...perfectScoreAchievement,
                        unlocked_at: unLockedAt,
                    });
                }
            }
        };

        checkAchievements();
    }, [steps]);

    const handleStepSelect = (stepId: string) => {
        const step = steps.find((s) => s.id === stepId);
        if (step) {
            setSelectedStep({
                ...step,
                is_unlocked: step.is_unlocked ?? false,
                is_completed: step.is_completed ?? false,
                is_qr_scanned: step.is_qr_scanned ?? false,
                current_question_index: step.current_question_index ?? 0,
                correct_answers: step.correct_answers ?? 0,
                time_spent: step.time_spent ?? 0,
                last_visited: step.last_visited ?? '',
            });
        }
    };

    const handleStartQuiz = (step: IBMGameStepsRegistered) => {
        if (step.is_unlocked && step.is_qr_scanned && !step.is_completed) {
            // const lastVisited = formatDateTypeDefaultInput(new Date());

            // setActiveStep({ ...step, last_visited: lastVisited });
            setShowQuestion(true);
            setSelectedStep(null);
        }
    };

    const handleScan = async (scannedId: string) => {
        const res = await handleBMGameQRCodeScanned(scannedId, user.id);

        if (res.status !== 200) {
            console.error('Error scanning QR code', res.message);
            return;
        }

        queryClient.invalidateQueries('bm_steps_participations');

        // NO lo estamos usando (?) - ¿borrar?
        const currentStep = steps.find(
            (step) =>
                step.is_unlocked && step.id === scannedId && step.is_qr_scanned,
        );

        if (currentStep) {
            setSteps(
                steps.map((step) =>
                    step.id === currentStep.id
                        ? { ...step, is_qr_scanned: true }
                        : step,
                ),
            );
            setSelectedStep(currentStep);
        }
    };

    const handleAnswer = (isCorrect: boolean) => {
        // 1. Chequea si hay step activo
        if (!activeStep) return;

        // 2. Cálculo de tiempos
        const lastVisited = convertToDate(activeStep.last_visited);
        const startTime = lastVisited.getTime() || Date.now();
        const timeSpent = Date.now() - startTime;

        // 4. Generar un nuevo array `newSteps` con los cambios
        const newSteps = steps.map((step) => {
            if (step.id === activeStep.id) {
                const newQuestionIndex = step.current_question_index + 1;
                const isStepCompleted =
                    step.bm_steps_questions &&
                    newQuestionIndex >= step.bm_steps_questions?.length;

                // si la respuesta es correcta => le sumo +1 al step
                const stepCorrectAnswers = isCorrect
                    ? step.correct_answers + 1
                    : step.correct_answers;

                return {
                    ...step,
                    current_question_index: newQuestionIndex,
                    correct_answers: stepCorrectAnswers,
                    is_completed: isStepCompleted || false,
                    time_spent: (step.time_spent || 0) + timeSpent,
                    reward:
                        step.bm_steps_rewards &&
                        isStepCompleted &&
                        stepCorrectAnswers >=
                            step.bm_steps_rewards[0].correct_answers
                            ? { ...step.bm_steps_rewards, claimed: true }
                            : step.bm_steps_rewards,
                };
            }

            // Desbloquea el siguiente step si acaba el actual
            if (
                step.id === activeStep.id + 1 &&
                activeStep.bm_steps_questions &&
                activeStep.current_question_index + 1 >=
                    activeStep.bm_steps_questions.length
            ) {
                return { ...step, isUnlocked: true };
            }

            return step;
        });

        // 5. Actualiza el estado `steps` con el nuevo array
        setSteps(newSteps);

        // 6. Busca el step recién modificado en `newSteps`
        const updatedStep = steps.find((s) => s.id === activeStep.id);

        // 7. Revisa si quedan más preguntas en el step
        if (
            updatedStep &&
            updatedStep.bm_steps_questions &&
            updatedStep.current_question_index + 1 <
                updatedStep.bm_steps_questions.length
        ) {
            const lastVisited = formatDateTypeDefaultInput(new Date());

            setActiveStep({
                ...updatedStep,
                current_question_index: updatedStep.current_question_index + 1,
                last_visited: lastVisited,
            });
        } else {
            setShowQuestion(false);
            setActiveStep(null);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <header className="bg-gradient-to-r from-beer-blonde to-beer-softBlonde text-white py-6 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <Beer className="w-10 h-10" />
                            <h1 className="text-3xl font-bold">
                                {t('beer_master')}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold">
                                {gameState.title}
                            </p>
                            <p className="text-sm opacity-75">
                                {gameState.location}
                            </p>
                        </div>
                    </div>
                    <ProgressBar
                        progress={progress}
                        totalSteps={steps.length}
                    />

                    <Label>{gameState.description}</Label>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <GameStats steps={steps} />

                <div className="space-y-8">
                    <JourneyMap
                        steps={steps}
                        onStepSelect={handleStepSelect}
                        activeStepId={
                            activeStep?.id ?? selectedStep?.id ?? null
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            {selectedStep && (
                                <StepDetails
                                    userStepsParticipations={
                                        userStepsParticipations
                                    }
                                    step={selectedStep}
                                    onClose={() => setSelectedStep(null)}
                                    onStartQuiz={handleStartQuiz}
                                />
                            )}
                        </div>

                        <div>
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </main>

            <QRScanner onScan={handleScan} />

            {showQuestion && activeStep && activeStep.bm_steps_questions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <QuestionModal
                        question={
                            activeStep.bm_steps_questions[
                                activeStep.current_question_index
                            ]
                        }
                        onAnswer={handleAnswer}
                        onClose={() => {
                            setShowQuestion(false);
                            setActiveStep(null);
                        }}
                        totalQuestions={activeStep.bm_steps_questions.length}
                        currentQuestionIndex={activeStep.current_question_index}
                        isLastQuestion={
                            activeStep.current_question_index ===
                            activeStep.bm_steps_questions.length - 1
                        }
                        correctAnswers={activeStep.correct_answers}
                    />
                </div>
            )}

            {unlockedAchievement && (
                <AchievementToast
                    achievement={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)}
                />
            )}
        </div>
    );
};

export default Main;
