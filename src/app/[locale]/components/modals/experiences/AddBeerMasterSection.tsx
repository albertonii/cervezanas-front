import InputLabel from '../../common/InputLabel';
import BeerMasterAnswers from './AddBeerMasterAnswers';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  IAddModalExperienceBeerMasterFormData,
  IAddBeerMasterQuestionFormData,
  IProduct,
} from '../../../../../lib/types';
import { DeleteButton } from '../../common/DeleteButton';
import Button from '../../common/Button';
import SelectInput from '../../common/SelectInput';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import { useEffect, useState } from 'react';

const emptyQuestion: IAddBeerMasterQuestionFormData = {
  question: '',
  answers: [],
  product_id: '',
};

interface Props {
  form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
}

export const BeerMasterSection = ({ form }: Props) => {
  const t = useTranslations();
  const { control } = form;

  const { user } = useAuth();

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
      <SelectInput
        form={form}
        label={'product_id'}
        labelText={t('product')}
        options={listProducts}
      />

      {fields.map((field, index) => (
        <fieldset
          key={field.id}
          className="relative flex-auto space-y-4 pt-6 mt-4 rounded-md border-2 border-dotted border-beer-softBlondeBubble p-4"
        >
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
          <BeerMasterAnswers form={form} index={index} />
        </fieldset>
      ))}

      <Button class="" primary medium onClick={() => handleAddQuestion()}>
        {t('question_add')}
      </Button>
    </section>
  );
};
