'use client';

import InputLabel from '../../common/InputLabel';
import InputTextarea from '../../common/InputTextarea';
import SelectInput from '../../common/SelectInput';
import ModalWithForm from '../ModalWithForm';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IAddModalExperienceBeerMasterFormData } from '../../../../../lib/types';
import { useAuth } from '../../../Auth/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BeerMasterSection } from './BeerMasterSection';

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

const schemaBeerMaster: ZodType<IAddModalExperienceBeerMasterFormData> =
  z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    description: z.string().nonempty({ message: 'errors.input_required' }),
    type: z.string().nonempty({ message: 'errors.input_required' }),
    questions: z.array(
      z.object({
        question: z.string().nonempty({ message: 'errors.input_required' }),
        answers: z.array(
          z.object({
            answer: z.string().nonempty({ message: 'errors.input_required' }),
            is_correct: z.boolean(),
          }),
        ),
      }),
    ),
  });

type ValidationSchema = z.infer<typeof schemaBeerMaster>;

export default function AddBeerMasterExperience() {
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
    questions.forEach(async (question) => {
      const { data: questionData, error: questionError } = await supabase
        .from('beer_master_questions')
        .insert({
          question: question.question,
          experience_id: experience.id,
        })
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
          .insert({
            answer: answer.answer,
            is_correct: answer.is_correct,
            question_id: questionData.id,
          });

        if (!answerData) {
          return;
        }

        if (answerError) {
          throw answerError;
        }
      });
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

  const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === ExperienceTypes.beer_master) {
      setIsBeerMasterExperience(true);
    } else {
      setIsBeerMasterExperience(false);
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
        {/* Experience Information  */}
        <fieldset className="space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
          <legend className="text-2xl">{t('experiences_info')}</legend>

          {/* Experience type  */}
          <SelectInput
            form={form}
            labelTooltip={'experience_tooltip'}
            options={experience_options}
            label={'experience'}
            registerOptions={{
              required: true,
            }}
            onChange={selectOnChange}
          />

          {/* Experience name  */}
          <InputLabel
            form={form}
            label={'name'}
            registerOptions={{
              required: true,
            }}
          />

          {/* Experience description  */}
          <InputTextarea
            form={form}
            label={'description'}
            registerOptions={{
              required: true,
            }}
            placeholder="The experience every beer lover is waiting for!"
          />
        </fieldset>

        {/* List of Q&A for Beer Master Experience  */}
        {isBeerMasterExperience && (
          <fieldset className="mt-4 space-y-4 rounded-md border-2 border-beer-softBlondeBubble p-4">
            <legend className="text-2xl">
              {t('questions_and_answers_experience')}
            </legend>

            <BeerMasterSection form={form} />
          </fieldset>
        )}
      </form>
    </ModalWithForm>
  );
}
