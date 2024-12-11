import React from 'react';
import BMAnswerItem from './BMAnswerItem';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { AnswerFormData } from '@/lib/types/quiz';
import { useTranslations } from 'next-intl';
import { IAddModalExperienceBeerMasterFormData } from '@/lib/types/quiz';
import Button from '../../ui/buttons/Button';

const emptyAnswer: AnswerFormData = {
    answer: '',
    is_correct: false,
};

interface Props {
    form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
    questionIndex: number;
}

export default function AddBeerMasterAnswers({ form, questionIndex }: Props) {
    const t = useTranslations();

    const { control } = form;

    const { fields, append, remove } = useFieldArray({
        name: `questions.${questionIndex}.question.answers`,
        control,
    });

    const handleAddAnswer = () => {
        append(emptyAnswer);
    };

    return (
        <>
            {fields.map((answer, index) => (
                <section
                    key={answer.id}
                    className="grid grid-cols-12 space-x-2 items-end"
                >
                    <BMAnswerItem
                        questionIndex={questionIndex}
                        index={index}
                        form={form}
                        remove={remove}
                    />
                </section>
            ))}

            <div className="grid grid-cols-1 space-y-4 space-x-0 sm:space-y-0 sm:grid-cols-2 sm:space-x-4">
                <Button small onClick={handleAddAnswer}>
                    {t('add_answer')}
                </Button>
            </div>
        </>
    );
}
