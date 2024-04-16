import { useTranslations } from 'next-intl';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    AnswerFormData,
    IAddModalExperienceBeerMasterFormData,
} from '../../../../../lib/types/quiz';
import { DeleteButton } from '../../common/DeleteButton';
import { DisplayInputError } from '../../common/DisplayInputError';
import InputLabel from '../../common/InputLabel';

interface Props {
    answer: AnswerFormData;
    questionIndex: number;
    index: number;
    form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
    fields: any;
    remove: (index: number) => void;
}

export default function BMAnswerItem({
    answer,
    questionIndex,
    index,
    form,
    fields,
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
    const handleRemoveAnswer = async (answerId: string) => {
        // We need to remove like this because it's accessing twice to this method,
        //  so if we find the index it's going to remove it two times
        fields.findIndex((field: any) => field.id === answerId) > -1 &&
            remove(fields.findIndex((field: any) => field.id === answerId));
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
                <DeleteButton onClick={() => handleRemoveAnswer(answer.id!)} />
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
