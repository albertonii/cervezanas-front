'use client';

import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/app/[locale]/components/common/Button';
import { IDistributorUser } from '@/lib//types/types';
import Spinner from '@/app/[locale]/components/common/Spinner';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import InputLabel from '@/app/[locale]/components/common/InputLabel';

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
    const successMessage = t('profile_acc_data_updated');

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
        <section
            id="account_basic_data"
            className="mb-4 space-y-3 bg-white px-6 py-4 rounded-xl border"
        >
            <span id="account-data" className="text-2xl">
                {t('profile_title_acc_data')}
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-2"
            >
                <InputLabel
                    form={form}
                    label={'username'}
                    labelText={t('profile_acc_username')}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={'user123'}
                    disabled
                />

                <InputLabel
                    form={form}
                    label={'email'}
                    labelText={t('profile_acc_email')}
                    registerOptions={{
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    }}
                    placeholder={'user@cervezanas.com'}
                    disabled
                />

                <div className="flex w-full flex-row space-x-3 ">
                    <InputLabel
                        form={form}
                        label={'name'}
                        labelText={t('profile_acc_name')}
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
