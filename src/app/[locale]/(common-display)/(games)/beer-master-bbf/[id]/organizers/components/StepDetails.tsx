import StepQuestionEditor from './StepQuestionEditor';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { IStep } from '@/lib/types/beerMasterGame';
import { zodResolver } from '@hookform/resolvers/zod';

interface StepDetailsProps {
    step: IStep;
    onClose: () => void;
    onSave: (updatedStep: IStep) => void;
}

export type StepsFormData = {
    title: string;
    description: string;
    location: string;
    is_unlocked: boolean;
    bm_steps_questions?: {
        id: string;
        text: string;
        options: string[];
        correct_answer: number;
        explanation?: string;
        difficulty: string;
        points: number;
        created_at?: string;
        bm_step_id?: string;
    }[];
};

const stepSchema: ZodType<StepsFormData> = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    is_unlocked: z.boolean(),
    bm_steps_questions: z
        .array(
            z.object({
                id: z.string(),
                text: z.string().nonempty('errors.input_required'),
                options: z.array(z.string().nonempty('errors.input_required')),
                correct_answer: z
                    .number()
                    .positive('errors.input_number_positive'),
                explanation: z.string().optional(),
                difficulty: z.string().nonempty('errors.input_required'),
                points: z.number().min(1, 'errors.input_number_min_1'),
            }),
        )
        .optional(),
});

type ValidationSchema = z.infer<typeof stepSchema>;

export default function StepDetails({
    step,
    onClose,
    onSave,
}: StepDetailsProps) {
    const t = useTranslations('bm_game');

    const [editedStep, setEditedStep] = useState(step);
    const [activeTab, setActiveTab] = useState('basic');

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(stepSchema),
        defaultValues: {
            title: step.title,
            description: step.description,
            location: step.location,
            is_unlocked: step.is_unlocked,
            bm_steps_questions: step.bm_steps_questions,
        },
    });

    const handleSave = () => {
        onSave(editedStep);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t('edit_step_number', {
                            stepNumber: step.step_number,
                        })}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Button primary small onClick={handleSave}>
                            {t('save')}
                        </Button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'basic'
                                ? 'text-amber-600 border-b-2 border-amber-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('basic_info')}
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-6 py-3 font-medium ${
                            activeTab === 'questions'
                                ? 'text-amber-600 border-b-2 border-amber-500'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t('questions')}
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                    {activeTab === 'basic' ? (
                        <div className="space-y-4">
                            <div>
                                <InputLabel
                                    form={form}
                                    label="title"
                                    labelText={`${t('step_name')}`}
                                />
                            </div>

                            <div>
                                <InputTextarea
                                    rows={3}
                                    form={form}
                                    label="description"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    form={form}
                                    label="bm_game.location"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <InputLabel
                                    inputType="checkbox"
                                    form={form}
                                    label="is_unlocked"
                                    labelText={t('step_locked_initially')}
                                />
                            </div>
                        </div>
                    ) : (
                        <StepQuestionEditor
                            form={form}
                            questions={editedStep.bm_steps_questions || []}
                            onChange={(questions) =>
                                setEditedStep({
                                    ...editedStep,
                                    bm_steps_questions: questions,
                                })
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
