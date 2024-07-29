import InputLabel from '../../common/InputLabel';
import UpdBeerMasterAnswers from './UpdBeerMasterAnswers';
import Button from '../../common/Button';
import useFetchProductsByOwner from '../../../../../hooks/useFetchProductsByOwner';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { IProduct } from '@/lib//types/types';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { DeleteButton } from '../../common/DeleteButton';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { DisplayInputError } from '../../common/DisplayInputError';
import {
    Difficulty,
    IUpdBeerMasterQuestionFormData,
    IUpdModalExperienceBeerMasterFormData,
} from '@/lib//types/quiz';
import SelectInput from '../../common/SelectInput';
import { Type } from '@/lib//productEnum';

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

interface Props {
    form: UseFormReturn<IUpdModalExperienceBeerMasterFormData, any>;
    experienceId: string;
}

export const UpdBeerMasterQuestions = ({ form, experienceId }: Props) => {
    const t = useTranslations();
    const { user, supabase } = useAuth();

    const [productInputValue, setProductInputValue] = useState<{
        label: string;
        value: any;
    }>();

    const {
        control,
        getValues,
        formState: { errors },
    } = form;

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
        const emptyQuestion: IUpdBeerMasterQuestionFormData = {
            question: {
                category: Type.BEER,
                difficulty: Difficulty.MEDIUM,
                question: '',
                type: 'multiple',
                answers: [],
            },
            product_id: listProducts[0].value,
            experience_id: experienceId,
        };

        append(emptyQuestion);
    };

    /**
     * Delete questions and answers from the database
     * Remove the question from the form
     * @param index
     * @returns
     */
    const handleRemoveQuestion = async (index: number, questionId: string) => {
        const deleteQuestionId = getValues(`questions.${index}.id`);

        if (deleteQuestionId) {
            const { error } = await supabase
                .from('bm_questions')
                .delete()
                .eq('id', deleteQuestionId);

            if (error) {
                console.error('error', error);
            }
        }

        remove(index);

        setTimeout(() => {
            queryClient.invalidateQueries('experiences');
        }, 300);
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
                    <div className="flex flex-row items-end space-x-4">
                        <InputLabel
                            form={form}
                            label={`questions.${questionIndex}.question.question`}
                            labelText={`${questionIndex + 1} ${t('question')}`}
                            registerOptions={{
                                required: true,
                            }}
                            placeholder={t(
                                'input_questions_question_placeholder',
                            )}
                        />

                        <SelectInput
                            form={form}
                            options={[
                                { label: 'easy', value: 'easy' },
                                { label: 'medium', value: 'medium' },
                                { label: 'hard', value: 'hard' },
                            ]}
                            label={`questions.${questionIndex}.question.difficulty`}
                            labelText={`${'difficulty'}`}
                            registerOptions={{
                                required: true,
                            }}
                        />

                        <div className="ml-4">
                            <DeleteButton
                                onClick={() =>
                                    handleRemoveQuestion(
                                        questionIndex,
                                        question.id,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Error input displaying */}
                    {errors.questions &&
                        errors.questions[questionIndex] &&
                        errors.questions[questionIndex]?.question && (
                            <DisplayInputError
                                message={
                                    errors.questions[questionIndex]?.question!
                                        .message
                                }
                            />
                        )}

                    {/* Multiple inputs that are the possible answers to the question */}
                    <UpdBeerMasterAnswers
                        form={form}
                        questionIndex={questionIndex}
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
