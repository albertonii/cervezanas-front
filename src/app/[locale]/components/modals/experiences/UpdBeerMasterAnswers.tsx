import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IUpdBeerMasterAnswerFormData,
  IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types';
import InputLabel from '../../common/InputLabel';
import { DeleteButton } from '../../common/DeleteButton';
import Button from '../../common/Button';
import { useTranslations } from 'next-intl';

interface Props {
  form: UseFormReturn<IUpdModalExperienceBeerMasterFormData, any>;
  index: number;
  questionId: string;
}

export default function UpdBeerMasterAnswers({
  form,
  index: questionIndex,
  questionId,
}: Props) {
  const t = useTranslations();

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: `questions.${questionIndex}.answers`,
    control,
  });

  const handleAddAnswer = () => {
    append({ answer: '', is_correct: false, question_id: questionId });
  };

  return (
    <>
      {fields.map((field, index) => (
        <section
          key={field.id}
          className="grid grid-cols-12 space-x-2 items-end"
        >
          <InputLabel
            inputType="checkbox"
            form={form}
            label={`questions.${questionIndex}.answers.${index}.is_correct`}
            labelText={' '}
          />

          <div className="col-span-10 ">
            <InputLabel
              form={form}
              label={`questions.${questionIndex}.answers.${index}.answer`}
              labelText={`${t('answer')} ${index + 1}`}
              registerOptions={{ required: true }}
              placeholder="Answer text"
            />
          </div>

          <div className="justify-center items-center">
            <DeleteButton onClick={() => remove(index)} />
          </div>
        </section>
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
