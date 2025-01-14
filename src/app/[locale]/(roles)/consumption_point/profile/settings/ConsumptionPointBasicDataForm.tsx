'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import { useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IConsumptionPointUser } from '@/lib/types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

type FormData = {
    company_name: string;
    company_description: string;
};

const schema: ZodType<FormData> = z.object({
    company_name: z.string().nonempty(),
    company_description: z.string().nonempty(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IConsumptionPointUser;
}

export function ConsumptionPointBasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.profile_acc_data_updated');

    const { supabase } = useAuth();
    const { handleMessage } = useMessage();
    const [loading, setLoading] = useState(false);

    if (!profile.users) return <></>;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company_name: profile.company_name,
            company_description: profile.company_description,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateConsumptionPointBasicData = async (
        form: ValidationSchema,
    ) => {
        const { company_name, company_description } = form;

        const { error } = await supabase
            .from('consumption_point_user')
            .update({
                company_name,
                company_description,
            })
            .eq('user_id', profile.user_id);

        if (error) {
            handleMessage({
                type: 'error',
                message: error.message,
            });
            throw error;
        }

        handleMessage({ type: 'success', message: successMessage });
    };

    const handleUpdateBasicDataMutation = useMutation({
        mutationKey: 'updateBasicDataConsumptionPoint',
        mutationFn: handleUpdateConsumptionPointBasicData,
        onMutate: () => setLoading(true),
        onError: (error: any) => {
            handleMessage({ type: 'error', message: error.message });
        },
        onSettled: () => setLoading(false),
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
            id="account_consumption_point_data"
            className="mb-4 space-y-3 bg-white px-6 py-4"
        >
            <span id="account-consumption_point-data" className="text-2xl">
                {t('consumption_point_title_acc_data')}
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <div>
                    {t('profile_acc_authorized')}:{' '}
                    {t(profile.is_authorized ? 'yes' : 'no')}
                </div>

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <InputLabel
                        form={form}
                        label={'company_name'}
                        labelText={'profile_acc_company_name'}
                        registerOptions={{
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                        }}
                        placeholder={'Punto de Consumo SA'}
                    />

                    <InputLabel
                        form={form}
                        label={'id_number'}
                        labelText={'profile_acc_nif_cif'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={'11223344A'}
                    />
                </div>

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <InputTextarea
                        form={form}
                        label={'company_description'}
                        placeholder={t('profile_acc_description_placeholder')}
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
