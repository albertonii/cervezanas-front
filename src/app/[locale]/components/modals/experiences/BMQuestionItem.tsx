import InputLabel from '../../form/InputLabel';
import SelectInput from '../../form/SelectInput';
import AddBeerMasterAnswers from './AddBeerMasterAnswers';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IAddModalExperienceBeerMasterFormData } from '@/lib/types/quiz';
import { DeleteButton } from '../../ui/buttons/DeleteButton';
import { DisplayInputError } from '../../ui/DisplayInputError';

interface Props {
    questionIndex: number;
    form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
    fields: any;
    remove: (index: number) => void;
    questionIdRemove: string;
    displayAnswerIsCorrectError: boolean;
}

export default function BMQuestionItem({
    questionIndex,
    form,
    remove,
    displayAnswerIsCorrectError,
}: Props) {
    const {
        formState: { errors },
    } = form;
    const t = useTranslations();

    const handleRemoveQuestion = (index: number) => {
        remove(index);
    };

    return (
        <>
            <div className="flex flex-row items-end space-x-4">
                <InputLabel
                    form={form}
                    label={`questions.${questionIndex}.question.question`}
                    labelText={`${questionIndex + 1} ${t('question')}`}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={t('input_questions_question_placeholder')}
                />

                <SelectInput
                    form={form}
                    options={[
                        { label: 'easy', value: 'easy' },
                        { label: 'medium', value: 'medium' },
                        { label: 'hard', value: 'hard' },
                    ]}
                    label={`questions.${questionIndex}.question.difficulty`}
                    labelText={`${'difficulty'}`}
                    registerOptions={{
                        required: true,
                    }}
                />

                <DeleteButton
                    onClick={() => handleRemoveQuestion(questionIndex)}
                />
            </div>

            {/* Error input displaying */}
            {errors.questions &&
                errors.questions[questionIndex] &&
                errors.questions[questionIndex]?.question?.question && (
                    <DisplayInputError
                        message={
                            errors.questions[questionIndex]?.question?.question
                                ?.message
                        }
                    />
                )}

            {/* {errors.questions &&
                errors.questions[questionIndex] &&
                errors.questions[questionIndex]?.question?.answers && (
                    <DisplayInputError
                        message={
                            errors.questions[questionIndex]?.question?.answers!
                                .message
                        }
                    />
                )} */}

            {errors.questions &&
                errors.questions[questionIndex] &&
                errors.questions[questionIndex]?.question?.answers?.root && (
                    <DisplayInputError
                        message={
                            errors.questions[questionIndex]?.question?.answers!
                                .root?.message
                        }
                    />
                )}

            {displayAnswerIsCorrectError && (
                <DisplayInputError
                    message={t('errors.answer_is_correct_marked')}
                />
            )}

            {/* Multiple inputs that are the possible answers to the question */}
            <AddBeerMasterAnswers form={form} questionIndex={questionIndex} />
        </>
    );
}
