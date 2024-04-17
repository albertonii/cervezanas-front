import Button from '../../common/Button';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { IProduct } from '../../../../../lib/types/types';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
    IAddModalExperienceBeerMasterFormData,
    IAddBeerMasterQuestionFormData,
    Difficulty,
    AnswerFormData,
} from '../../../../../lib/types/quiz';
import BMQuestionItem from './BMQuestionItem';

interface Props {
    form: UseFormReturn<IAddModalExperienceBeerMasterFormData, any>;
}

export const AddBeerMasterQuestions = ({ form }: Props) => {
    const t = useTranslations();

    // Usar un array de errores para saber cual es el error de la respuesta correcta
    const [displayAnswerIsCorrectError, setDisplayAnswerIsCorrectError] =
        useState<boolean>(false);

    const { control } = form;

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

    const handleAddQuestion = () => {
        if (fields.length > 0) {
            const index = fields.length - 1;
            const answers = fields[index].question.answers;
            const hasIsCorrectAnswerMarked = validateCorrectAnswers(answers);

            if (!hasIsCorrectAnswerMarked) {
                setDisplayAnswerIsCorrectError(true);
                return;
            }

            setDisplayAnswerIsCorrectError(false);
        }

        const emptyQuestion: IAddBeerMasterQuestionFormData = {
            question: {
                category: 'BEER',
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
                <label
                    htmlFor={'product_id'}
                    className="flex text-sm text-gray-600"
                >
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
                                selected={
                                    productInputValue?.value === option.value
                                }
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
                    <BMQuestionItem
                        questionIndex={questionIndex}
                        form={form}
                        fields={fields}
                        remove={remove}
                        questionIdRemove={question.id}
                        displayAnswerIsCorrectError={
                            displayAnswerIsCorrectError
                        }
                    />
                </fieldset>
            ))}

            <Button class="" primary medium onClick={handleAddQuestion}>
                {t('question_add')}
            </Button>
        </section>
    );
};

// Función para validar que al menos una respuesta esté marcada como correcta
const validateCorrectAnswers = (answers: AnswerFormData[]) => {
    const correctAnswerCount = answers.filter(
        (answer: AnswerFormData) => answer.is_correct,
    ).length;
    return correctAnswerCount > 0 ? true : false;
};
