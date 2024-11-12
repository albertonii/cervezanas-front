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
import { gameSteps } from '../data/gameSteps';
import { achievements } from '../data/achievements';
import { IAchievement, IStep } from '@/lib/types/beerMasterGame';

const Main = () => {
    const [steps, setSteps] = useState(gameSteps);
    const [activeStep, setActiveStep] = useState<IStep | null>(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [unlockedAchievement, setUnlockedAchievement] =
        useState<IAchievement | null>(null);
    const [selectedStep, setSelectedStep] = useState<IStep | null>(steps[0]);
    const progress = steps.filter((step) => step.isCompleted).length;

    useEffect(() => {
        const checkAchievements = () => {
            const completedSteps = steps.filter((step) => step.isCompleted);

            if (completedSteps.length === 1) {
                const firstStepAchievement = achievements.find(
                    (a) => a.id === 'first-step',
                );
                if (
                    firstStepAchievement &&
                    firstStepAchievement.progress === 0
                ) {
                    setUnlockedAchievement({
                        ...firstStepAchievement,
                        unlockedAt: new Date(),
                    });
                }
            }

            const perfectStep = completedSteps.find(
                (step) => step.correctAnswers === step.questions.length,
            );
            if (perfectStep) {
                const perfectScoreAchievement = achievements.find(
                    (a) => a.id === 'perfect-score',
                );
                if (
                    perfectScoreAchievement &&
                    perfectScoreAchievement.progress === 0
                ) {
                    setUnlockedAchievement({
                        ...perfectScoreAchievement,
                        unlockedAt: new Date(),
                    });
                }
            }
        };

        checkAchievements();
    }, [steps]);

    const handleStepSelect = (stepId: number) => {
        const step = steps.find((s) => s.id === stepId);
        if (step) {
            setSelectedStep(step);
        }
    };

    const handleStartQuiz = (step: IStep) => {
        if (step.isUnlocked && step.isQRScanned && !step.isCompleted) {
            setActiveStep({ ...step, lastVisited: new Date() });
            setShowQuestion(true);
            setSelectedStep(null);
        }
    };

    const handleScan = () => {
        const currentStep = steps.find(
            (step) => step.isUnlocked && !step.isQRScanned && !step.isCompleted,
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

        const startTime = activeStep.lastVisited?.getTime() || Date.now();
        const timeSpent = Date.now() - startTime;

        setSteps(
            steps.map((step) => {
                if (step.id === activeStep.id) {
                    const newCorrectAnswers = isCorrect
                        ? step.correctAnswers + 1
                        : step.correctAnswers;
                    const newQuestionIndex = step.currentQuestionIndex + 1;
                    const isStepCompleted =
                        newQuestionIndex >= step.questions.length;

                    return {
                        ...step,
                        currentQuestionIndex: newQuestionIndex,
                        correctAnswers: newCorrectAnswers,
                        isCompleted: isStepCompleted,
                        timeSpent: (step.timeSpent || 0) + timeSpent,
                        reward:
                            step.reward &&
                            isStepCompleted &&
                            newCorrectAnswers >=
                                step.reward.condition.correctAnswers
                                ? { ...step.reward, claimed: true }
                                : step.reward,
                    };
                }
                if (
                    step.id === activeStep.id + 1 &&
                    activeStep.currentQuestionIndex + 1 >=
                        activeStep.questions.length
                ) {
                    return { ...step, isUnlocked: true };
                }
                return step;
            }),
        );

        const updatedStep = steps.find((s) => s.id === activeStep.id);
        if (
            updatedStep &&
            updatedStep.currentQuestionIndex + 1 < updatedStep.questions.length
        ) {
            setActiveStep({
                ...updatedStep,
                currentQuestionIndex: updatedStep.currentQuestionIndex + 1,
                lastVisited: new Date(),
            });
        } else {
            setShowQuestion(false);
            setActiveStep(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-beer-blonde to-beer-softBlonde text-white py-6 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <Beer className="w-10 h-10" />
                            <h1 className="text-3xl font-bold">
                                Maestro Cervecero
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

            {showQuestion && activeStep && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <QuestionModal
                        question={
                            activeStep.questions[
                                activeStep.currentQuestionIndex
                            ]
                        }
                        onAnswer={handleAnswer}
                        onClose={() => {
                            setShowQuestion(false);
                            setActiveStep(null);
                        }}
                        totalQuestions={activeStep.questions.length}
                        currentQuestionIndex={activeStep.currentQuestionIndex}
                        correctAnswers={activeStep.correctAnswers}
                        isLastQuestion={
                            activeStep.currentQuestionIndex ===
                            activeStep.questions.length - 1
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
