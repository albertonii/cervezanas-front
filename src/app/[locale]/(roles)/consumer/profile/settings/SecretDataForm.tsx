'use client';

import { z, ZodType } from 'zod';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../../../components/common/Button';
import Spinner from '../../../../components/common/Spinner';
import { useMessage } from '../../../../components/message/useMessage';
import InputLabel from '../../../../components/common/InputLabel';

type FormData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

const schema: ZodType<FormData> = z
  .object({
    old_password: z.string().min(8, { message: 'Required' }),
    new_password: z.string().min(8, { message: 'Required' }),
    confirm_password: z.string().min(8, { message: 'Required' }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ['confirm_password'],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof schema>;

export function SecretDataForm() {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [loading, setLoading] = useState(false);

  const { handleMessage } = useMessage();

  const form = useForm<FormData>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const { handleSubmit, reset } = form;

  const handleUpdatePassword = async (form: ValidationSchema) => {
    // TODO: Check if old password is correct
    const { new_password } = form;

    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error) throw error;

    handleMessage({
      type: 'success',
      message: 'password_updated',
    });

    reset();
  };

  const handleUpdatePasswordMutation = useMutation({
    mutationKey: 'updatePassword',
    mutationFn: handleUpdatePassword,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error: Error) => {
      handleMessage({
        type: 'error',
        message: error.message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (
    formValues: FormData,
  ) => {
    try {
      handleUpdatePasswordMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section
      id="account_secret_data"
      className="mb-4 space-y-3  rounded-md border-2 border-beer-blonde  bg-white px-6 py-4 shadow-2xl"
    >
      <h2 id="password" className="text-2xl">
        {t('password')}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <InputLabel
          form={form}
          label={'old_password'}
          labelText={t('actual_password')}
          registerOptions={{
            required: true,
          }}
          placeholder="**********"
          inputType="password"
        />

        <InputLabel
          form={form}
          label={'new_password'}
          registerOptions={{
            required: true,
          }}
          placeholder="**********"
          inputType="password"
        />

        <InputLabel
          form={form}
          label={'confirm_password'}
          registerOptions={{
            required: true,
          }}
          placeholder="**********"
          inputType="password"
        />

        {loading && (
          <Spinner color="beer-blonde" size={'xLarge'} absolute center />
        )}

        <Button primary medium btnType={'submit'} disabled={loading}>
          {t('save')}
        </Button>
      </form>
    </section>
  );
}
