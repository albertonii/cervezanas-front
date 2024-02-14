import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IAddModalExperienceBeerMasterFormData,
  IBeerMasterAnswer,
  IBeerMasterAnswerFormData,
  IBeerMasterQuestion,
  IBeerMasterQuestionFormData,
} from '../../../../../lib/types';
import InputLabel from '../../common/InputLabel';
import { DeleteButton } from '../../common/DeleteButton';
import { Button } from '../../common/Button';

const emptyQuestion: IBeerMasterQuestionFormData = {
  question: '',
  experience_id: '',
  product_id: '',
  answers: [],
};

const emptyAnswer: IBeerMasterAnswerFormData = {
  answer: '',
  is_correct: false,
};

interface Props {
  form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
}

export const BeerMasterSection = ({ form }: Props) => {
  const { control } = form;

  const t = useTranslations();

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

  const handleRemoveQuestion = (index: number) => {
    remove(index);
  };

  const handleAddQuestion = () => {
    append(emptyQuestion);
  };

  return (
    <section id="Question" className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="relative flex-auto space-y-4 pt-6">
          <div className="flex flex-row items-end">
            <InputLabel
              form={form}
              label={`questions.${index}.name`}
              labelText={`${index + 1} ${t('name')}`}
              registerOptions={{
                required: true,
              }}
              placeholder={t('input_product_question_name_placeholder')}
            />

            <div className="ml-4">
              <DeleteButton onClick={() => handleRemoveQuestion(index)} />
            </div>
          </div>

          <InputLabel
            form={form}
            label={`questions.${index}.description`}
            labelText={'description'}
            registerOptions={{
              required: true,
            }}
            placeholder={t('description')}
          />

          <InputLabel
            form={form}
            label={`questions.${index}.year`}
            labelText={'year'}
            registerOptions={{
              required: true,
              valueAsNumber: true,
            }}
            placeholder={t('input_product_question_year_placeholder')}
            inputType="number"
            defaultValue={2021}
          />
        </div>
      ))}

      <Button class="" primary medium onClick={() => handleAddQuestion()}>
        {t('modal_question_add')}
      </Button>
    </section>
  );
};
