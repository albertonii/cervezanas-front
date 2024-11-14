import React from 'react';
import { useTranslations } from 'next-intl';
import { IStep } from '@/lib/types/beerMasterGame';
import { Trophy, Star, Target, Award } from 'lucide-react';

interface GameStatsProps {
    steps: IStep[];
}

export default function GameStats({ steps }: GameStatsProps) {
    const t = useTranslations('bm_game');
    const totalSteps = steps.length;
    const completedSteps = steps.filter((step) => step.is_completed).length;
    const totalQuestions = steps.reduce(
        (acc, step) =>
            step.bm_steps_questions
                ? acc + step.bm_steps_questions?.length
                : acc,
        0,
    );
    const totalCorrectAnswers = steps.reduce(
        (acc, step) => acc + step.correct_answers,
        0,
    );
    const accuracy =
        totalQuestions > 0
            ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
            : 0;
    const availableRewards = steps.filter(
        (step) =>
            step.bm_steps_rewards &&
            step.bm_steps_rewards.length > 0 &&
            !step.bm_steps_rewards[0].claimed,
    ).length;
    const earnedRewards = steps.filter(
        (step) =>
            step.bm_steps_rewards &&
            step.bm_steps_rewards.length > 0 &&
            step.bm_steps_rewards[0].claimed,
    ).length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('your_progress')}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-beer-softFoam rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-6 h-6 text-amber-600" />
                        <span className="text-2xl font-bold text-amber-600">
                            {completedSteps}/{totalSteps}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        {t('completed_steps')}
                    </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Star className="w-6 h-6 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                            {totalCorrectAnswers}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        {t('correct_answers')}
                    </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                            {accuracy}%
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{t('accuracy')}</p>
                </div>

                <div className="bg-beer-softFoam rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Award className="w-6 h-6 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-600">
                            {earnedRewards}/{availableRewards + earnedRewards}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{t('rewards')}</p>
                </div>
            </div>
        </div>
    );
}
