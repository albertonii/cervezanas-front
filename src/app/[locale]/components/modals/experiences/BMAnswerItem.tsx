import InputLabel from '../../common/InputLabel';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IAddModalExperienceBeerMasterFormData } from '@/lib//types/quiz';
import { DeleteButton } from '../../common/DeleteButton';
import { DisplayInputError } from '../../common/DisplayInputError';

interface Props {
    questionIndex: number;
    index: number;
    form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
    remove: (index: number) => void;
}

export default function BMAnswerItem({
    questionIndex,
    index,
    form,
    remove,
}: Props) {
    const t = useTranslations();
    const {
        formState: { errors },
    } = form;

    /**
     * - If the answer is saved in the database, we remove it from the database
     * - If the answer is not saved in the database, we remove it from the form
     * @param answerIndex
     * @returns
     */
    const handleRemoveAnswer = async (index: number) => {
        remove(index);
    };

    return (
        <>
            <InputLabel
                inputType="checkbox"
                form={form}
                label={`questions.${questionIndex}.question.answers.${index}.is_correct`}
                labelText={' '}
            />

            <div className="col-span-10 ">
                <InputLabel
                    form={form}
                    label={`questions.${questionIndex}.question.answers.${index}.answer`}
                    labelText={`${t('answer')} ${index + 1}`}
                    registerOptions={{ required: true }}
                    placeholder="Answer text"
                />
            </div>

            <div className="justify-center items-center">
                <DeleteButton onClick={() => handleRemoveAnswer(index)} />
            </div>

            {/* Error input displaying */}
            {errors.questions &&
                errors.questions[questionIndex] &&
                errors.questions[questionIndex]?.question?.answers &&
                errors.questions[questionIndex]?.question?.answers?.[index]
                    ?.answer && (
                    <DisplayInputError
                        message={
                            errors.questions[questionIndex]?.question
                                ?.answers?.[index]?.answer?.message
                        }
                    />
                )}
        </>
    );
}
