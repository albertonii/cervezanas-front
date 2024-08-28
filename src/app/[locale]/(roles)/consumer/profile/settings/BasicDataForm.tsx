'use client';

import { z, ZodType } from 'zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IUserTable } from '@/lib//types/types';
import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import InputLabel from '@/app/[locale]/components/common/InputLabel';
import { formatDateTypeDefaultInput } from '@/utils/formatDate';

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
    profile: IUserTable;
}

export function BasicDataForm({ profile }: Props) {
    const t = useTranslations();
    const { supabase } = useAuth();

    const { id, username, name, lastname, email } = profile;

    const [loading, setLoading] = useState(false);

    const errorMessage = t('errors.basic_data');
    const successMessage = t('profile_acc_data_updated');

    const { handleMessage } = useMessage();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name,
            lastname,
            email,
            username,
        },
    });

    const { handleSubmit } = form;

    const handleUpdateBasicData = async (form: ValidationSchema) => {
        const { name, lastname } = form;

        const { error } = await supabase
            .from('users')
            .update({
                name,
                lastname,
                updated_at: formatDateTypeDefaultInput(new Date()),
            })
            .eq('id', id);

        if (error) {
            handleMessage({
                type: 'error',
                message: errorMessage,
            });
            throw error;
        }

        handleMessage({
            type: 'success',
            message: successMessage,
        });
    };

    const handleUpdateBasicDataMutation = useMutation({
        mutationKey: 'updateBasicData',
        mutationFn: handleUpdateBasicData,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            console.info('success');
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
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section
            id="account_basic_data"
            className="mb-4 space-y-3 rounded-md border-2 border-beer-blonde bg-white px-6 py-4 shadow-2xl"
        >
            <span
                id="account-data"
                className="text-4xl font-['NexaRust-script']"
            >
                {t('profile_title_acc_data')}
            </span>

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
                    placeholder={'user@cervezanas.com'}
                    disabled
                />

                <div className="flex w-full flex-row space-x-3 ">
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
        </section>
    );
}
