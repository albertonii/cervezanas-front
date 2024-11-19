import StepDetails from './StepDetails';
import React, { useState, useEffect, useCallback } from 'react';
import { GripVertical, Gift } from 'lucide-react';
import { IGameState, IStep } from '@/lib/types/beerMasterGame';

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd';

interface StepsManagerProps {
    gameState: IGameState;
}

// Separate StepItem into its own component with modern patterns
const StepItem = React.memo(function StepItem({
    step,
    index,
    onStepChange,
    onEditClick,
}: {
    step: IStep;
    index: number;
    onStepChange: (updatedStep: IStep) => void;
    onEditClick: (step: IStep) => void;
}) {
    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onStepChange({ ...step, title: e.target.value });
        },
        [step, onStepChange],
    );

    const handleLocationChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onStepChange({ ...step, location: e.target.value });
        },
        [step, onStepChange],
    );

    const handleQuestionCountChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // onStepChange({ ...step, question_count: parseInt(e.target.value) });
        },
        [step, onStepChange],
    );

    const handleLockedChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onStepChange({ ...step, is_unlocked: !e.target.checked });
        },
        [step, onStepChange],
    );

    return (
        <Draggable draggableId={step.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center space-x-4">
                        <div {...provided.dragHandleProps}>
                            <GripVertical className="w-6 h-6 text-gray-400" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="font-medium text-gray-900">
                                    Paso {step.step_number}
                                </span>
                                {step.bm_steps_rewards && (
                                    <Gift className="w-4 h-4 text-amber-500" />
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={handleNameChange}
                                    className="px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nombre del paso"
                                />

                                <input
                                    type="text"
                                    value={step.location}
                                    onChange={handleLocationChange}
                                    className="px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Ubicación"
                                />

                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={step.bm_steps_questions?.length}
                                        onChange={handleQuestionCountChange}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={!step.is_unlocked}
                                            onChange={handleLockedChange}
                                            className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Bloqueado
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onEditClick(step)}
                            className="px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                        >
                            Editar
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
});

export default function StepsManager({ gameState }: StepsManagerProps) {
    const totalSteps = gameState.total_steps;
    const [steps, setSteps] = useState<IStep[]>([]);
    const [editingStep, setEditingStep] = useState<IStep | null>(null);

    useEffect(() => {
        if (totalSteps > steps.length) {
            // const newSteps = Array.from(
            //     { length: totalSteps - steps.length },
            //     (_, i) => ({
            //         id: `step-${steps.length + i + 1}`,
            //         order: steps.length + i + 1,
            //         name: '',
            //         description: '',
            //         location: '',
            //         is_unlocked: false,
            //         question_count: 1,
            //         has_reward: false,
            //         questions: [],
            //     }),
            // );
            const newSteps = Array.from(
                { length: totalSteps - steps.length },
                (_, i) => ({
                    id: `step-${steps.length + i + 1}`,
                    created_at: new Date().toISOString(),
                    step_number: steps.length + i + 1,
                    title: '',
                    description: '',
                    location: '',
                    is_unlocked: false,
                    is_completed: false,
                    is_qr_scanned: false,
                    current_question_index: 0,
                    correct_answers: 0,
                    bm_state_id: '',
                    bm_steps_game_stae: undefined,
                    bm_steps_questions: [],
                    bm_steps_rewards: [],
                }),
            );
            setSteps([...steps, ...newSteps]);
        } else if (totalSteps < steps.length) {
            setSteps(steps.slice(0, totalSteps));
        }
    }, [totalSteps]);

    const handleDragEnd = useCallback(
        (result: DropResult) => {
            if (!result.destination) return;

            const items = Array.from(steps);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedItems = items.map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            setSteps(updatedItems);
        },
        [steps],
    );

    const handleStepChange = useCallback((updatedStep: IStep) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.id === updatedStep.id ? updatedStep : step,
            ),
        );
    }, []);

    const handleStepSave = useCallback((updatedStep: IStep) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.id === updatedStep.id ? updatedStep : step,
            ),
        );
        setEditingStep(null);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    Configuración de Pasos
                </h2>
                <p className="text-gray-600 mt-1">
                    Arrastra y suelta para reordenar los pasos. Haz clic en un
                    paso para editarlo.
                </p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                        >
                            {steps.map((step, index) => (
                                <StepItem
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    onStepChange={handleStepChange}
                                    onEditClick={setEditingStep}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {editingStep && (
                <StepDetails
                    step={editingStep}
                    onClose={() => setEditingStep(null)}
                    onSave={handleStepSave}
                />
            )}
        </div>
    );
}
