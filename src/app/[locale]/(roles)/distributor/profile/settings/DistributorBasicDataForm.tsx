'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import InputTextarea from '@/app/[locale]/components/form/InputTextarea';
import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib//types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import Title from '@/app/[locale]/components/ui/Title';
import ProfileSettingsContainer from '@/app/[locale]/components/ui/ProfileSettingsContainer';

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
    profile: IDistributorUser;
}

export function DistributorBasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.profile_acc_data_updated');

    const { supabase } = useAuth();

    if (!profile || !profile.users) return <></>;

    const { handleMessage } = useMessage();

    const [loading, setLoading] = useState(false);

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

    const handleUpdataBasicData = async (form: ValidationSchema) => {
        const {
            company_name,
            id_number,
            company_description,
            company_legal_representative,
            company_phone,
            company_email,
        } = form;

        const { error } = await supabase
            .from('distributor_user')
            .update({
                id_number,
                company_name,
                company_description,
                company_legal_representative,
                company_phone,
                company_email,
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
        mutationKey: ['updateBasicDataDistributor'],
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
        <ProfileSettingsContainer sectionId="account_distributor_data">
            <Title size="large" color="black">
                {t('distributor_title_acc_data')}
            </Title>

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
                        placeholder={'Distribuidores SA'}
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

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
        </ProfileSettingsContainer>
    );
}
