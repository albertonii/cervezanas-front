import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
    achievements as defaultAchievements,
    achievementTypes,
} from '../../../data/achievements';
import {
    IAchievement,
    IAchievementConditions,
} from '@/lib/types/beerMasterGame';
import {
    Trophy,
    Trash2,
    Edit2,
    Clock,
    Target,
    Award,
    Flame,
    Info,
} from 'lucide-react';

const RARITY_COLORS = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-amber-100 text-amber-800',
};

const AVAILABLE_ICONS = {
    trophy: Trophy,
    clock: Clock,
    target: Target,
    award: Award,
    flame: Flame,
};

interface FormData {
    name: string;
    description: string;
    icon: string;
    target: number;
    type: IAchievement['type'];
    rarity: IAchievement['rarity'];
    points: number;
    howToAchieve: string;
    conditions: Partial<IAchievementConditions>;
}

export default function AchievementsManager() {
    const t = useTranslations('bm_game');

    const [achievements, setAchievements] =
        useState<IAchievement[]>(defaultAchievements);
    const [showForm, setShowForm] = useState(false);
    const [editingAchievement, setEditingAchievement] =
        useState<IAchievement | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        icon: 'trophy',
        target: 1,
        type: 'progress',
        rarity: 'common',
        points: 100,
        howToAchieve: '',
        conditions: {},
    });

    const handleEdit = (achievement: IAchievement) => {
        setEditingAchievement(achievement);
        setFormData({
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            target: achievement.target,
            type: achievement.type,
            rarity: achievement.rarity,
            points: achievement.points,
            howToAchieve: achievement.how_to_achieve,
            conditions: achievement.conditions || {},
        });
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setAchievements(achievements.filter((a) => a.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAchievement) {
            setAchievements(
                achievements.map((a) =>
                    a.id === editingAchievement.id
                        ? { ...editingAchievement, ...formData }
                        : a,
                ),
            );
        } else {
            const newAchievement: IAchievement = {
                id: `achievement-${Date.now()}`,
                ...formData,
                progress: 0,
                conditions: formData.conditions as IAchievementConditions,
                bm_game_id: '',
                how_to_achieve: '',
            };
            setAchievements([...achievements, newAchievement]);
        }
        setShowForm(false);
        setEditingAchievement(null);
        setFormData({
            name: '',
            description: '',
            icon: 'trophy',
            target: 1,
            type: 'progress',
            rarity: 'common',
            points: 100,
            howToAchieve: '',
            conditions: {},
        });
    };

    const getConditionsFields = () => {
        switch (formData.type) {
            case 'progress':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de Progreso
                            </label>
                            <select
                                value={
                                    Object.keys(formData.conditions)[0] || ''
                                }
                                // onChange={(e) => {
                                //     const newConditions: Partial<IAchievementConditions> =
                                //         {};
                                //     newConditions[
                                //         e.target
                                //             .value as keyof IAchievementConditions
                                //     ] = 0;
                                //     setFormData({
                                //         ...formData,
                                //         conditions: newConditions,
                                //     });
                                // }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            >
                                <option value="">
                                    Selecciona el tipo de progreso
                                </option>
                                <option value="stepsCompleted">
                                    Pasos Completados
                                </option>
                                <option value="totalRewardsCollected">
                                    Recompensas Recolectadas
                                </option>
                                <option value="totalPointsEarned">
                                    Puntos Acumulados
                                </option>
                                <option value="qrCodesScanned">
                                    Códigos QR Escaneados
                                </option>
                                <option value="socialShares">
                                    Compartidos en Redes
                                </option>
                            </select>
                        </div>
                    </div>
                );

            case 'accuracy':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Requisitos de Precisión
                            </label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-xs text-gray-500">
                                        Respuestas Correctas
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            formData.conditions
                                                .correct_answers || 0
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                conditions: {
                                                    ...formData.conditions,
                                                    correct_answers: parseInt(
                                                        e.target.value,
                                                    ),
                                                },
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">
                                        Precisión Requerida (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            formData.conditions
                                                .required_accuracy || 0
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                conditions: {
                                                    ...formData.conditions,
                                                    required_accuracy: parseInt(
                                                        e.target.value,
                                                    ),
                                                },
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'speed':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Límite de Tiempo (seg)
                                </label>
                                <input
                                    type="number"
                                    value={formData.conditions.time_limit || 0}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            conditions: {
                                                ...formData.conditions,
                                                time_limit: parseInt(
                                                    e.target.value,
                                                ),
                                            },
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Ventana de Tiempo (horas)
                                </label>
                                <input
                                    type="number"
                                    value={
                                        formData.conditions.timeframe_window ||
                                        0
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            conditions: {
                                                ...formData.conditions,
                                                timeframe_window: parseInt(
                                                    e.target.value,
                                                ),
                                            },
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'streak':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Días Requeridos
                                </label>
                                <input
                                    type="number"
                                    value={
                                        formData.conditions.days_required || 0
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            conditions: {
                                                ...formData.conditions,
                                                days_required: parseInt(
                                                    e.target.value,
                                                ),
                                            },
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Pasos Diarios Mínimos
                                </label>
                                <input
                                    type="number"
                                    value={
                                        formData.conditions
                                            .minimum_daily_steps || 0
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            conditions: {
                                                ...formData.conditions,
                                                minimum_daily_steps: parseInt(
                                                    e.target.value,
                                                ),
                                            },
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Gestión de Logros
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Configura los logros que los jugadores pueden
                        desbloquear
                    </p>
                </div>
                <Button primary medium onClick={() => setShowForm(true)}>
                    Añadir Logro
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {achievements.map((achievement) => {
                    const TypeIcon =
                        AVAILABLE_ICONS[
                            achievement.icon as keyof typeof AVAILABLE_ICONS
                        ] || Trophy;

                    return (
                        <div
                            key={achievement.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`p-2 rounded-lg ${
                                            RARITY_COLORS[
                                                achievement.rarity as keyof typeof RARITY_COLORS
                                            ]
                                        }`}
                                    >
                                        <TypeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {achievement.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {achievement.description}
                                        </p>
                                        <div className="mt-2 flex items-center space-x-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    RARITY_COLORS[
                                                        achievement.rarity as keyof typeof RARITY_COLORS
                                                    ]
                                                }`}
                                            >
                                                {achievement.rarity}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {
                                                    achievementTypes[
                                                        achievement.type as keyof typeof achievementTypes
                                                    ]?.name
                                                }
                                            </span>
                                            <span className="text-sm text-amber-600">
                                                {achievement.points} puntos
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(achievement)}
                                        className="text-gray-400 hover:text-amber-500"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(achievement.id)
                                        }
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingAchievement
                                    ? 'Editar Logro'
                                    : 'Nuevo Logro'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingAchievement(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Info className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cómo Conseguirlo
                                </label>
                                <textarea
                                    value={formData.howToAchieve}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            howToAchieve: e.target.value,
                                        })
                                    }
                                    rows={2}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tipo
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target
                                                    .value as IAchievement['type'],
                                                conditions: {},
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    >
                                        {Object.entries(achievementTypes).map(
                                            ([value, { name }]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Rareza
                                    </label>
                                    <select
                                        value={formData.rarity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rarity: e.target
                                                    .value as IAchievement['rarity'],
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    >
                                        <option value="common">Común</option>
                                        <option value="rare">Raro</option>
                                        <option value="epic">Épico</option>
                                        <option value="legendary">
                                            Legendario
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Meta
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.target}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                target: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Puntos
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                points: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        min="50"
                                        step="50"
                                        required
                                    />
                                </div>
                            </div>

                            {getConditionsFields()}

                            <div className="flex justify-between space-x-3 pt-4">
                                <Button btnType="submit" primary small>
                                    {editingAchievement
                                        ? 'Actualizar'
                                        : 'Crear'}{' '}
                                    Logro
                                </Button>
                                <Button
                                    accent
                                    small
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingAchievement(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
