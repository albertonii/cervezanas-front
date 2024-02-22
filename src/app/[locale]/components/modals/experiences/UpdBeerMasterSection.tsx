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
import Button from '../../common/Button';
import SelectInput from '../../common/SelectInput';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useQueryClient } from 'react-query';

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
  const { user, supabase } = useAuth();

  const [productInputValue, setProductInputValue] = useState<{
    label: string;
    value: any;
  }>();

  const { control, getValues } = form;
  const queryClient = useQueryClient();
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

  useEffect(() => {
    if (listProducts.length > 0) {
      // Como todo el grupo de preguntas tendrán el mismo product_id puedo sacarlo de cualquiera de ellos
      const updProductId = getValues('questions.0.product_id');

      // Recorrer el listado de productos y poner a setProductInputProduct el producto que coincida con su ID
      const productValue = listProducts.find(
        (product) => product.value === updProductId,
      );

      setProductInputValue(productValue);
    }
  }, [listProducts]);

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

  const handleAddQuestion = () => {
    append(emptyQuestion);
  };

  const handleRemoveQuestion = async (index: number) => {
    const deleteQuestionId = getValues(`questions.${index}.id`);

    if (!deleteQuestionId) return;

    const { error } = await supabase
      .from('beer_master_questions')
      .delete()
      .eq('id', deleteQuestionId);

    if (error) {
      console.log('error', error);
    } else {
      remove(index);
      // Update the questions list
      form.setValue('questions', fields);

      queryClient.invalidateQueries('experiences');
    }
  };

  /**
   * All the questions will have the same product_id, so we can set it to all of them
   * @param product_id
   */
  const handleSelectProduct = (product_id: string) => {
    fields.forEach((field, index) => {
      form.setValue(`questions.${index}.product_id`, product_id);
    });
  };

  return (
    <section id="Question" className="space-y-4">
      <div className="w-full">
        <label htmlFor={'product_id'} className="flex text-sm text-gray-600">
          {t('product')}
        </label>

        <select
          id={'product'}
          className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          onChange={(e) => handleSelectProduct(e.target.value)}
        >
          {listProducts.length > 0 &&
            listProducts.map((option) => (
              <option
                key={option.value}
                value={option.value}
                selected={productInputValue?.value === option.value}
              >
                {t(option.label)}
              </option>
            ))}
        </select>
      </div>

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
