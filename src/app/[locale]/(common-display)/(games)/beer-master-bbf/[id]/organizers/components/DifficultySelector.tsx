import React from 'react';
import { Star } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IConfigurationStepFormData } from '@/lib/types/beerMasterGame';

interface DifficultySelectorProps {
    questionIndex: number; // Nombre del campo en el formulario
    form: UseFormReturn<IConfigurationStepFormData, any>;
}

export default function DifficultySelector({
    questionIndex,
    form,
}: DifficultySelectorProps) {
    const { setValue, watch } = form;

    // Obtenemos el valor actual del formulario para este campo
    const value = watch(`bm_steps_questions.${questionIndex}.difficulty`);

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

    const handleSelection = (difficulty: string) => {
        // Encontramos la dificultad seleccionada
        const selectedDifficulty = difficulties.find(
            (d) => d.value === difficulty,
        );
        if (selectedDifficulty) {
            // Actualizamos el valor de la dificultad y los puntos en el formulario
            setValue(
                `bm_steps_questions.${questionIndex}.difficulty`,
                difficulty,
            );
            setValue(
                `bm_steps_questions.${questionIndex}.points`,
                selectedDifficulty.points,
            );
        }
    };

    return (
        <div className="flex w-full justify-between ">
            <div className="flex space-x-2">
                {difficulties.map((difficulty) => (
                    <button
                        key={difficulty.value}
                        onClick={() => handleSelection(difficulty.value)}
                        type="button"
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
