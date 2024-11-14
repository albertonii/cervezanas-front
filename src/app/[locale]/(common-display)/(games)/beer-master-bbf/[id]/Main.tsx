'use client';

import QRScanner from '../QRScanner';
import GameStats from '../GameStats';
import JourneyMap from '../JourneyMap';
import ProgressBar from '../ProgressBar';
import Leaderboard from '../Leaderboard';
import QuestionModal from '../QuestionModal';
import AchievementToast from '../AchievementToast';
import StepDetails from '../StepDetails';
import React, { useState, useEffect } from 'react';
import { Beer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IAchievement, IGameState, IStep } from '@/lib/types/beerMasterGame';
import { convertToDate, formatDateTypeDefaultInput } from '@/utils/formatDate';

interface Props {
    gameState: IGameState;
}

const Main = ({ gameState }: Props) => {
    const t = useTranslations('bm_game');

    console.log(gameState);

    const achievements = gameState.bm_steps_achievements || [];
    const [steps, setSteps] = useState(gameState.bm_steps || []);
    const [activeStep, setActiveStep] = useState<IStep | null>(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [unlockedAchievement, setUnlockedAchievement] =
        useState<IAchievement | null>(null);
    const [selectedStep, setSelectedStep] = useState<IStep | null>(
        gameState.bm_steps![0] || null,
    );
    const progress = steps.filter((step) => step.is_completed).length;

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

    const handleStartQuiz = (step: IStep) => {
        if (step.is_unlocked && step.is_qr_scanned && !step.is_completed) {
            const lastVisited = formatDateTypeDefaultInput(new Date());

            setActiveStep({ ...step, last_visited: lastVisited });
            setShowQuestion(true);
            setSelectedStep(null);
        }
    };

    const handleScan = () => {
        const currentStep = steps.find(
            (step) =>
                step.is_unlocked && !step.is_qr_scanned && !step.is_completed,
        );

        if (currentStep) {
            setSteps(
                steps.map((step) =>
                    step.id === currentStep.id
                        ? { ...step, isQRScanned: true }
                        : step,
                ),
            );
            setSelectedStep(currentStep);
        }
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (!activeStep) return;

        const lastVisited = convertToDate(activeStep.last_visited);
        const startTime = lastVisited.getTime() || Date.now();
        const timeSpent = Date.now() - startTime;

        setSteps(
            steps.map((step) => {
                if (step.id === activeStep.id) {
                    const newCorrectAnswers = isCorrect
                        ? step.correct_answers + 1
                        : step.correct_answers;
                    const newQuestionIndex = step.current_question_index + 1;
                    const isStepCompleted =
                        step.bm_steps_questions &&
                        newQuestionIndex >= step.bm_steps_questions?.length;

                    return {
                        ...step,
                        currentQuestionIndex: newQuestionIndex,
                        correctAnswers: newCorrectAnswers,
                        isCompleted: isStepCompleted,
                        timeSpent: (step.time_spent || 0) + timeSpent,
                        reward:
                            step.bm_steps_rewards &&
                            isStepCompleted &&
                            newCorrectAnswers >=
                                step.bm_steps_rewards[0].correct_answers
                                ? { ...step.bm_steps_rewards, claimed: true }
                                : step.bm_steps_rewards,
                    };
                }
                if (
                    step.id === activeStep.id + 1 &&
                    activeStep.bm_steps_questions &&
                    activeStep.current_question_index + 1 >=
                        activeStep.bm_steps_questions.length
                ) {
                    return { ...step, isUnlocked: true };
                }
                return step;
            }),
        );

        const updatedStep = steps.find((s) => s.id === activeStep.id);
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
                            <p className="text-xl font-semibold">BBF 2025</p>
                            <p className="text-sm opacity-75">
                                Barcelona Beer Festival
                            </p>
                        </div>
                    </div>
                    <ProgressBar
                        progress={progress}
                        totalSteps={steps.length}
                    />
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
                                    step={selectedStep}
                                    onClose={() => setSelectedStep(null)}
                                    onStartQuiz={() =>
                                        handleStartQuiz(selectedStep)
                                    }
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
                        correctAnswers={activeStep.correct_answers}
                        isLastQuestion={
                            activeStep.current_question_index ===
                            activeStep.bm_steps_questions.length - 1
                        }
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
