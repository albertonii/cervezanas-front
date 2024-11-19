'use client';

import StepsManager from './components/StepsManager';
import GameBasicInfo from './components/GameBasicInfo';
import Title from '@/app/[locale]/components/ui/Title';
import RewardsManager from './components/RewardsManager';
import OrganizersManager from './components/OrganizersManager';
import AchievementsManager from './components/AchievementsManager';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IGameState } from '@/lib/types/beerMasterGame';
import { Settings, Users, Map, Gift, Trophy } from 'lucide-react';

interface Props {
    gameState: IGameState;
}

export default function AdminPanel({ gameState }: Props) {
    const t = useTranslations('bm_game');

    const [gameState_, setGameState_] = useState(gameState);

    const [activeTab, setActiveTab] = useState('basic');

    const tabs = [
        { id: 'basic', label: 'Información Básica', icon: Settings },
        { id: 'organizers', label: 'Organizadores', icon: Users },
        { id: 'steps', label: 'Pasos', icon: Map },
        { id: 'rewards', label: 'Recompensas', icon: Gift },
        { id: 'achievements', label: 'Logros', icon: Trophy },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <GameBasicInfo
                        gameState={gameState_}
                        onChangeGameState={setGameState_}
                    />
                );
            case 'organizers':
                return <OrganizersManager />;
            case 'steps':
                return <StepsManager gameState={gameState_} />;
            case 'rewards':
                return <RewardsManager />;
            case 'achievements':
                return <AchievementsManager />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 ">
                <Title size="xlarge" color="beer-blonde">
                    {t('experience_configuration')}
                </Title>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex space-x-8">
                <nav className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left mb-2 animation-all duration-300 ease-in-out ${
                                activeTab === id
                                    ? 'bg-beer-gold text-beer-foam'
                                    : 'text-gray-600 hover:bg-beer-softFoam'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
}
