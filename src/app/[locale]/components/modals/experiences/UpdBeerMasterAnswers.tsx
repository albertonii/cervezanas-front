import Button from '../../common/Button';
import InputLabel from '../../common/InputLabel';
import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { DeleteButton } from '../../common/DeleteButton';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useQueryClient } from 'react-query';
import { DisplayInputError } from '../../common/DisplayInputError';
import {
  AnswerFormData,
  IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types/quiz';
import { defaultOverrides } from 'next/dist/server/require-hook';

const emptyAnswer: AnswerFormData = {
  answer: '',
  is_correct: false,
};

interface Props {
  form: UseFormReturn<IUpdModalExperienceBeerMasterFormData, any>;
  questionIndex: number;
  questionId: string;
}

export default function UpdBeerMasterAnswers({
  form,
  questionIndex,
  questionId,
}: Props) {
  const t = useTranslations();

  const { supabase } = useAuth();

  const {
    control,
    getValues,
    formState: { errors },
  } = form;

  const queryClient = useQueryClient();

  const { fields, append, remove } = useFieldArray({
    name: `questions.${questionIndex}.question.answers`,
    control,
  });

  const handleAddAnswer = () => {
    append(emptyAnswer);
  };

  /**
   * - If the answer is saved in the database, we remove it from the database
   * - If the answer is not saved in the database, we remove it from the form
   * @param answerIndex
   * @returns
   */
  const handleRemoveAnswer = async (answerId: string) => {
    if (answerId) {
      const { error } = await supabase
        .from('beer_master_answers')
        .delete()
        .eq('id', answerId);

      if (error) {
        console.error('error', error);
        return;
      }
    }

    // Encuentra el índice basado en el id para eliminar
    const currentValues = getValues(
      `questions.${questionIndex}.question.answers`,
    );
    const indexToRemove = currentValues.findIndex(
      (item) => item.id === answerId,
    );

    if (indexToRemove > -1) {
      remove(indexToRemove);
      setTimeout(() => {
        queryClient.invalidateQueries('experiences');
      }, 300);
    }
  };

  console.log(fields);

  return (
    <>
      {fields.map((field, index) => (
        <>
          <section
            key={field.id}
            className="grid grid-cols-12 space-x-2 items-end"
          >
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
              <DeleteButton
                onClick={() =>
                  handleRemoveAnswer(
                    getValues(
                      `questions.${questionIndex}.question.answers.${index}.id`,
                    ) as string,
                  )
                }
              />
            </div>
          </section>

          {/* Error input displaying */}
          {errors.questions &&
            errors.questions[questionIndex] &&
            errors.questions[questionIndex]?.question?.answers &&
            errors.questions[questionIndex]?.question?.answers?.[index]
              ?.answer && (
              <DisplayInputError
                message={
                  errors.questions[questionIndex]?.question?.answers?.[index]!
                    .message
                }
              />
            )}
        </>
      ))}

      <div className="grid grid-cols-1 space-y-4 space-x-0 sm:space-y-0 sm:grid-cols-2 sm:space-x-4">
        <Button
          small
          onClick={handleAddAnswer}
          class="col-span-2 sm:col-span-1"
        >
          {t('add_answer')}
        </Button>
      </div>
    </>
  );
}
