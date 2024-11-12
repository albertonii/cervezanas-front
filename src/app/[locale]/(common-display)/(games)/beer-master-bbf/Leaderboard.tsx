import React from 'react';
import { Crown, Medal } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LeaderboardEntry {
    name: string;
    points: number;
    position: number;
    achievements: number;
}

export default function Leaderboard() {
    const t = useTranslations('bm_game');

    const topPlayers: LeaderboardEntry[] = [
        { name: 'MariaC', points: 2500, position: 1, achievements: 8 },
        { name: 'JordiB', points: 2300, position: 2, achievements: 7 },
        { name: 'AnnaM', points: 2100, position: 3, achievements: 6 },
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {t('top_bm_players')}
                </h2>
                <Crown className="w-6 h-6 text-amber-500" />
            </div>

            <div className="space-y-4">
                {topPlayers.map((player) => (
                    <div
                        key={player.position}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <span
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                    player.position === 1
                                        ? 'bg-amber-500'
                                        : player.position === 2
                                        ? 'bg-gray-400'
                                        : 'bg-amber-700'
                                } text-white font-bold`}
                            >
                                {player.position}
                            </span>
                            <span className="font-semibold">{player.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Medal className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-gray-600">
                                    {player.achievements}
                                </span>
                            </div>
                            <span className="font-bold text-amber-600">
                                {player.points} {t('points')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
