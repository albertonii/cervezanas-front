import React, { useState, useCallback, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import StepItem from './StepItem';
import StepDetails from './StepDetails';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import {
    IConfigurationStepFormData,
    IGameState,
    IQuestion,
    IRewardFormData,
    IStep,
} from '@/lib/types/beerMasterGame';
import { updateStepsNumberInDB } from '../../../../actions';

interface StepsManagerProps {
    gameState: IGameState;
}

export default function StepsManager({ gameState }: StepsManagerProps) {
    const totalSteps = gameState.total_steps;

    const transformSteps = (steps: IStep[]): IConfigurationStepFormData[] => {
        return steps.map((step) => ({
            id: step.id,
            step_number: step.step_number,
            title: step.title,
            description: step.description,
            location: step.location,
            is_unlocked: step.is_unlocked,
            bm_state_id: step.bm_state_id,
            bm_steps_questions: step.bm_steps_questions
                ? step.bm_steps_questions.map((question: IQuestion) => ({
                      id: question.id,
                      text: question.text,
                      options: question.options,
                      correct_answer: String(question.correct_answer),
                      difficulty: question.difficulty,
                      points: question.points,
                      explanation: question.explanation,
                  }))
                : [],
            bm_steps_rewards: step.bm_steps_rewards?.map(
                (reward: IRewardFormData) => ({
                    id: reward.id,
                    name: reward.name,
                    description: reward.description,
                    correct_answers: reward.correct_answers,
                    total_questions: reward.total_questions,
                    claim_location: reward.claim_location,
                    claimed: reward.claimed,
                    bm_step_id: reward.bm_step_id,
                }),
            ),
        }));
    };

    const [steps, setSteps] = useState<IConfigurationStepFormData[]>(
        transformSteps(gameState.bm_steps || []),
    );

    const [editingStep, setEditingStep] =
        useState<IConfigurationStepFormData | null>(null);

    useEffect(() => {
        if (totalSteps > steps.length) {
            const newSteps = Array.from(
                { length: totalSteps - steps.length },
                (_, i) => ({
                    id: `step-${steps.length + i + 1}`,
                    step_number: steps.length + i + 1,
                    title: '',
                    description: '',
                    location: '',
                    is_unlocked: false,
                    bm_state_id: '',
                    bm_steps_questions: [],
                    bm_steps_rewards: [],
                }),
            );
            setSteps((prev) => [...prev, ...newSteps]);
        } else if (totalSteps < steps.length) {
            setSteps((prev) => prev.slice(0, totalSteps));
        }
    }, [totalSteps]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = async ({ active, over }: any) => {
        if (!over) return;

        const oldIndex = steps.findIndex((step) => step.id === active.id);
        const newIndex = steps.findIndex((step) => step.id === over.id);

        if (oldIndex !== newIndex) {
            const reorderedSteps = arrayMove(steps, oldIndex, newIndex).map(
                (step, index) => ({
                    ...step,
                    step_number: index + 1,
                }),
            );
            setSteps(reorderedSteps);

            // Filtrar solo los pasos modificados
            const modifiedSteps = reorderedSteps.filter(
                (step, index) =>
                    step.step_number !==
                    gameState.bm_steps![index]?.step_number,
            );

            console.log(modifiedSteps);

            if (modifiedSteps.length > 0) {
                // Llamar a la API para registrar los cambios
                await updateStepsNumberInDB(modifiedSteps);
            }
        }
    };

    const handleStepSave = useCallback(
        (updatedStep: IConfigurationStepFormData) => {
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.id === updatedStep.id ? updatedStep : step,
                ),
            );
            setEditingStep(null);
        },
        [],
    );

    return (
        <div className="space-y-6">
            <Title size="xlarge" color="black">
                Steps Configuration
            </Title>
            <Label color="gray" size="small">
                Drag and drop to reorder steps
            </Label>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={steps.map(
                        (step, index) => step.id || `temp-id-${index}`,
                    )}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {steps.map((step, index) => {
                            const memoizedStep = React.useMemo(
                                () => step,
                                [step],
                            );

                            return (
                                <StepItem
                                    key={memoizedStep.id}
                                    step={memoizedStep}
                                    index={index}
                                    onEditClick={setEditingStep}
                                />
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>

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
