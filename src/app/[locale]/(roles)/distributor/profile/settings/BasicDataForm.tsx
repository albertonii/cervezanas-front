'use client';

import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IDistributorUser } from '@/lib/types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Title from '@/app/[locale]/components/ui/Title';
import ProfileSettingsContainer from '@/app/[locale]/components/ui/ProfileSettingsContainer';

type FormData = {
    name: string;
    lastname: string;
};

const schema: ZodType<FormData> = z.object({
    name: z.string().min(2, { message: 'errors.input_required' }).max(50, {
        message: 'errors.error_50_max_length',
    }),
    lastname: z.string().min(2, { message: 'errors.input_required' }).max(50, {
        message: 'errors.error_50_max_length',
    }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    profile: IDistributorUser;
}

export function BasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const successMessage = t('success.');

    const { supabase } = useAuth();

    if (!profile || !profile.users) return <></>;

    const { id, username, name, lastname, email } = profile.users;

    const { handleMessage } = useMessage();

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username,
            name,
            lastname,
            email,
        },
    });

    const { handleSubmit } = form;

    const handleUpdataBasicData = async (form: ValidationSchema) => {
        const { name, lastname } = form;

        const { error } = await supabase
            .from('users')
            .update({
                name,
                lastname,
                updated_at: formatDateTypeDefaultInput(new Date()),
            })
            .eq('id', id);

        if (error) throw error;

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
        onSuccess: () => {
            console.info('Basic data updated');
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
        <ProfileSettingsContainer sectionId="account_basic_data">
            <Title size="large" color="black">
                {t('profile_title_acc_data')}
            </Title>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <InputLabel
                    form={form}
                    label={'username'}
                    labelText={'profile_acc_username'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={'user123'}
                    disabled
                />

                <InputLabel
                    form={form}
                    label={'email'}
                    labelText={'profile_acc_email'}
                    registerOptions={{
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    }}
                    placeholder={'user@cervezanas.beer'}
                    disabled
                />

                <div className="block sm:flex w-full sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <InputLabel
                        form={form}
                        label={'name'}
                        labelText={'profile_acc_name'}
                        registerOptions={{
                            required: true,
                            maxLength: 50,
                        }}
                    />

                    <InputLabel
                        form={form}
                        label={'lastname'}
                        registerOptions={{
                            required: true,
                            maxLength: 50,
                        }}
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
