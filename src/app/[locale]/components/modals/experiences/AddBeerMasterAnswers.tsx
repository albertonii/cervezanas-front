import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IAddModalExperienceBeerMasterFormData,
  IAddBeerMasterAnswerFormData,
} from '../../../../../lib/types';
import InputLabel from '../../common/InputLabel';
import { DeleteButton } from '../../common/DeleteButton';
import { Button } from '../../common/Button';
import { useTranslations } from 'next-intl';

const emptyAnswer: IAddBeerMasterAnswerFormData = {
  answer: '',
  is_correct: false,
};

interface Props {
  form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
  index: number;
}

export default function AddBeerMasterAnswers({
  form,
  index: questionIndex,
}: Props) {
  const t = useTranslations();

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: `questions.${questionIndex}.answers`,
    control,
  });

  const handleAddAnswer = () => {
    append(emptyAnswer);
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

      <Button small onClick={handleAddAnswer}>
        {t('add_answer')}
      </Button>
    </>
  );
}
