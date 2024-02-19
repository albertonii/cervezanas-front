import InputLabel from '../../common/InputLabel';
import UpdBeerMasterAnswers from './UpdBeerMasterAnswers';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IProduct,
  IUpdBeerMasterQuestionFormData,
  IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types';
import { DeleteButton } from '../../common/DeleteButton';
import { Button } from '../../common/Button';
import SelectInput from '../../common/SelectInput';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../(auth)/Context/useAuth';

enum ExperienceTypes {
  beer_master = 'beer_master',
  blind_tasting = 'bling_tasting',
}

export const experience_options: {
  label: string;
  value: ExperienceTypes;
}[] = [
  { label: 'beer_master', value: ExperienceTypes.beer_master },
  { label: 'blind_tasting', value: ExperienceTypes.blind_tasting },
];

const emptyQuestion: IUpdBeerMasterQuestionFormData = {
  question: '',
  answers: [],
  experience_id: '',
  product_id: '',
};

interface Props {
  form: UseFormReturn<IUpdModalExperienceBeerMasterFormData, any>;
}

export const UpdBeerMasterSection = ({ form }: Props) => {
  const t = useTranslations();
  const { user } = useAuth();

  const { control, getValues } = form;
  const questionId = getValues('id');

  const { data } = useFetchProductsByOwner(user?.id);

  const [listProducts, setListProducts] = useState<
    { label: string; value: any }[]
  >([]);

  useEffect(() => {
    if (data) {
      setListProducts(
        data?.map((product: IProduct) => ({
          label: product.name,
          value: product.id,
        })),
      );
    }
  }, [data]);

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
        <fieldset
          key={field.id}
          className="relative flex-auto space-y-4 pt-6 mt-4 rounded-md border-2 border-dotted border-beer-softBlondeBubble p-4"
        >
          <SelectInput
            form={form}
            label={'product_id'}
            options={listProducts}
            defaultValue={field.product_id}
          />

          <div className="flex flex-row items-end">
            <InputLabel
              form={form}
              label={`questions.${index}.question`}
              labelText={`${index + 1} ${t('question')}`}
              registerOptions={{
                required: true,
              }}
              placeholder={t('input_questions_question_placeholder')}
            />

            <div className="ml-4">
              <DeleteButton onClick={() => handleRemoveQuestion(index)} />
            </div>
          </div>

          {/* Multiple inputs that are the possible answers to the question */}
          <UpdBeerMasterAnswers
            form={form}
            index={index}
            questionId={questionId}
          />
        </fieldset>
      ))}

      <Button class="" primary medium onClick={() => handleAddQuestion()}>
        {t('question_add')}
      </Button>
    </section>
  );
};
