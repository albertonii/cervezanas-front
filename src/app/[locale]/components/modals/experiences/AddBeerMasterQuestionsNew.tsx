import InputLabel from '../../common/InputLabel';
import Button from '../../common/Button';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import SelectInput from '../../common/SelectInput';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import { DeleteButton } from '../../common/DeleteButton';
import { useEffect, useState } from 'react';
import { DisplayInputError } from '../../common/DisplayInputError';
import {
  IAddModalExperienceBeerMasterFormData,
  IAddBeerMasterQuestionFormData,
  Difficulty,
} from '../../../../../lib/types/quiz';
import AddBeerMasterAnswersNew from './AddBeerMasterAnswersNew';

interface Props {
  form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
}

export const AddBeerMasterQuestionsNew = ({ form }: Props) => {
  const t = useTranslations();
  const {
    control,
    formState: { errors },
  } = form;

  const { user } = useAuth();

  const { data } = useFetchProductsByOwner(user?.id);

  const [productInputValue, setProductInputValue] = useState<{
    label: string;
    value: any;
  }>();

  const [listProducts, setListProducts] = useState<
    { label: string; value: any }[]
  >([]);

  const { fields, append, remove } = useFieldArray({
    name: 'questions',
    control,
  });

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
      setProductInputValue(listProducts[0].value);
    }
  }, [listProducts]);

  const handleRemoveQuestion = (index: number) => {
    remove(index);
  };

  const handleAddQuestion = () => {
    const emptyQuestion: IAddBeerMasterQuestionFormData = {
      question: {
        category: 'beer',
        difficulty: Difficulty.MEDIUM,
        question: '',
        type: 'multiple',
        answers: [],
      },
      product_id: listProducts[0].value,
    };

    append(emptyQuestion);
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
      {/* Select input for the product */}
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

      {fields.map((question, questionIndex) => (
        <fieldset
          key={question.id}
          className="relative flex-auto space-y-4 pt-6 mt-4 rounded-md border-2 border-dotted border-beer-softBlondeBubble p-4"
        >
          <div className="flex flex-row items-end space-x-4">
            <InputLabel
              form={form}
              label={`questions.${questionIndex}.question.question`}
              labelText={`${questionIndex + 1} ${t('question')}`}
              registerOptions={{
                required: true,
              }}
              placeholder={t('input_questions_question_placeholder')}
            />

            <SelectInput
              form={form}
              options={[
                { label: 'easy', value: 'easy' },
                { label: 'medium', value: 'medium' },
                { label: 'hard', value: 'hard' },
              ]}
              label={`questions.${questionIndex}.question.difficulty`}
              labelText={`difficulty`}
              registerOptions={{
                required: true,
              }}
            />

            <DeleteButton onClick={() => handleRemoveQuestion(questionIndex)} />
          </div>

          {/* Error input displaying */}
          {errors.questions &&
            errors.questions[questionIndex] &&
            errors.questions[questionIndex]?.question && (
              <DisplayInputError
                message={errors.questions[questionIndex]?.question!.message}
              />
            )}

          {/* Multiple inputs that are the possible answers to the question */}
          <AddBeerMasterAnswersNew form={form} questionIndex={questionIndex} />
        </fieldset>
      ))}

      <Button class="" primary medium onClick={() => handleAddQuestion()}>
        {t('question_add')}
      </Button>
    </section>
  );
};
