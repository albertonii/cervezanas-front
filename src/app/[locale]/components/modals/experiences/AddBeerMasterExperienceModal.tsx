'use client';

import ModalWithForm from '../ModalWithForm';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import AddExperienceBasicForm, {
    experience_options,
} from '../../../(roles)/producer/profile/experiences/AddExperienceBasicForm';
import { AddBeerMasterQuestions } from './AddBeerMasterQuestions';
import {
    Difficulty,
    IAddModalExperienceBeerMasterFormData,
} from '@/lib//types/quiz';
import { DisplayInputError } from '../../common/DisplayInputError';
import Spinner from '../../common/Spinner';

const difficulties = z.union([
    z.literal(Difficulty.EASY),
    z.literal(Difficulty.MEDIUM),
    z.literal(Difficulty.HARD),
]);

const schemaBeerMaster: ZodType<IAddModalExperienceBeerMasterFormData> =
    z.object({
        name: z.string().nonempty({ message: 'errors.input_required' }),
        description: z.string().nonempty({ message: 'errors.input_required' }),
        type: z.string().nonempty({ message: 'errors.input_required' }),
        price: z.number().min(0),
        questions: z
            .array(
                z.object({
                    product_id: z
                        .string()
                        .nonempty({ message: 'errors.input_required' }),
                    question: z.object({
                        category: z
                            .string()
                            .nonempty({ message: 'errors.input_required' }),
                        difficulty: difficulties,
                        question: z
                            .string()
                            .nonempty({ message: 'errors.input_required' }),
                        type: z
                            .string()
                            .nonempty({ message: 'errors.input_required' }),
                        answers: z
                            .array(
                                z.object({
                                    answer: z.string().nonempty({
                                        message: 'errors.input_required',
                                    }),
                                    is_correct: z.boolean(),
                                }),
                            )
                            .refine(
                                (answers) => {
                                    // Ensure at least one answer is marked as correct
                                    return answers.some(
                                        (answer: any) => answer.is_correct,
                                    );
                                },
                                {
                                    message:
                                        'At least one answer must be marked as correct',
                                },
                            ),
                    }),
                }),
            )
            .refine(
                (questions) => {
                    // Ensure at least one question is added
                    return questions.length > 0;
                },
                {
                    message: 'At least one question must be added',
                },
            ),
    });

type ValidationSchema = z.infer<typeof schemaBeerMaster>;

export default function AddBeerMasterExperienceModal() {
    const t = useTranslations();
    const { supabase, user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isBeerMasterExperience, setIsBeerMasterExperience] =
        useState<boolean>(true);

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schemaBeerMaster),
        defaultValues: {
            name: 'Experiencia Maestro Cervecero',
            description:
                'Una experiencia única que podrás configurar en tus puntos de consumo.',
            type: experience_options[0].label,
            questions: [],
            price: 0,
        },
    });
    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const handleInsertBeerMasterExperience = async (form: ValidationSchema) => {
        setIsLoading(true);

        const { name, description, type, questions, price } = form;

        // Create experience
        const { data: experience, error: experienceError } = await supabase
            .from('experiences')
            .insert({
                name,
                description,
                type,
                producer_id: user?.id,
                price,
            })
            .select()
            .single();

        if (!experience) {
            setIsLoading(false);
            return;
        }

        if (experienceError) {
            setIsLoading(false);
            throw experienceError;
        }

        // Insert questions and answers
        questions.forEach(async (q) => {
            // Correct answer
            const correctAnswer: string =
                q.question.answers.find((a) => a.is_correct)?.answer || '';

            // Array list with incorrect answers
            const incorrectAnswers: string[] = q.question.answers
                .filter((a) => !a.is_correct)
                .map((a) => a.answer);

            const { data: questionData, error: questionError } = await supabase
                .from('bm_questions')
                .insert({
                    question: q.question.question,
                    experience_id: experience.id,
                    product_id: q.product_id,
                    correct_answer: correctAnswer,
                    incorrect_answers: incorrectAnswers,
                    difficulty: q.question.difficulty,
                    category: q.question.category,
                    type: q.question.type,
                })
                .select()
                .single();

            if (!questionData) {
                setIsLoading(false);
                return;
            }

            if (questionError) {
                setIsLoading(false);
                throw questionError;
            }
        });

        reset();
        setIsLoading(false);
        queryClient.invalidateQueries('experiences');
        setShowModal(false);
    };

    const insertExperienceMutation = useMutation({
        mutationKey: 'insertExperience',
        mutationFn: handleInsertBeerMasterExperience,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: IAddModalExperienceBeerMasterFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertExperienceMutation.mutate(formValues, {
                onSuccess: () => {
                    resolve();
                },
                onError: (error) => {
                    reject(error);
                },
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_new_experience'}
            btnTitle={'save'}
            triggerBtnTitle={'new_experience'}
            description={''}
            classIcon={''}
            classContainer={`${isLoading && ' opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            {isLoading ? (
                <div className="h-[50vh]">
                    <Spinner
                        size="xxLarge"
                        color="beer-blonde"
                        absolutePosition="center"
                        absolute
                    />
                </div>
            ) : (
                <form>
                    <AddExperienceBasicForm
                        form={form}
                        setIsBeerMasterExperience={setIsBeerMasterExperience}
                    />

                    {/* List of Q&A for Beer Master Experience  */}
                    {isBeerMasterExperience && (
                        <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                            <legend className="text-2xl">
                                {t('questions_and_answers_experience')}
                            </legend>

                            {errors.questions && (
                                <DisplayInputError
                                    message={errors.questions?.message}
                                />
                            )}

                            {errors.questions?.root && (
                                <DisplayInputError
                                    message={errors.questions?.root.message}
                                />
                            )}

                            <AddBeerMasterQuestions form={form} />
                        </fieldset>
                    )}
                </form>
            )}
        </ModalWithForm>
    );
}
