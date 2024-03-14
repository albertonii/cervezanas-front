'use client';

import ModalWithForm from '../ModalWithForm';
import UpdExperienceBasicForm from '../../../(roles)/producer/profile/experiences/UpdExperienceBasicForm';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { string, z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdBeerMasterQuestions } from './UpdBeerMasterQuestions';
import {
    Difficulty,
    IExperience,
    IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types/quiz';
import { shuffleArray } from '../../../../../utils/utils';

const difficulties = z.union([
    z.literal(Difficulty.EASY),
    z.literal(Difficulty.MEDIUM),
    z.literal(Difficulty.HARD),
]);

const schemaBeerMaster: ZodType<IUpdModalExperienceBeerMasterFormData> =
    z.object({
        id: string().nonempty({ message: 'errors.input_required' }),
        producer_id: string().nonempty({ message: 'errors.input_required' }),
        name: z.string().nonempty({ message: 'errors.input_required' }),
        description: z.string().nonempty({ message: 'errors.input_required' }),
        type: z.string().nonempty({ message: 'errors.input_required' }),
        price: z.number().min(0),
        questions: z.array(
            z.object({
                id: z.string().optional(),
                experience_id: z
                    .string()
                    .nonempty({ message: 'errors.input_required' }),
                question: z.object({
                    category: z.string().optional(),
                    difficulty: difficulties,
                    question: z
                        .string()
                        .nonempty({ message: 'errors.input_required' }),
                    type: z
                        .string()
                        .nonempty({ message: 'errors.input_required' }),
                    answers: z.array(
                        z.object({
                            answer: z
                                .string()
                                .nonempty({ message: 'errors.input_required' }),
                            is_correct: z.boolean(),
                        }),
                    ),
                }),
                product_id: z
                    .string()
                    .nonempty({ message: 'errors.input_required' }),
            }),
        ),
    });

type ValidationSchema = z.infer<typeof schemaBeerMaster>;

interface Props {
    selectedExperience: IExperience;
    isEditModal: boolean;
    handleEditModal: ComponentProps<any>;
}

export default function UpdateBeerMasterExperienceModal({
    selectedExperience,
    isEditModal,
    handleEditModal,
}: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const [isBeerMasterExperience, setIsBeerMasterExperience] =
        useState<boolean>(true);

    const queryClient = useQueryClient();

    const bmQuestions = selectedExperience.bm_questions?.map((q) => {
        return {
            id: q.id,
            experience_id: q.experience_id,
            product_id: q.product_id,
            question: {
                category: q.category,
                difficulty: q.difficulty,
                question: q.question,
                type: q.type,
                answers: [q.correct_answer, ...q.incorrect_answers].map((a) => {
                    return {
                        answer: a,
                        is_correct: a === q.correct_answer,
                    };
                }),
            },
        };
    });

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schemaBeerMaster),
        defaultValues: {
            id: selectedExperience.id,
            name: selectedExperience.name,
            description: selectedExperience.description,
            type: selectedExperience.type,
            price: selectedExperience.price,
            producer_id: selectedExperience.producer_id,
            questions: bmQuestions,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    const handleUpdateBeerMasterExperience = async (form: ValidationSchema) => {
        const { name, description, type, questions } = form;

        // Update experience
        const { data: experience, error: experienceError } = await supabase
            .from('experiences')
            .update({
                name,
                description,
                type,
            })
            .eq('id', form.id)
            .select()
            .single();

        if (!experience) {
            return;
        }

        if (experienceError) {
            throw experienceError;
        }

        // Update questions and answers
        questions.forEach(async (q) => {
            // Update question if it exists
            if (q.id) {
                // Correct answer
                const correctAnswer: string =
                    q.question.answers.find((a) => a.is_correct)?.answer || '';

                // Array list with incorrect answers
                const incorrectAnswers: string[] = q.question.answers
                    .filter((a) => !a.is_correct)
                    .map((a) => a.answer);

                const { error: questionError } = await supabase
                    .from('bm_questions')
                    .update({
                        id: q.id,
                        question: q.question.question,
                        experience_id: experience.id,
                        product_id: q.product_id,
                        correct_answer: correctAnswer,
                        incorrect_answers: incorrectAnswers,
                        difficulty: q.question.difficulty,
                        category: q.question.category,
                        type: q.question.type,
                    })
                    .eq('id', q.id)
                    .select('id')
                    .single();

                if (questionError) {
                    throw questionError;
                }

                // question.answers.forEach(async (answer) => {
                //   const { error: answerError } = await supabase
                //     .from('beer_master_answers')
                //     .upsert({
                //       answer: answer.answer,
                //       is_correct: answer.is_correct,
                //       question_id: question.id,
                //       id: answer.id,
                //     });

                //   if (answerError) {
                //     console.error(answerError);
                //     throw answerError;
                //   }
                // });
            }

            // Insert question if it doesn't exist
            if (!q.id) {
                // Correct answer
                const correctAnswer: string =
                    q.question.answers.find((a) => a.is_correct)?.answer || '';

                // Array list with incorrect answers
                const incorrectAnswers: string[] = q.question.answers
                    .filter((a) => !a.is_correct)
                    .map((a) => a.answer);

                const { data: questionData, error: questionError } =
                    await supabase
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
                        .select('id')
                        .single();

                if (!questionData) {
                    return;
                }

                if (questionError) {
                    throw questionError;
                }

                // question.answers.forEach(async (answer) => {
                //   const { error: answerError } = await supabase
                //     .from('beer_master_answers')
                //     .insert({
                //       answer: answer.answer,
                //       is_correct: answer.is_correct,
                //       question_id: questionData.id,
                //     });

                //   if (answerError) {
                //     console.error(answerError);
                //     throw answerError;
                //   }
                // });
            }
        });

        handleEditModal(false);
        reset();
        setTimeout(() => {
            queryClient.invalidateQueries('experiences');
        }, 300);
    };

    const updateExperienceMutation = useMutation({
        mutationKey: 'insertExperience',
        mutationFn: handleUpdateBeerMasterExperience,
        onSuccess: () => {},
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: IUpdModalExperienceBeerMasterFormData,
    ) => {
        try {
            updateExperienceMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ModalWithForm
            showModal={isEditModal}
            setShowModal={handleEditModal}
            title={'update_experience'}
            btnTitle={'save'}
            description={''}
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            <form>
                <UpdExperienceBasicForm
                    form={form}
                    setIsBeerMasterExperience={setIsBeerMasterExperience}
                />

                {/* List of Q&A for Beer Master Experience  */}
                {isBeerMasterExperience && (
                    <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
                        <legend className="text-2xl">
                            {t('questions_and_answers_experience')}
                        </legend>

                        <UpdBeerMasterQuestions
                            form={form}
                            experienceId={selectedExperience.id}
                        />
                    </fieldset>
                )}
            </form>
        </ModalWithForm>
    );
}
