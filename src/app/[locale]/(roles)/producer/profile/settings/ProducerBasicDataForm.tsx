'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import { useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { IProducerUser } from '@/lib//types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

type FormData = {
    id_number: string;
    company_name: string;
    company_description: string;
    company_legal_representative: string;
    company_phone: string;
    company_email: string;
};

const schema: ZodType<FormData> = z.object({
    id_number: z.string().nonempty({ message: 'errors.input_required' }),
    company_name: z.string().nonempty({ message: 'errors.input_required' }),
    company_description: z
        .string()
        .nonempty({ message: 'errors.input_required' }),
    company_legal_representative: z
        .string()
        .nonempty({ message: 'errors.input_required' }),
    company_phone: z
        .string()
        .regex(/^\d{9}$/, { message: 'errors.invalid_phone_number' }),
    company_email: z.string().nonempty({ message: 'errors.input_required' }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IProducerUser;
}

export function ProducerBasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.profile_acc_data_updated');

    const { supabase } = useAuth();
    const { handleMessage } = useMessage();
    const [loading, setLoading] = useState(false);

    if (!profile.users) return <></>;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            id_number: profile.id_number,
            company_name: profile.company_name,
            company_description: profile.company_description,
            company_legal_representative: profile.company_legal_representative,
            company_phone: profile.company_phone,
            company_email: profile.company_email,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateProducerBasicData = async (form: ValidationSchema) => {
        const {
            company_name,
            company_description,
            company_legal_representative,
            id_number,
            company_phone,
            company_email,
        } = form;

        const { error } = await supabase
            .from('producer_user')
            .update({
                id_number,
                company_name,
                company_description,
                company_legal_representative,
                company_email,
                company_phone,
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
            className="mb-4 space-y-3 bg-white px-6 py-4 rounded-xl border"
        >
            <span
                id="account-producer-data"
                className="text-4xl font-['NexaRust-script']"
            >
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
                        labelText={'profile_acc_company_name'}
                        registerOptions={{
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                        }}
                        placeholder={'Productores SA'}
                    />

                    <InputLabel
                        form={form}
                        label={'company_legal_representative'}
                        labelText={'profile_acc_company_legal_representative'}
                        placeholder={'Juan Pérez'}
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

                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'company_phone'}
                        labelText={'profile_acc_phone'}
                        inputType={'tel'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={'666555444'}
                    />

                    <InputLabel
                        form={form}
                        label={'company_email'}
                        labelText={'profile_acc_email'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={'cervezanas@mail.com'}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3 ">
                    <InputTextarea
                        form={form}
                        label={'company_description'}
                        placeholder={t('profile_acc_description_placeholder')}
                        infoTooltip={t('tooltips.profile_acc_description')}
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
