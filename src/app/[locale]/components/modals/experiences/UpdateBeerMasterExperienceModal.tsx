'use client';

import ModalWithForm from '../ModalWithForm';
import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IExperience,
  IUpdModalExperienceBeerMasterFormData,
} from '../../../../../lib/types';
import { useAuth } from '../../../Auth/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { string, z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdBeerMasterSection } from './UpdBeerMasterSection';
import UpdExperienceBasicForm from '../../../(roles)/producer/profile/experiences/UpdExperienceBasicForm';

const schemaBeerMaster: ZodType<IUpdModalExperienceBeerMasterFormData> =
  z.object({
    id: string().nonempty({ message: 'errors.input_required' }),
    producer_id: string().nonempty({ message: 'errors.input_required' }),
    name: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    type: z.string().nonempty({ message: 'errors.input_required' }),
    questions: z.array(
      z.object({
        id: z.string().nonempty({ message: 'errors.input_required' }),
        experience_id: z
          .string()
          .nonempty({ message: 'errors.input_required' }),
        question: z.string().nonempty({ message: 'errors.input_required' }),
        answers: z.array(
          z.object({
            id: z.string().optional(),
            answer: z.string().nonempty({ message: 'errors.input_required' }),
            is_correct: z.boolean(),
            question_id: z
              .string()
              .nonempty({ message: 'errors.input_required' }),
          }),
        ),
        product_id: z.string().nonempty({ message: 'errors.input_required' }),
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

  const form = useForm<ValidationSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(schemaBeerMaster),
    defaultValues: {
      id: selectedExperience.id,
      name: selectedExperience.name,
      description: selectedExperience.description,
      type: selectedExperience.type,
      producer_id: selectedExperience.producer_id,
      questions: selectedExperience.bm_questions,
    },
  });

  const { handleSubmit, reset } = form;

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
    questions.forEach(async (question) => {
      const { data: questionData, error: questionError } = await supabase
        .from('beer_master_questions')
        .update({
          question: question.question,
          experience_id: experience.id,
        })
        .eq('id', question.id)
        .select()
        .single();

      if (!questionData) {
        return;
      }

      if (questionError) {
        throw questionError;
      }

      question.answers.forEach(async (answer) => {
        const { data: answerData, error: answerError } = await supabase
          .from('beer_master_answers')
          .upsert({
            answer: answer.answer,
            is_correct: answer.is_correct,
            question_id: questionData.id,
            id: answer.id,
          });

        if (answerError) {
          console.error(answerError);
          throw answerError;
        }
      });
    });

    queryClient.invalidateQueries({
      queryKey: ['experiences'],
    });

    handleEditModal(false);
    reset();
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

            <UpdBeerMasterSection form={form} />
          </fieldset>
        )}
      </form>
    </ModalWithForm>
  );
}
