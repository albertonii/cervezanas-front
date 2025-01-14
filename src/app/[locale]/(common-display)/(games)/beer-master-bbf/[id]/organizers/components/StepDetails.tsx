import StepQuestionEditor from './StepQuestionEditor';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import StepBasicInfoEditor from './StepBasicInfoEditor';
import React, { useCallback, useState } from 'react';
import { z, ZodType } from 'zod';
import { X } from 'lucide-react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { handleSaveBMGameStep } from '../../../../actions';
import { IConfigurationStepFormData } from '@/lib/types/beerMasterGame';
import TabButton from '@/app/[locale]/components/ui/buttons/TabButton';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface StepDetailsProps {
    step: IConfigurationStepFormData;
    onClose: () => void;
    onSave: (updatedStep: IConfigurationStepFormData) => void;
}

const stepSchema: ZodType<IConfigurationStepFormData> = z.object({
    id: z.string().nonempty({ message: 'errors.input_required' }),
    title: z.string().min(1, 'errors.input_required'),
    description: z.string().min(1, 'errors.input_required'),
    location: z.string().min(1, 'errors.input_required'),
    is_unlocked: z.boolean(),
    bm_steps_questions: z.array(
        z.object({
            id: z.string(),
            text: z.string().nonempty('errors.input_required'),
            options: z
                .array(z.string().nonempty('errors.input_required'))
                .refine((options) => options.some((option) => option !== ''), {
                    message: 'At least one option must be selected',
                }),
            correct_answer: z.string(),
            explanation: z.string().optional(),
            difficulty: z.string().nonempty('errors.input_required'),
            points: z.number().min(1, 'errors.input_number_min_1'),
        }),
    ),
    step_number: z.number(),
    bm_state_id: z.string(),
});

type ValidationSchema = z.infer<typeof stepSchema>;

export default function StepDetails({
    step,
    onClose,
    onSave,
}: StepDetailsProps) {
    const t = useTranslations('bm_game');

    const [activeTab, setActiveTab] = useState('basic');

    const { handleMessage } = useMessage();

    const form = useForm<ValidationSchema>({
        resolver: zodResolver(stepSchema),
        mode: 'onSubmit', // Solo valida al enviar
        defaultValues: {
            bm_state_id: step.id,
            title: step.title,
            description: step.description,
            location: step.location,
            is_unlocked: step.is_unlocked,
            step_number: step.step_number,
            bm_steps_questions: step.bm_steps_questions ?? [
                {
                    id: `q-${Date.now()}`,
                    text: '',
                    options: ['', '', ''],
                    correct_answer: '0',
                    difficulty: 'medium',
                    points: 150,
                    explanation: '',
                },
            ],
        },
    });

    const {
        handleSubmit,
        formState: { isValid, errors },
    } = form;

    const handleStepSave = async (form: ValidationSchema) => {
        const {
            title,
            description,
            location,
            is_unlocked,
            step_number,
            bm_steps_questions,
        } = form;

        const updatedStep: IConfigurationStepFormData = {
            ...step,
            id: step.id || '',
            bm_state_id: step.bm_state_id,
            title,
            description,
            location,
            is_unlocked,
            step_number,
            bm_steps_questions,
        };

        if (isValid) {
            handleSaveBMGameStep(updatedStep);

            onSave(updatedStep);
            onClose();

            handleMessage({
                type: 'success',
                message: t('step_saved'),
            });
        }
    };

    const handleStepSaveMutation = useMutation({
        mutationKey: ['saveStep', step.id],
        mutationFn: handleStepSave,
        onError: (err: Error) => {
            console.log(err);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: IConfigurationStepFormData,
    ) => {
        try {
            handleStepSaveMutation.mutate(formValues);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t('edit_step_number', {
                                stepNumber: step.step_number,
                            })}
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Button primary medium btnType="submit">
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
                        <TabButton
                            isActive={activeTab === 'basic'}
                            onClick={() => setActiveTab('basic')}
                        >
                            {t('basic_info')}
                        </TabButton>
                        <TabButton
                            isActive={activeTab === 'questions'}
                            onClick={() => setActiveTab('questions')}
                        >
                            {t('questions')}
                        </TabButton>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
                        {activeTab === 'basic' ? (
                            <StepBasicInfoEditor form={form} />
                        ) : (
                            <StepQuestionEditor form={form} />
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
