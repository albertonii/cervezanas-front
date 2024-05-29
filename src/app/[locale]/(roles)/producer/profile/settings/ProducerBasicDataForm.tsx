'use client';

import Button from '../../../../components/common/Button';
import Spinner from '../../../../components/common/Spinner';
import InputLabel from '../../../../components/common/InputLabel';
import InputTextarea from '../../../../components/common/InputTextarea';
import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProducerUser } from '../../../../../../lib/types/types';
import { useMessage } from '../../../../components/message/useMessage';

type FormData = {
    company_name: string;
    id_number: string;
    company_description: string;
};

const schema: ZodType<FormData> = z.object({
    company_name: z.string().nonempty(),
    id_number: z.string().nonempty(),
    company_description: z.string().nonempty(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IProducerUser;
}

export function ProducerBasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('profile_acc_data_updated');

    const { supabase } = useAuth();
    const { handleMessage } = useMessage();
    const [loading, setLoading] = useState(false);

    if (!profile.users) return <></>;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            company_name: profile.company_name,
            id_number: profile.id_number,
            company_description: profile.company_description,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateProducerBasicData = async (form: ValidationSchema) => {
        const { company_name, company_description, id_number } = form;

        const { error } = await supabase
            .from('producer_user')
            .update({
                company_name,
                company_description,
                nif: id_number,
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
        mutationKey: 'updateBasicDataProducer',
        mutationFn: handleUpdateProducerBasicData,
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
            id="account_producer_data"
            className="mb-4 space-y-3 bg-white px-6 py-4"
        >
            <span id="account-producer-data" className="text-2xl">
                {t('producer_title_acc_data')}
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <div>
                    {t('profile_acc_authorized')}:{' '}
                    {t(profile.is_authorized ? 'yes' : 'no')}
                </div>

                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'company_name'}
                        labelText={t('profile_acc_company_name')}
                        registerOptions={{
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                        }}
                        placeholder={'Productores SA'}
                    />

                    <InputLabel
                        form={form}
                        label={'id_number'}
                        labelText={t('profile_acc_nif')}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={'11223344A'}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3 ">
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
                        center
                    />
                )}

                <Button primary medium btnType={'submit'} disabled={loading}>
                    {t('save')}
                </Button>
            </form>
        </section>
    );
}
