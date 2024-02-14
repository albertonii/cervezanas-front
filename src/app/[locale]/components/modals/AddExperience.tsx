'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IExperience } from '../../../../lib/types';
import { useAuth } from '../../Auth/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputLabel from '../common/InputLabel';
import InputTextarea from '../common/InputTextarea';
import SelectInput from '../common/SelectInput';
import ModalWithForm from './ModalWithForm';

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

export type ModalAddExperienceFormData = {
  name: string;
  description: string;
  type: string;
};

const schema: ZodType<ModalAddExperienceFormData> = z.object({
  name: z.string().nonempty({ message: 'errors.input_required' }),
  description: z.string().nonempty({ message: 'errors.input_required' }),
  type: z.string().nonempty({ message: 'errors.input_required' }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
  experiences: IExperience[];
}

export default function AddExperience({ experiences }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isBeerMasterExperience, setIsBeerMasterExperience] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const form = useForm<ValidationSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
  });

  const { handleSubmit, reset } = form;

  const handleInsertExperience = async (form: ValidationSchema) => {
    const { name, description, type } = form;

    // Create experience
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .insert({
        name,
        description,
        type,
      })
      .select()
      .single();

    if (!experience) {
      return;
    }

    if (experienceError) {
      throw experienceError;
    }

    reset();
  };

  const insertExperienceMutation = useMutation({
    mutationKey: 'insertExperience',
    mutationFn: handleInsertExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setShowModal(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: ModalAddExperienceFormData,
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
          </fieldset>
        )}
      </form>
    </ModalWithForm>
  );
}
