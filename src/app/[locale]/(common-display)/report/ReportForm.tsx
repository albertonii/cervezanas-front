import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../../components/message/useMessage';
import InputLabel from '../../components/common/InputLabel';
import { useTranslations } from 'next-intl';
import InputTextarea from '../../components/common/InputTextarea';
import { DisplayInputError } from '../../components/common/DisplayInputError';
import { Button } from '../../components/common/Button';

interface ReportFormData {
  title: string;
  description: string;
  file?: FileList;
}

const schema: ZodType<ReportFormData> = z.object({
  title: z.string().min(2, { message: 'errors.min_2_characters' }).max(50, {
    message: 'errors.error_50_max_length',
  }),
  description: z
    .string()
    .min(2, { message: 'errors.min_2_characters' })
    .max(3500, {
      message: 'errors.error_3500_max_length',
    }),
  file: z.instanceof(FileList).optional(),
});

type ValidationSchema = z.infer<typeof schema>;

/**
 * This form has a title, a description and can have an image attached. Also has a submit button.
 * @returns Form for reporting a problem
 */
export default function ReportForm() {
  const t = useTranslations();
  const { user } = useAuth();
  const { handleMessage } = useMessage();

  const form = useForm<ValidationSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleInsertReport = async (form: ValidationSchema) => {
    const { title, description, file } = form;

    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file?.[0] as Blob);
    formData.append('reporter_id', user?.id as string);

    const res = await fetch(`/api/report`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 500) {
      console.error(res);

      handleMessage({
        type: 'error',
        message: `${t('errors.inserting_report')} Error message:  ${res.text}`,
      });

      return;
    }

    handleMessage({
      type: 'success',
      message: `${t('report_inserted_successfully')}`,
    });

    reset();
  };

  const onSubmit = handleSubmit(handleInsertReport);

  return (
    <section className="mx-auto max-w-xl p-4">
      <h2 className="mb-4 text-lg font-semibold">
        {t('report_problem_header')}
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputLabel
          form={form}
          label="title"
          registerOptions={{ required: true }}
          placeholder={t('report_title_placeholder')}
        />

        <InputTextarea
          form={form}
          label={'description'}
          placeholder={t('report_description_placeholder')}
        />

        <div>
          <label htmlFor="file" className="font-medium">
            {t('report_file')}
            <input
              {...register('file')}
              type="file"
              id="file"
              className="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              accept=".png,.jpg,.jpeg,.pdf,.webp,.gif"
            />
          </label>

          {errors.file && <DisplayInputError message={errors.file.message} />}
        </div>

        <Button
          title={'submit_report'}
          btnType="submit"
          class={
            'group relative my-4 flex w-full justify-center rounded-md border border-none border-transparent bg-beer-blonde px-4 py-2 text-sm font-medium hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2 '
          }
          fullSize
        >
          {t('submit')}
        </Button>
      </form>
    </section>
  );
}
