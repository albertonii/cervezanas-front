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
import { AddBeerMasterQuestionsNew } from './AddBeerMasterQuestionsNew';
import {
  Difficulty,
  IAddModalExperienceBeerMasterFormData,
} from '../../../../../lib/types/quiz';

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
    questions: z.array(
      z.object({
        product_id: z.string().nonempty({ message: 'errors.input_required' }),
        question: z.object({
          category: z.string().nonempty({ message: 'errors.input_required' }),
          difficulty: difficulties,
          question: z.string().nonempty({ message: 'errors.input_required' }),
          type: z.string().nonempty({ message: 'errors.input_required' }),
          answers: z.array(
            z.object({
              answer: z.string().nonempty({ message: 'errors.input_required' }),
              is_correct: z.boolean(),
            }),
          ),
        }),
      }),
    ),
  });

type ValidationSchema = z.infer<typeof schemaBeerMaster>;

export default function AddBeerMasterExperienceModalNew() {
  const t = useTranslations();
  const { supabase, user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isBeerMasterExperience, setIsBeerMasterExperience] =
    useState<boolean>(true);

  const queryClient = useQueryClient();

  const form = useForm<ValidationSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(schemaBeerMaster),
    defaultValues: {
      name: '',
      description: '',
      type: experience_options[0].label,
      questions: [],
    },
  });
  const { handleSubmit, reset } = form;

  const handleInsertBeerMasterExperience = async (form: ValidationSchema) => {
    const { name, description, type, questions } = form;

    // Create experience
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .insert({
        name,
        description,
        type,
        producer_id: user?.id,
      })
      .select()
      .single();

    if (!experience) {
      return;
    }

    if (experienceError) {
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
        return;
      }

      if (questionError) {
        throw questionError;
      }
    });

    reset();
  };

  const insertExperienceMutation = useMutation({
    mutationKey: 'insertExperience',
    mutationFn: handleInsertBeerMasterExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setShowModal(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: IAddModalExperienceBeerMasterFormData,
  ) => {
    try {
      insertExperienceMutation.mutate(formValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={'add_new_experience'}
      btnTitle={'new_experience'}
      description={''}
      classIcon={''}
      classContainer={''}
      handler={handleSubmit(onSubmit)}
      form={form}
    >
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

            <AddBeerMasterQuestionsNew form={form} />
          </fieldset>
        )}
      </form>
    </ModalWithForm>
  );
}
