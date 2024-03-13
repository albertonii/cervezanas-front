import React from 'react';
import Button from '../../common/Button';
import InputLabel from '../../common/InputLabel';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { AnswerFormData } from '../../../../../lib/types/quiz';
import { DeleteButton } from '../../common/DeleteButton';
import { useTranslations } from 'next-intl';
import { DisplayInputError } from '../../common/DisplayInputError';
import { IAddModalExperienceBeerMasterFormData } from '../../../../../lib/types/quiz';

const emptyAnswer: AnswerFormData = {
  answer: '',
  is_correct: false,
};

interface Props {
  form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
  questionIndex: number;
}

export default function AddBeerMasterAnswersNew({
  form,
  questionIndex,
}: Props) {
  const t = useTranslations();

  const {
    control,
    formState: { errors },
  } = form;

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
    // Encuentra el índice basado en el id para eliminar
    const indexToRemove = fields.findIndex((item) => item.id === answerId);

    if (indexToRemove > -1) {
      remove(indexToRemove);
    }
  };

  return (
    <>
      {fields.map((answer, index) => (
        <>
          <section
            key={answer.id}
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
              <DeleteButton onClick={() => handleRemoveAnswer(answer.id)} />
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
        <Button small onClick={handleAddAnswer}>
          {t('add_answer')}
        </Button>
      </div>
    </>
  );
}
