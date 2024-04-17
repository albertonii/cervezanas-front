import { useTranslations } from 'next-intl';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IAddModalExperienceBeerMasterFormData } from '../../../../../lib/types/quiz';
import { DeleteButton } from '../../common/DeleteButton';
import { DisplayInputError } from '../../common/DisplayInputError';
import InputLabel from '../../common/InputLabel';
import SelectInput from '../../common/SelectInput';
import AddBeerMasterAnswers from './AddBeerMasterAnswers';

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
    fields,
    remove,
    questionIdRemove,
    displayAnswerIsCorrectError,
}: Props) {
    const {
        formState: { errors },
    } = form;
    const t = useTranslations();

    const handleRemoveQuestion = (id: string) => {
        // We need to remove like this because it's accessing twice to this method,
        //  so if we find the index it's going to remove it two times
        fields.findIndex((field: any) => field.id === id) > -1 &&
            remove(fields.findIndex((field: any) => field.id === id));
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
                    labelText={`${t('difficulty')}`}
                    registerOptions={{
                        required: true,
                    }}
                />

                <DeleteButton
                    onClick={() => handleRemoveQuestion(questionIdRemove)}
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
