'use client';

import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProducerUser } from '@/lib//types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

type FormData = {
    company_ig?: string;
    company_fb?: string;
    company_linkedin?: string;
    company_website?: string;
};

const schema: ZodType<FormData> = z.object({
    company_ig: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    company_fb: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    company_linkedin: z
        .string()
        .refine(
            (value) => value === '' || /^[a-zA-Z0-9._]{1,30}$/.test(value),
            {
                message:
                    'Solo se permiten caracteres alfanuméricos, puntos y guiones bajos, con un máximo de 30 caracteres.',
            },
        )
        .optional(),
    company_website: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IProducerUser;
}

export function RRSSForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.profile_rrss_data_updated');

    const { supabase } = useAuth();

    if (!profile || !profile.users) return <></>;

    const { handleMessage } = useMessage();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company_ig: profile.company_ig,
            company_fb: profile.company_fb,
            company_linkedin: profile.company_linkedin,
            company_website: profile.company_website,
        },
    });

    const { handleSubmit } = form;

    const handleUpdataBasicData = async (form: ValidationSchema) => {
        const { company_ig, company_fb, company_linkedin, company_website } =
            form;

        const { error } = await supabase
            .from('producer_user')
            .update({
                company_ig,
                company_fb,
                company_linkedin,
                company_website,
            })
            .eq('user_id', profile.user_id);

        if (error) {
            handleMessage({
                type: 'error',
                message: error.message,
            });
            throw error;
        }

        handleMessage({
            type: 'success',
            message: successMessage,
        });
    };

    const handleUpdateBasicDataMutation = useMutation({
        mutationKey: ['updateRRSSDataProducer'],
        mutationFn: handleUpdataBasicData,
        onMutate: () => {
            setLoading(true);
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
            handleUpdateBasicDataMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section
            id="account_producer_data"
            className="mb-4 space-y-3 bg-white px-6 py-4 rounded-xl border"
        >
            <span id="account-producer-data" className="text-2xl">
                {t('rrss_title_acc_data')}
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'company_ig'}
                        labelText={'rrss_ig_url_name'}
                        registerOptions={{}}
                        placeholder={'@ProductorSpain'}
                        infoTooltip={t('info_tooltip.rrss_ig_info')}
                    />

                    <InputLabel
                        form={form}
                        label={'company_fb'}
                        labelText={'rrss_fb_url_name'}
                        registerOptions={{}}
                        placeholder={'@ProductorSpain'}
                        infoTooltip={t('info_tooltip.rrss_fb_info')}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3">
                    <InputLabel
                        form={form}
                        label={'company_linkedin'}
                        labelText={'rrss_linkedin_url_name'}
                        registerOptions={{}}
                        placeholder={'@ProductorSpain'}
                        infoTooltip={t('info_tooltip.rrss_linkedin_info')}
                    />

                    <InputLabel
                        form={form}
                        label={'company_website'}
                        inputType={'url'}
                        registerOptions={{}}
                        placeholder={'https://www.productores.com'}
                    />
                </div>

                {loading && (
                    <Spinner
                        color="beer-blonde"
                        size={'xLarge'}
                        absolute
                        absolutePosition="center"
                    />
                )}

                <Button primary medium btnType={'submit'} disabled={loading}>
                    {t('save')}
                </Button>
            </form>
        </section>
    );
}