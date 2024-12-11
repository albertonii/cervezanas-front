import React, { useEffect } from 'react';
import { IAchievement } from '@/lib/types/beerMasterGame';

interface AchievementToastProps {
    achievement: IAchievement;
    onClose: () => void;
}

export default function AchievementToast({
    achievement,
    onClose,
}: AchievementToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-20 right-6 animate-slide-up">
            <div className="bg-amber-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div>
                    <h4 className="font-bold">{achievement.name}</h4>
                    <p className="text-sm opacity-90">
                        {achievement.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
