import React from 'react';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DifficultyBadgeProps {
    difficulty: string;
    points: number;
}

export default function DifficultyBadge({
    difficulty,
    points,
}: DifficultyBadgeProps) {
    const t = useTranslations('bm_game');
    const colors: { [key: string]: string } = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-amber-100 text-amber-800',
        hard: 'bg-red-100 text-red-800',
    };

    return (
        <div
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${colors[difficulty]}`}
        >
            <span>{difficulty}</span>
            <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>
                    {points} {t('points')}
                </span>
            </div>
        </div>
    );
}
