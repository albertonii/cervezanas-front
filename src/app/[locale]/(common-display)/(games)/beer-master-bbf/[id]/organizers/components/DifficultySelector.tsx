import React from 'react';
import { Star } from 'lucide-react';

interface DifficultySelectorProps {
    value: string;
    onChange: (value: 'fácil' | 'medio' | 'difícil') => void;
}

export default function DifficultySelector({
    value,
    onChange,
}: DifficultySelectorProps) {
    const difficulties = [
        { value: 'easy', label: 'fácil', color: 'text-green-500', points: 100 },
        {
            value: 'medium',
            label: 'medio',
            color: 'text-beer-blonde',
            points: 150,
        },
        { value: 'hard', label: 'difícil', color: 'text-red-500', points: 200 },
        {
            value: 'beer_master',
            label: 'Maestro Cervecero',
            color: 'text-blue-500',
            points: 300,
        },
    ];

    return (
        <div>
            <div className="flex space-x-2">
                {difficulties.map((difficulty) => (
                    <button
                        key={difficulty.value}
                        onClick={() =>
                            onChange(
                                difficulty.value as
                                    | 'fácil'
                                    | 'medio'
                                    | 'difícil',
                            )
                        }
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md border ${
                            value === difficulty.value
                                ? `bg-${
                                      difficulty.color.split('-')[1]
                                  }-50 border-${
                                      difficulty.color.split('-')[1]
                                  }-200`
                                : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <Star
                            className={`w-4 h-4 ${
                                value === difficulty.value
                                    ? difficulty.color
                                    : 'text-gray-400'
                            }`}
                        />
                        <span
                            className={
                                value === difficulty.value
                                    ? 'font-medium'
                                    : 'text-gray-600'
                            }
                        >
                            {difficulty.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {difficulties.map(
                    (difficulty) =>
                        value === difficulty.value && (
                            <p
                                key={difficulty.value}
                                className="text-lg font-semibold"
                            >
                                Puntos: {difficulty.points}
                            </p>
                        ),
                )}
            </div>
        </div>
    );
}
