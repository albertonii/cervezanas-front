import StepItem from './StepItem';
import StepDetails from './StepDetails';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import {
    IConfigurationStepFormData,
    IGameState,
    IQuestion,
    IRewardFormData,
    IStep,
} from '@/lib/types/beerMasterGame';

interface StepsManagerProps {
    gameState: IGameState;
}

export default function StepsManager({ gameState }: StepsManagerProps) {
    const t = useTranslations('bm_game');

    const totalSteps = gameState.total_steps;

    // Función para transformar IStep[] a IConfigurationStepFormData[]
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
                      correct_answer: String(question.correct_answer), // Convertir a string si es necesario
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
                    is_completed: false,
                    is_qr_scanned: false,
                    current_question_index: 0,
                    correct_answers: 0,
                    bm_state_id: '',
                    bm_steps_questions: [],
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

    const handleStepChange = useCallback(
        (updatedStep: IConfigurationStepFormData) => {
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.id === updatedStep.id ? updatedStep : step,
                ),
            );
        },
        [],
    );

    const handleStepSave = async (updatedStep: IConfigurationStepFormData) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.id === updatedStep.id ? updatedStep : step,
            ),
        );
        setEditingStep(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <Title size="xlarge" color="black">
                    {t('steps_configuration')}
                </Title>
                <Label color="gray" size="small">
                    {t('drag_and_drop_to_reorder')}
                </Label>
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
