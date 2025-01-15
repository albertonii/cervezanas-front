'use client';

import Button from '../../components/ui/buttons/Button';
import InputLabel from '../../components/form/InputLabel';
import InputTextarea from '../../components/form/InputTextarea';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { DisplayInputError } from '../../components/ui/DisplayInputError';

interface ReportFormData {
    title: string;
    description: string;
    file?: FileList;
}

/**
 * Validación Zod: Título y descripción con límites de longitud.
 * El campo file es opcional y se mapea como FileList.
 */
const schema: ZodType<ReportFormData> = z.object({
    title: z
        .string()
        .min(2, { message: 'errors.min_2_characters' })
        .max(50, { message: 'errors.error_50_max_length' }),
    description: z
        .string()
        .min(2, { message: 'errors.min_2_characters' })
        .max(3500, { message: 'errors.error_3500_max_length' }),
    file: z.instanceof(FileList).optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export default function ReportForm() {
    const t = useTranslations();
    const { user } = useAuth();
    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Manejo del submit
    const handleInsertReport = async (formData: ValidationSchema) => {
        // 1) Verificar si el usuario está logueado
        if (!user || !user.id) {
            handleMessage({
                type: 'error',
                message:
                    t('errors.must_be_logged_in') ||
                    'Debes iniciar sesión para enviar un reporte.',
            });
            return;
        }

        setIsSubmitting(true);
        const { title, description, file } = formData;

        // 2) Construir FormData
        const body = new FormData();
        body.append('title', title);
        body.append('description', description);
        body.append('reporter_id', user.id); // Aseguramos que no sea null

        if (file && file[0]) {
            body.append('file', file[0]);
        }

        // 3) Petición POST
        try {
            const res = await fetch('/api/report', {
                method: 'POST',
                body,
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                console.error('Error creating report:', errorResponse?.error);
                handleMessage({
                    type: 'error',
                    message: t('errors.inserting_report'),
                });
            } else {
                handleMessage({
                    type: 'success',
                    message: t('success.report_inserted'),
                });
                reset();
            }
        } catch (error: any) {
            console.error('Unexpected error creating report:', error);
            handleMessage({
                type: 'error',
                message: `${t('errors.inserting_report')}: ${error?.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = handleSubmit(handleInsertReport);

    return (
        <section className="mx-auto max-w-xl p-4">
            {/* Encabezado y Copywriting */}
            <header className="mb-6 space-y-2">
                <h2 className="text-xl font-semibold">
                    {t('report_problem_header')}
                </h2>
                <p className="text-sm text-gray-600">
                    {/* Ajusta el texto a tu conveniencia */}
                    {t('report_problem_instructions') ||
                        '¿Has encontrado un bug o algún error en la plataforma? Completa este formulario para ayudarnos a identificar y solucionar el problema. ¡Gracias por tu colaboración!'}
                </p>
            </header>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* Título */}
                <InputLabel
                    form={form}
                    label="title"
                    registerOptions={{ required: true }}
                    placeholder={
                        t('report_title_placeholder') ||
                        'Ej: Error al iniciar sesión'
                    }
                />

                {/* Descripción */}
                <InputTextarea
                    form={form}
                    label="description"
                    placeholder={
                        t('report_description_placeholder') ||
                        'Describe los pasos para reproducir el error...'
                    }
                    registerOptions={{ required: true }}
                />

                {/* Archivo (opcional) */}
                <div>
                    <label
                        htmlFor="file"
                        className="mb-1 block font-medium text-gray-700"
                    >
                        {t('report_file') || 'Archivo adjunto (opcional)'}
                    </label>
                    <input
                        {...register('file')}
                        type="file"
                        id="file"
                        accept=".png,.jpg,.jpeg,.pdf,.webp,.gif"
                        className="block w-full cursor-pointer rounded border border-gray-300 bg-white px-3 py-2 text-sm leading-tight text-gray-700 
            focus:border-gray-500 focus:bg-white focus:outline-none"
                    />
                    {errors.file && (
                        <DisplayInputError message={errors.file.message} />
                    )}
                </div>

                {/* Botón de envío */}
                <Button
                    title={'submit_report'}
                    btnType="submit"
                    disabled={isSubmitting}
                    class={
                        'group relative my-2 flex w-full justify-center rounded-md border-none bg-beer-blonde px-4 py-2 text-sm font-medium transition-colors ' +
                        'hover:bg-beer-draft hover:font-semibold hover:text-beer-blonde focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2'
                    }
                    fullSize
                >
                    {isSubmitting
                        ? t('report_submitting_btn') || 'Enviando...'
                        : t('submit') || 'Enviar reporte'}
                </Button>
            </form>
        </section>
    );
}
