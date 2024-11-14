import React from 'react';
import { Gift } from 'lucide-react';
import { IReward } from '@/lib/types/beerMasterGame';

interface RewardBadgeProps {
    reward: IReward;
    correctAnswers: number;
    totalQuestions: number;
}

export default function RewardBadge({
    reward,
    correctAnswers,
    totalQuestions,
}: RewardBadgeProps) {
    if (!reward) return null;
    const isEarned = correctAnswers >= reward.correct_answers;

    return (
        <div
            className={`mt-4 p-4 rounded-lg ${
                reward.claimed
                    ? 'bg-green-50 border-2 border-green-200'
                    : isEarned
                    ? 'bg-amber-50 border-2 border-amber-200 animate-pulse'
                    : 'bg-gray-50 border-2 border-gray-200'
            }`}
        >
            <div className="flex items-center space-x-3">
                <Gift
                    className={`w-6 h-6 ${
                        reward.claimed
                            ? 'text-green-500'
                            : isEarned
                            ? 'text-amber-500'
                            : 'text-gray-400'
                    }`}
                />
                <div>
                    <h4 className="font-semibold text-gray-900">
                        {reward.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {reward.description}
                    </p>
                    {!reward.claimed && (
                        <p className="text-xs mt-1">
                            {isEarned
                                ? `¡Conseguido! Recógelo en: ${reward.claim_location}`
                                : `Necesitas ${reward.correct_answers}/${reward.total_questions} respuestas correctas`}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
