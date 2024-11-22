import DifficultySelector from './DifficultySelector';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import React, { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IConfigurationStepFormData } from '@/lib/types/beerMasterGame';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';

interface StepQuestionEditorProps {
    form: UseFormReturn<IConfigurationStepFormData, any>;
}
export default function StepQuestionEditor({ form }: StepQuestionEditorProps) {
    const t = useTranslations('bm_game');

    const {
        control,
        register,
        setValue,
        watch,
        formState: { errors },
        getValues,
    } = form;
    const {
        fields: questions,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'bm_steps_questions',
    });
    console.log(questions);

    const addQuestion = () =>
        append({
            id: `q-${Date.now()}`,
            text: '',
            options: ['', '', ''],
            correct_answer: '0',
            difficulty: 'medium',
            points: 150,
            explanation: '',
        });

    const addOption = (questionIndex: number) => {
        const options = watch(`bm_steps_questions.${questionIndex}.options`);
        setValue(`bm_steps_questions.${questionIndex}.options`, [
            ...options,
            '',
        ]);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const options = watch(`bm_steps_questions.${questionIndex}.options`);
        const updatedOptions = options.filter((_, idx) => idx !== optionIndex);
        setValue(`bm_steps_questions.${questionIndex}.options`, updatedOptions);
    };

    const renderOptions = useCallback(
        (questionIndex: number) => {
            const options = watch(
                `bm_steps_questions.${questionIndex}.options`,
            );
            return options.map((option: string, optionIndex: number) => {
                return (
                    <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="radio"
                            {...register(
                                `bm_steps_questions.${questionIndex}.correct_answer`,
                            )}
                            value={optionIndex}
                            className="text-beer-blonde focus:ring-beer-blonde"
                        />
                        <DisplayInputError
                            message={getErrorMessage(
                                'correct_answer',
                                questionIndex,
                            )}
                        />

                        <input
                            type="text"
                            {...register(
                                `bm_steps_questions.${questionIndex}.options.${optionIndex}`,
                                {
                                    required: 'Este campo es obligatorio',
                                },
                            )}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            placeholder={`Opción ${optionIndex + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                removeOption(questionIndex, optionIndex)
                            }
                            className="text-gray-400 hover:text-red-500"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        {getErrorMessage(
                            'options',
                            questionIndex,
                            optionIndex,
                        ) && (
                            <DisplayInputError
                                message={getErrorMessage(
                                    'options',
                                    questionIndex,
                                    optionIndex,
                                )}
                            />
                        )}
                    </div>
                );
            });
        },
        [register, getValues, removeOption],
    );

    const getErrorMessage = (
        field: keyof IConfigurationStepFormData['bm_steps_questions'][number],
        questionIndex: number,
        optionIndex?: number,
    ) => {
        const questionError = errors.bm_steps_questions?.[questionIndex];
        if (field === 'correct_answer') {
            return questionError?.[field]?.message;
        }
        if (optionIndex !== undefined) {
            return questionError?.options?.[optionIndex]?.message;
        }
        return questionError?.[field]?.message;
    };

    const QuestionList = React.memo(
        ({
            questions,
            renderOptions,
        }: {
            questions: any;
            renderOptions: (index: number) => JSX.Element[];
        }) => {
            return questions.map((question: any, questionIndex: number) => (
                <div
                    key={question.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
                >
                    <h4 className="text-lg font-medium text-gray-900">
                        {`Pregunta ${questionIndex + 1}`}
                    </h4>
                    {renderOptions(questionIndex)}
                </div>
            ));
        },
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title size="large" color="black">
                    {t('step_questions')}
                </Title>
                <Button primary medium onClick={addQuestion}>
                    {t('add_question')}
                </Button>
            </div>

            <div className="space-y-8">
                {questions.map((question, questionIndex) => (
                    <div
                        key={question.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-gray-900">
                                {t('question_and_number', {
                                    questionNumber: questionIndex + 1,
                                })}
                            </h4>
                            <button
                                type="button"
                                onClick={() => remove(questionIndex)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <Label size="xsmall">{t('difficulty')}</Label>
                            <DifficultySelector
                                questionIndex={questionIndex}
                                form={form}
                            />
                        </div>

                        <div>
                            <InputLabel
                                form={form}
                                label={`bm_steps_questions.${questionIndex}.text`}
                                labelText="Pregunta"
                                placeholder="Escribe la pregunta..."
                            />
                            <DisplayInputError
                                message={
                                    errors.bm_steps_questions?.[questionIndex]
                                        ?.text?.message
                                }
                            />
                        </div>

                        <div className="space-y-4 border rounded-xl p-2">
                            <div className="space-y-2">
                                <Label size="xsmall">{t('options')}</Label>
                                <Label size="xsmall" color="gray">
                                    {t('correct_answer_must_be_selected')}
                                </Label>
                                {renderOptions(questionIndex)}
                            </div>

                            <Button
                                small
                                primary
                                onClick={() => addOption(questionIndex)}
                            >
                                {t('add_answer')}
                            </Button>
                        </div>

                        <div>
                            <InputTextarea
                                form={form}
                                label={`bm_steps_questions.${questionIndex}.explanation`}
                                rows={2}
                                labelText={t('explanation')}
                                placeholder={t(
                                    'why_is_this_the_correct_answer',
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
