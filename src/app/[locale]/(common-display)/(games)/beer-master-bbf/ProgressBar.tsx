import React from 'react';

interface ProgressBarProps {
    progress: number;
    totalSteps: number;
}

export default function ProgressBar({
    progress,
    totalSteps,
}: ProgressBarProps) {
    const percentage = (progress / totalSteps) * 100;

    return (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}
