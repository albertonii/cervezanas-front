import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IStep } from '@/lib/types/beerMasterGame';

interface RewardFormProps {
    steps: IStep[];
    onSave: (reward: any) => void;
    onClose: () => void;
}

export default function RewardForm({
    steps,
    onSave,
    onClose,
}: RewardFormProps) {
    const [reward, setReward] = useState({
        name: '',
        description: '',
        type: 'merchandise',
        condition: {
            stepId: '',
            correctAnswers: 1,
            totalQuestions: 1,
        },
        claimLocation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...reward, id: `reward-${Date.now()}` });
        onClose();
    };

    const selectedStep = steps.find((s) => s.id === reward.condition.stepId);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                    Nueva Recompensa
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={reward.name}
                        onChange={(e) =>
                            setReward({ ...reward, name: e.target.value })
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
                        value={reward.description}
                        onChange={(e) =>
                            setReward({
                                ...reward,
                                description: e.target.value,
                            })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Tipo
                    </label>
                    <select
                        value={reward.type}
                        onChange={(e) =>
                            setReward({ ...reward, type: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    >
                        <option value="merchandise">Merchandising</option>
                        <option value="experience">Experiencia</option>
                        <option value="discount">Descuento</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Paso Vinculado
                    </label>
                    <select
                        value={reward.condition.stepId}
                        onChange={(e) => {
                            const step = steps.find(
                                (s) => s.id === e.target.value,
                            );
                            setReward({
                                ...reward,
                                condition: {
                                    ...reward.condition,
                                    stepId: e.target.value,
                                    totalQuestions:
                                        step?.bm_steps_questions?.length || 1,
                                },
                            });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        required
                    >
                        <option value="">Selecciona un paso</option>
                        {steps.map((step) => (
                            <option key={step.id} value={step.id}>
                                Paso {step.step_number}: {step.title}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStep && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Respuestas correctas necesarias
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={selectedStep.bm_steps_questions?.length}
                            value={reward.condition.correctAnswers}
                            onChange={(e) =>
                                setReward({
                                    ...reward,
                                    condition: {
                                        ...reward.condition,
                                        correctAnswers: parseInt(
                                            e.target.value,
                                        ),
                                    },
                                })
                            }
                            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            De un total de{' '}
                            {selectedStep.bm_steps_questions?.length} preguntas
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Ubicación de Recogida
                    </label>
                    <input
                        type="text"
                        value={reward.claimLocation}
                        onChange={(e) =>
                            setReward({
                                ...reward,
                                claimLocation: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                    Guardar Recompensa
                </button>
            </div>
        </form>
    );
}
